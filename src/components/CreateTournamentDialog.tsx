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

export const CreateTournamentDialog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    location: "",
    city: "",
    region: "",
    start_date: "",
    max_participants: "",
    entry_fee: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("tournaments")
        .insert({
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
          organizer_id: user.id,
        });

      if (error) throw error;

      toast({
        title: t.tournaments?.tournamentCreated || "Tournament created!",
        description: t.tournaments?.tournamentCreatedDesc || "Your tournament is pending admin approval",
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
        max_participants: "",
        entry_fee: "",
      });
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
        <Button size="lg" className="bg-accent hover:bg-accent-dark text-accent-foreground">
          <Plus className="mr-2 h-5 w-5" />
          {t.tournaments?.createTournament || "Créer un tournoi"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.tournaments?.createTournament || "Créer un tournoi"}</DialogTitle>
          <DialogDescription>
            {t.tournaments?.createTournamentDesc || "Créez un nouveau tournoi qui sera validé par les administrateurs"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.tournaments?.tournamentName || "Nom du tournoi"} *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.tournaments?.description || "Description"}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">{t.tournaments?.type || "Type"} *</Label>
            <Select
              required
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.tournaments?.selectType || "Sélectionner le type"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">{t.tournaments?.local || "Local"}</SelectItem>
                <SelectItem value="regional">{t.tournaments?.regional || "Régional"}</SelectItem>
                <SelectItem value="national">{t.tournaments?.national || "National"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">{t.tournaments?.city || "Ville"} *</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">{t.tournaments?.region || "Région"}</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t.tournaments?.location || "Lieu précis"}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_date">{t.tournaments?.startDate || "Date de début"} *</Label>
            <Input
              id="start_date"
              type="datetime-local"
              required
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_participants">{t.tournaments?.maxParticipants || "Participants max"}</Label>
              <Input
                id="max_participants"
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entry_fee">{t.tournaments?.entryFee || "Frais d'inscription (€)"}</Label>
              <Input
                id="entry_fee"
                type="number"
                step="0.01"
                value={formData.entry_fee}
                onChange={(e) => setFormData({ ...formData, entry_fee: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (t.common?.loading || "Loading...") : (t.tournaments?.submit || "Soumettre")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
