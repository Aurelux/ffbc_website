import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import Logo from "/src/logo.png"

const ManageTournament = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tournament, setTournament] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Champs pour création d’équipe
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  useEffect(() => {
    if (id) {
      fetchTournament();
      fetchParticipants();
    }
  }, [id]);

  const fetchTournament = async () => {
    const { data, error } = await supabase.from("tournaments").select("*").eq("id", id).single();
    if (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible de charger le tournoi", variant: "destructive" });
    } else {
      setTournament(data);
    }
  };

  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from("tournament_registrations")
      .select(`
        user_id,
        team_name,
        partner_id,
        profiles:user_id (
          id,
          first_name,
          last_name
        ),
        partner:partner_id (
          id,
          first_name,
          last_name
        )
      `)
      .eq("tournament_id", id);

    if (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les participants",
        variant: "destructive",
      });
    } else {
      const formatted = data.map((row: any) => ({
        id: row.profiles?.id,
        first_name: row.profiles?.first_name,
        last_name: row.profiles?.last_name,
      }));
      setParticipants(formatted);
    }
    setLoading(false);
  };

  const handleAddTeam = () => {
    if (!player1 || !player2) {
      toast({ title: "Erreur", description: "Sélectionnez deux joueurs", variant: "destructive" });
      return;
    }

    if (player1 === player2) {
      toast({ title: "Erreur", description: "Impossible de choisir le même joueur", variant: "destructive" });
      return;
    }

    const p1 = participants.find((p) => p.id === player1);
    const p2 = participants.find((p) => p.id === player2);

    const newTeam = { player1: p1, player2: p2 };
    setTeams((prev) => [...prev, newTeam]);
    setPlayer1("");
    setPlayer2("");
  };

  const createMatches = () => {
    const tempMatches = [];
    for (let i = 0; i < teams.length; i += 2) {
      if (teams[i + 1]) {
        tempMatches.push({
          teamA: teams[i],
          teamB: teams[i + 1],
          team_a_score: 0,
          team_b_score: 0,
        });
      }
    }
    setMatches(tempMatches);
  };

  const handleSubmit = async () => {
    try {
      for (const m of matches) {
        const { error } = await supabase.from("matches").insert({
          tournament_id: id,
          team_a_player1_id: m.teamA.player1.id,
          team_a_player2_id: m.teamA.player2.id,
          team_b_player1_id: m.teamB.player1.id,
          team_b_player2_id: m.teamB.player2.id,
          team_a_score: m.team_a_score,
          team_b_score: m.team_b_score,
        });
        if (error) throw error;
      }

      toast({ title: "Succès", description: "Les matchs ont été enregistrés !" });
      navigate(`/tournament/${id}`);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!tournament) return <p>Aucun tournoi trouvé.</p>;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* --- BARRE DE NAVIGATION --- */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ChevronLeft size={20} /> Retour
        </Button>
        <h2 className="text-xl font-semibold text-center">{tournament.name}</h2>
        <img src={Logo} alt="Logo" className="h-8 w-auto" />
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Gestion du tournoi</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Participants ({participants.length})</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {participants.map((p) => (
                <span
                  key={p.id}
                  className="px-3 py-1 bg-muted rounded-full border text-sm"
                >
                  {p.first_name} {p.last_name}
                </span>
              ))}
            </div>

            {/* Création manuelle d'équipes */}
            <div className="mb-8 border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Créer une équipe manuellement</h3>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label>Joueur 1</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={player1}
                    onChange={(e) => setPlayer1(e.target.value)}
                  >
                    <option value="">-- Sélectionnez --</option>
                    {participants.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <Label>Joueur 2</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={player2}
                    onChange={(e) => setPlayer2(e.target.value)}
                  >
                    <option value="">-- Sélectionnez --</option>
                    {participants.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={handleAddTeam}>Ajouter</Button>
              </div>

              {teams.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Équipes créées</h4>
                  <ul className="space-y-2">
                    {teams.map((t, i) => (
                      <li
                        key={i}
                        className="p-3 rounded-lg border bg-muted/30 flex justify-between"
                      >
                        <span>
                          Équipe {i + 1} : {t.player1.first_name} & {t.player2.first_name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button onClick={createMatches} className="mt-4">
                    Générer les matchs
                  </Button>
                </div>
              )}
            </div>

            {matches.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-3">Matchs générés</h3>
                {matches.map((m, i) => (
                  <div key={i} className="flex items-center gap-4 mb-2">
                    <span>
                      {m.teamA.player1.first_name} & {m.teamA.player2.first_name} vs{" "}
                      {m.teamB.player1.first_name} & {m.teamB.player2.first_name}
                    </span>
                    <Input
                      type="number"
                      value={m.team_a_score}
                      onChange={(e) =>
                        setMatches((prev) =>
                          prev.map((x, idx) =>
                            idx === i ? { ...x, team_a_score: Number(e.target.value) } : x
                          )
                        )
                      }
                      placeholder="Score A"
                      className="w-20"
                    />
                    <Input
                      type="number"
                      value={m.team_b_score}
                      onChange={(e) =>
                        setMatches((prev) =>
                          prev.map((x, idx) =>
                            idx === i ? { ...x, team_b_score: Number(e.target.value) } : x
                          )
                        )
                      }
                      placeholder="Score B"
                      className="w-20"
                    />
                  </div>
                ))}

                <Button onClick={handleSubmit} className="mt-6 w-full">
                  Enregistrer les matchs
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageTournament;
