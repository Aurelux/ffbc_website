import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

export const AdminScoreValidation = () => {
  const [pendingMatches, setPendingMatches] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingMatches();
  }, []);

  const fetchPendingMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select(`
        *,
        tournament:tournaments (name, organizer_id, profiles:organizer_id(first_name, last_name))
      `)
      .eq("score_validated", false)
      .not("team_a_score", "is", null)
      .not("team_b_score", "is", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching matches:", error);
    } else {
      setPendingMatches(data || []);
    }
  };

  const handleValidation = async (matchId: string, validated: boolean) => {
    const { error } = await supabase
      .from("matches")
      .update({ 
        score_validated: validated,
        validated_at: validated ? new Date().toISOString() : null,
        validated_by: validated ? (await supabase.auth.getUser()).data.user?.id : null,
      })
      .eq("id", matchId);

    if (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: validated ? "Score validé !" : "Score rejeté",
        description: validated
          ? "Le score a été validé avec succès"
          : "Le score a été rejeté",
      });
      fetchPendingMatches();
    }
  };

  if (pendingMatches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Validation des scores</CardTitle>
          <CardDescription>Aucun score en attente de validation</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Validation des scores</h3>
      {pendingMatches.map((match) => (
        <Card key={match.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  {match.tournament?.name || "Tournoi inconnu"}
                </CardTitle>
                <CardDescription className="space-y-1 mt-2">
                  <p className="text-sm">
                    Round {match.round_number} - Table {match.table_number || "?"}
                  </p>
                  {match.tournament?.profiles && (
                    <p className="text-sm">
                      Organisateur: {match.tournament.profiles.first_name}{" "}
                      {match.tournament.profiles.last_name}
                    </p>
                  )}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {match.team_a_score} - {match.team_b_score}
                </div>
                <Badge variant={match.winner === "draw" ? "secondary" : "default"}>
                  {match.winner === "team_a" && "Équipe A gagne"}
                  {match.winner === "team_b" && "Équipe B gagne"}
                  {match.winner === "draw" && "Match nul"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                onClick={() => handleValidation(match.id, true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Valider
              </Button>
              <Button
                onClick={() => handleValidation(match.id, false)}
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
