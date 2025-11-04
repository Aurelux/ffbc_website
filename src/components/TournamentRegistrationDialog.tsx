import { useState } from "react";
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

interface TournamentRegistrationDialogProps {
  tournamentId: string;
  tournamentName: string;
  onRegistrationSuccess?: () => void;
}

export const TournamentRegistrationDialog = ({
  tournamentId,
  tournamentName,
  onRegistrationSuccess,
}: TournamentRegistrationDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: t.common?.error || "Error",
        description: t.tournaments?.mustBeLoggedIn || "You must be logged in to register",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("tournament_registrations")
        .insert({
          tournament_id: tournamentId,
          user_id: user.id,
          team_name: teamName || null,
          payment_status: "pending",
        });

      if (error) throw error;

      // Update tournament participant count
      const { data: tournament } = await supabase
        .from("tournaments")
        .select("current_participants")
        .eq("id", tournamentId)
        .single();

      if (tournament) {
        await supabase
          .from("tournaments")
          .update({ current_participants: (tournament.current_participants || 0) + 1 })
          .eq("id", tournamentId);
      }

      toast({
        title: t.tournaments?.registrationSuccess || "Registration successful!",
        description: t.tournaments?.registrationSuccessDesc || "You have been registered for the tournament",
      });

      setOpen(false);
      setTeamName("");
      onRegistrationSuccess?.();
    } catch (error: any) {
      toast({
        title: t.common?.error || "Error",
        description: error.message,
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
          {t.tournaments?.register || "S'inscrire au tournoi"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.tournaments?.registerFor || "S'inscrire à"} {tournamentName}</DialogTitle>
          <DialogDescription>
            {t.tournaments?.enterTeamName || "Entrez le nom de votre équipe (optionnel)"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">{t.tournaments?.teamName || "Nom d'équipe"}</Label>
            <Input
              id="team-name"
              placeholder={t.tournaments?.teamNamePlaceholder || "Mon équipe"}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
          <Button onClick={handleRegister} disabled={loading} className="w-full">
            {loading ? (t.common?.loading || "Loading...") : (t.tournaments?.confirm || "Confirmer l'inscription")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
