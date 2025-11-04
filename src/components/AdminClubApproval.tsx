import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, MapPin, Phone, Mail } from "lucide-react";

export const AdminClubApproval = () => {
  const [pendingClubs, setPendingClubs] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingClubs();
  }, []);

  const fetchPendingClubs = async () => {
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching clubs:", error);
    } else {
      setPendingClubs(data || []);
    }
  };

  const handleApproval = async (clubId: string, approved: boolean) => {
    const updateData: any = { 
      status: approved ? "approved" : "rejected"
    };

    if (approved) {
      updateData.affiliation_date = new Date().toISOString().split('T')[0];
    }

    const { error } = await supabase
      .from("clubs")
      .update(updateData)
      .eq("id", clubId);

    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: approved ? "Club approuvé !" : "Club rejeté",
        description: approved
          ? "Le club a été affilié avec succès"
          : "La demande d'affiliation a été rejetée",
      });
      fetchPendingClubs();
    }
  };

  if (pendingClubs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demandes d'affiliation de clubs</CardTitle>
          <CardDescription>Aucune demande en attente</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Demandes d'affiliation de clubs</h3>
      {pendingClubs.map((club) => (
        <Card key={club.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{club.name}</CardTitle>
                <CardDescription className="space-y-2 mt-2">
                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="mr-2" />
                    {club.address}, {club.postal_code} {club.city}
                    {club.region && `, ${club.region}`}
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail size={16} className="mr-2" />
                    {club.contact_email}
                  </div>
                  {club.contact_phone && (
                    <div className="flex items-center text-sm">
                      <Phone size={16} className="mr-2" />
                      {club.contact_phone}
                    </div>
                  )}
                  {club.president_name && (
                    <p className="text-sm">
                      Président: {club.president_name}
                    </p>
                  )}
                </CardDescription>
              </div>
              <Badge variant="secondary">En attente</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                onClick={() => handleApproval(club.id, true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approuver
              </Button>
              <Button
                onClick={() => handleApproval(club.id, false)}
                variant="destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Rejeter
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
