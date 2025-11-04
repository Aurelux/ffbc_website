import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Calendar, MapPin } from "lucide-react";

export const AdminTournamentApproval = () => {
  const [pendingTournaments, setPendingTournaments] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingTournaments();
  }, []);

  const fetchPendingTournaments = async () => {
    const { data, error } = await supabase
      .from("tournaments")
      .select(`
        *,
        profiles:organizer_id (first_name, last_name, email)
      `)
      .eq("status", "upcoming")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tournaments:", error);
    } else {
      setPendingTournaments(data || []);
    }
  };

  const handleApproval = async (tournamentId: string, approved: boolean) => {
    const { error } = await supabase
      .from("tournaments")
      .update({ status: approved ? "upcoming" : "cancelled" })
      .eq("id", tournamentId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: approved ? "Tournament approved!" : "Tournament rejected",
        description: approved
          ? "The tournament is now visible to all users"
          : "The tournament has been rejected",
      });
      fetchPendingTournaments();
    }
  };

  if (pendingTournaments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Tournament Approvals</CardTitle>
          <CardDescription>No tournaments pending approval</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Pending Tournament Approvals</h3>
      {pendingTournaments.map((tournament) => (
        <Card key={tournament.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{tournament.name}</CardTitle>
                <CardDescription className="space-y-2 mt-2">
                  <div className="flex items-center text-sm">
                    <Calendar size={16} className="mr-2" />
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="mr-2" />
                    {tournament.city}, {tournament.region}
                  </div>
                  {tournament.profiles && (
                    <p className="text-sm">
                      Organizer: {tournament.profiles.first_name} {tournament.profiles.last_name} ({tournament.profiles.email})
                    </p>
                  )}
                </CardDescription>
              </div>
              <Badge variant="secondary">{tournament.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {tournament.description && (
              <p className="text-sm text-muted-foreground mb-4">{tournament.description}</p>
            )}
            <div className="flex gap-2">
              <Button
                onClick={() => handleApproval(tournament.id, true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={() => handleApproval(tournament.id, false)}
                variant="destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
