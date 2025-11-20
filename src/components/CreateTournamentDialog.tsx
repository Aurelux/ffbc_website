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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";

const REGIONS = [
  "Auvergne-Rhône-Alpes",
  "Bourgogne-Franche-Comté",
  "Bretagne",
  "Centre-Val de Loire",
  "Corse",
  "Grand Est",
  "Hauts-de-France",
  "Île-de-France",
  "Normandie",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Pays de la Loire",
  "Provence-Alpes-Côte d’Azur",
  "Guadeloupe",
  "Martinique",
  "La Réunion",
];

export const CreateTournamentDialog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regionQuery, setRegionQuery] = useState("");
  const [stopIci, setStopIci] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    location: "",
    city: "",
    region: "",
    start_date: "",
    max_participants: 16,
    entry_fee: 0,
    registration_type: "",
    game_type: "",        // belote | coinche
  tout_atout: false,
  sans_atout: false, // <-- nouveau champ
  });

  const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const filteredRegions = REGIONS.filter((r) =>
  normalize(r).includes(normalize(regionQuery))
);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("tournaments").insert({
        name: formData.name,
        description: formData.description || null,
        type: formData.type as any,
        location: formData.location || null,
        city: formData.city,
        region: formData.region || null,
        start_date: formData.start_date,
        status: "upcoming" as any,
        max_participants: parseInt(formData.max_participants) || null,
        entry_fee: parseFloat(formData.entry_fee) || null,
        registration_type: formData.registration_type || null, // <-- ajouté ici
        organizer_id: user.id,
        game_type: formData.game_type,        // belote | coinche
  tout_atout: formData.tout_atout,
 
      });

      if (error) throw error;

      toast({
        title: t.tournaments?.tournamentCreated || "Tournoi créé !",
        description:
          t.tournaments?.tournamentCreatedDesc ||
          "Votre tournoi est en attente de validation par un administrateur.",
      });

      setOpen(false);
      setFormData({
        name: "",
        description: "",
        type: "",
        location: "",
        city: "",
        region: "",
        start_date: "",
        max_participants: 16,
    entry_fee: 0,
    registration_type: "",
    game_type: "",        // belote | coinche
  tout_atout: false,
  sans_atout: false, 
      });
    } catch (error: any) {
      toast({
        title: t.common?.error || "Erreur",
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
        <Button size="lg" className="bg-accent hover:bg-accent-dark text-accent-foreground">
          <Plus className="mr-2 h-5 w-5" />
          {t.tournaments?.createTournament || "Créer un tournoi"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.tournaments?.createTournament || "Créer un tournoi"}</DialogTitle>
          <DialogDescription>
            {t.tournaments?.createTournamentDesc ||
              "Créez un nouveau tournoi qui sera validé par les administrateurs."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="name">{t.tournaments?.tournamentName || "Nom du tournoi"} *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t.tournaments?.description || "Description"}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Type de tournoi */}
          <div className="space-y-2">
            <Label htmlFor="type">{t.tournaments?.type || "Type"} *</Label>
            <Select
              required
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="regional">Régional</SelectItem>
                <SelectItem value="national">National</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type d'inscription */}
          <div className="space-y-2">
            <Label htmlFor="registration_type">Type d'inscription *</Label>
            <Select
              required
              value={formData.registration_type}
              onValueChange={(value) => setFormData({ ...formData, registration_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type d'inscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Inscription en équipe</SelectItem>
                <SelectItem value="individual">Inscription individuelle (équipe aléatoire)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ville / Région */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="region">Région</Label>
              <Input
                id="region"
                value={regionQuery}
                onChange={(e) => {
                  setRegionQuery(e.target.value);
                  setFormData({ ...formData, region: e.target.value });
                }}
              />
              {regionQuery && filteredRegions.length > 0 && !stopIci && (
                <div className="absolute z-10 w-full bg-background border rounded-md mt-1 max-h-40 overflow-y-auto shadow">
                  {filteredRegions.map((region) => (
                    <div
                      key={region}
                      className="px-3 py-2 hover:bg-accent cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, region });
                        setRegionQuery(region);
                        setStopIci(true);
                      }}
                    >
                      {region}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Lieu précis */}
          <div className="space-y-2">
            <Label htmlFor="location">Lieu précis</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="start_date">Date de début *</Label>
            <Input
              id="start_date"
              type="datetime-local"
              required
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>

          
          {/* Type de jeu */}
<div className="space-y-2">
  <Label htmlFor="game_type">Type de jeu *</Label>
  <select
    id="game_type"
    className="border rounded-md p-2 w-full bg-background"
    value={formData.game_type}
    onChange={(e) =>
      setFormData({ ...formData, game_type: e.target.value })
    }
    required
  >
    <option value="">Sélectionner...</option>
    <option value="belote">Belote</option>
    <option value="coinche">Coinche</option>
  </select>
</div>

{/* Options Coinche */}
{formData.game_type === "coinche" && (
  <div className="space-y-2 pl-2">
    <Label>Options Coinche</Label>

    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="tout_atout"
        checked={formData.tout_atout || false}
        onChange={(e) =>
          setFormData({ ...formData, tout_atout: e.target.checked })
        }
      />
      <Label htmlFor="tout_atout">Avec Tout Atout et Sans Atout</Label>
    </div>

    
  </div>
)}



          {/* Participants / frais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_participants">Participants max</Label>
              <Input
                id="max_participants"
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entry_fee">Frais d'inscription (€)</Label>
              <Input
                id="entry_fee"
                type="number"
                step="0.1"
                value={formData.entry_fee}
                onChange={(e) => setFormData({ ...formData, entry_fee: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Chargement..." : "Soumettre"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
