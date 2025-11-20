import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Handshake, UserCheck } from "lucide-react";

interface TournamentRegistrationDialogProps {
  tournamentId: string;
  tournamentName: string;
  registrationType: "individual" | "team";
  onRegistrationSuccess?: () => void;
}

export const TournamentRegistrationDialog = ({
  tournamentId,
  tournamentName,
  registrationType,
  onRegistrationSuccess,
}: TournamentRegistrationDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [partnerLicense, setPartnerLicense] = useState("");
  const [myLicense, setMyLicense] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Récupère automatiquement le numéro de licence du joueur connecté
  useEffect(() => {
    const fetchLicense = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("licenses")
        .select("license_number")
        .eq("user_id", user.id)
        .single();
      if (!error && data) setMyLicense(data.license_number);
    };
    fetchLicense();
  }, [user]);

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: t.common?.error || "Erreur",
        description: "Vous devez être connecté pour vous inscrire.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let payload: any = {
        tournament_id: tournamentId,
        user_id: user.id,
        payment_status: "pending",
      };

      if (registrationType === "team") {
        if (!teamName || !partnerLicense) {
          toast({
            title: "Informations manquantes",
            description: "Veuillez renseigner le nom de l'équipe et le numéro de licence de votre coéquipier.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Cherche le coéquipier via sa licence
        const { data: partnerData, error: partnerError } = await supabase
          .from("licenses")
          .select("user_id")
          .eq("license_number", partnerLicense)
          .single();

        if (partnerError || !partnerData) {
          throw new Error("Aucun joueur trouvé avec ce numéro de licence.");
        }

        payload = {
          ...payload,
          team_name: teamName,
          partner_id: partnerData.user_id,
          my_license: myLicense,
          partner_license: partnerLicense,
        };
      }

      const { error } = await supabase.from("tournament_registrations").insert(payload);
      if (error) throw error;
const { data: tournament } = await supabase .from("tournaments") .select("current_participants,registration_type") .eq("id", tournamentId) .single();
      // 🔹 Mise à jour du nombre de participants
if (tournament) {
  const increment = tournament.registration_type === "team" ? 2 : 1;

  await supabase
    .from("tournaments")
    .update({
      current_participants: (tournament.current_participants || 0) + increment,
    })
    .eq("id", tournamentId);
}
      toast({
        title: "Inscription confirmée !",
        description:
          "Votre inscription est enregistrée. Vous pourrez la retrouver dans votre profil. ⚠️ Vous pouvez l’annuler jusqu’à 2 jours avant le tournoi, passé ce délai elle sera considérée comme forfait.",
      });

      setOpen(false);
      setTeamName("");
      setPartnerLicense("");
      onRegistrationSuccess?.();
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary-light text-primary-foreground">
          {registrationType === "team" ? (
            <>
              <Handshake size={18} className="mr-2" />
              S'inscrire en duo
            </>
          ) : (
            <>
              <UserCheck size={18} className="mr-2" />
              S'inscrire au tournoi
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {registrationType === "team"
              ? `Inscription en duo - ${tournamentName}`
              : `Inscription - ${tournamentName}`}
          </DialogTitle>
          <DialogDescription>
            {registrationType === "team"
              ? "Complétez les informations de votre équipe avant de confirmer votre inscription."
              : "Confirmez simplement votre participation au tournoi."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {registrationType === "team" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="team-name">Nom de l'équipe</Label>
                <Input
                  id="team-name"
                  placeholder="Les As du Trèfle"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="my-license">Votre numéro de licence</Label>
                <Input
                  id="my-license"
                  value={myLicense}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner-license">Numéro de licence du coéquipier</Label>
                <Input
                  id="partner-license"
                  placeholder="Ex : 12345678"
                  value={partnerLicense}
                  onChange={(e) => setPartnerLicense(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
  Vous pourrez retrouver votre inscription à ce tournoi dans votre profil.<br/> 
  Vous pouvez l’annuler jusqu’à 2 jours avant le tournoi, sinon vous serez considéré(s) comme forfait. <br/> 
  Les frais d’inscription seront à régler sur place le jour du tournoi.
</p>
            </>
          ) : (
            <>
            <div className="space-y-2">
                <Label htmlFor="my-license">Votre numéro de licence</Label>
                <Input
                  id="my-license"
                  value={myLicense}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            <p className="text-sm text-muted-foreground">
  Vous pourrez retrouver votre inscription à ce tournoi dans votre profil.<br/> 
  Vous pouvez l’annuler jusqu’à 2 jours avant le tournoi, sinon vous serez considéré(s) comme forfait. <br/> 
  Les frais d’inscription seront à régler sur place le jour du tournoi.
</p>
</>


            
          )}

          <Button onClick={handleRegister} disabled={loading} className="w-full">
            {loading ? "Inscription en cours..." : "Confirmer l'inscription"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
