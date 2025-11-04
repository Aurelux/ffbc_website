import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const MatchScoreEntry = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    fetchOrganizerTournaments();
  }, [user]);

  useEffect(() => {
    if (selectedTournament) {
      fetchTournamentMatches();
    }
  }, [selectedTournament]);

  const fetchOrganizerTournaments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .eq("organizer_id", user.id)
      .in("status", ["upcoming", "ongoing"]);

    if (error) {
      console.error("Error fetching tournaments:", error);
    } else {
      setTournaments(data || []);
    }
  };

  const fetchTournamentMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("tournament_id", selectedTournament)
      .order("round_number", { ascending: true });

    if (error) {
      console.error("Error fetching matches:", error);
    } else {
      setMatches(data || []);
    }
  };

  const handleScoreUpdate = async (matchId: string, teamAScore: number, teamBScore: number) => {
    const winner = teamAScore > teamBScore ? "team_a" : teamBScore > teamAScore ? "team_b" : "draw";

    const { error } = await supabase
      .from("matches")
      .update({
        team_a_score: teamAScore,
        team_b_score: teamBScore,
        winner: winner,
      })
      .eq("id", matchId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Score updated!",
        description: "Match score has been recorded",
      });
      fetchTournamentMatches();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter Match Scores</CardTitle>
          <CardDescription>Record scores for your tournament matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Tournament</Label>
              <Select value={selectedTournament} onValueChange={setSelectedTournament}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a tournament" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTournament && matches.length > 0 && (
        <div className="space-y-4">
          {matches.map((match) => (
            <MatchScoreCard
              key={match.id}
              match={match}
              onScoreUpdate={handleScoreUpdate}
            />
          ))}
        </div>
      )}

      {selectedTournament && matches.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No matches created for this tournament yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const MatchScoreCard = ({ match, onScoreUpdate }: any) => {
  const [teamAScore, setTeamAScore] = useState(match.team_a_score || "");
  const [teamBScore, setTeamBScore] = useState(match.team_b_score || "");

  const handleSubmit = () => {
    if (teamAScore === "" || teamBScore === "") return;
    onScoreUpdate(match.id, parseInt(teamAScore), parseInt(teamBScore));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            Round {match.round_number} - Table {match.table_number || "?"}
          </CardTitle>
          {match.score_validated && (
            <Badge className="bg-green-600">Validé</Badge>
          )}
          {!match.score_validated && match.team_a_score !== null && (
            <Badge variant="secondary">En attente de validation</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label>Score Équipe A</Label>
            <Input
              type="number"
              value={teamAScore}
              onChange={(e) => setTeamAScore(e.target.value)}
              placeholder="0"
              disabled={match.score_validated}
            />
          </div>
          <div className="space-y-2">
            <Label>Score Équipe B</Label>
            <Input
              type="number"
              value={teamBScore}
              onChange={(e) => setTeamBScore(e.target.value)}
              placeholder="0"
              disabled={match.score_validated}
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={teamAScore === "" || teamBScore === "" || match.score_validated}
          >
            Enregistrer
          </Button>
        </div>
        {match.score_validated && match.validated_at && (
          <p className="text-sm text-muted-foreground mt-2">
            Validé le {new Date(match.validated_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
