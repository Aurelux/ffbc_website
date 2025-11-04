import { useEffect, useState } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { TournamentRegistrationDialog } from "@/components/TournamentRegistrationDialog";
import { CreateTournamentDialog } from "@/components/CreateTournamentDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const Tournois = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchTournaments();
  }, [filter]);

  const fetchTournaments = async () => {
    let query = supabase
      .from("tournaments")
      .select("*")
      .in("status", ["upcoming", "ongoing"])
      .order("start_date", { ascending: true });

    if (filter !== "all") {
      query = query.eq("type", filter as any);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching tournaments:", error);
    } else {
      setTournaments(data || []);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Tournois</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez les prochains tournois officiels et inscrivez-vous pour participer aux compétitions
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => setFilter("all")}
              className={filter === "all" ? "border-primary text-primary bg-primary/10" : ""}
            >
              Tous les tournois
            </Button>
            <Button 
              variant="outline"
              onClick={() => setFilter("local")}
              className={filter === "local" ? "border-primary text-primary bg-primary/10" : ""}
            >
              Locaux
            </Button>
            <Button 
              variant="outline"
              onClick={() => setFilter("regional")}
              className={filter === "regional" ? "border-primary text-primary bg-primary/10" : ""}
            >
              Régionaux
            </Button>
            <Button 
              variant="outline"
              onClick={() => setFilter("national")}
              className={filter === "national" ? "border-primary text-primary bg-primary/10" : ""}
            >
              Nationaux
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="border-2 hover:border-primary hover:shadow-lg transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge 
                      variant={tournament.type === "national" ? "default" : "secondary"}
                      className={
                        tournament.type === "national" 
                          ? "bg-accent text-accent-foreground" 
                          : "bg-primary text-primary-foreground"
                      }
                    >
                      {tournament.type}
                    </Badge>
                    <Badge variant="outline">
                      {tournament.current_participants || 0}/{tournament.max_participants || "∞"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-primary">{tournament.name}</CardTitle>
                  <CardDescription className="space-y-2 mt-3">
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2 text-accent" />
                      {new Date(tournament.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin size={16} className="mr-2 text-accent" />
                      {tournament.city}
                    </div>
                    <div className="flex items-center text-sm">
                      <Users size={16} className="mr-2 text-accent" />
                      {tournament.current_participants || 0} participants inscrits
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <TournamentRegistrationDialog
                      tournamentId={tournament.id}
                      tournamentName={tournament.name}
                      onRegistrationSuccess={fetchTournaments}
                    />
                  ) : (
                    <Button className="w-full bg-primary hover:bg-primary-light text-primary-foreground" disabled>
                      {t.tournaments?.register || "S'inscrire au tournoi"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {user && (
            <div className="mt-16 text-center">
              <Card className="border-2 border-accent/30 bg-accent/5 max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Organisez votre tournoi</CardTitle>
                  <CardDescription className="text-base">
                    Vous êtes un club affilié ? Organisez votre propre tournoi officiel avec le soutien de la FFBC
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateTournamentDialog />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tournois;
