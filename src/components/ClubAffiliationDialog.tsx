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
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield } from "lucide-react";

interface ClubAffiliationDialogProps {
  isFree: boolean;
}

export const ClubAffiliationDialog = ({ isFree }: ClubAffiliationDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    postalCode: "",
    city: "",
    region: "",
    presidentName: "",
    contactEmail: user?.email || "",
    contactPhone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("clubs")
        .insert({
          name: formData.name,
          address: formData.address,
          postal_code: formData.postalCode,
          city: formData.city,
          region: formData.region || null,
          president_name: formData.presidentName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone || null,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée !",
        description: "Votre demande d'affiliation de club est en attente de validation",
      });

      setOpen(false);
      setFormData({
        name: "",
        address: "",
        postalCode: "",
        city: "",
        region: "",
        presidentName: "",
        contactEmail: user?.email || "",
        contactPhone: "",
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
        <Button className="w-full bg-accent hover:bg-accent-dark text-accent-foreground">
          <Shield className="mr-2 h-4 w-4" />
          Affilier mon club
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Affiliation de club</DialogTitle>
          <DialogDescription>
            Enregistrez votre club pour bénéficier de l'affiliation officielle
            {isFree && " - GRATUIT pour les 50 premiers clubs !"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du club *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse *</Label>
            <Input
              id="address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input
                id="postalCode"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Région</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="presidentName">Nom du président *</Label>
            <Input
              id="presidentName"
              required
              value={formData.presidentName}
              onChange={(e) => setFormData({ ...formData, presidentName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de contact *</Label>
              <Input
                id="contactEmail"
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Téléphone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Envoi..." : "Envoyer la demande"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
