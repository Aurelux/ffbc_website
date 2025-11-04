import { Download, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Classements = () => {
  // Mock data - will be replaced with Supabase data
  const rankings = [
    { rank: 1, name: "Jean Dupont", club: "Paris Belote Club", points: 2847, matches: 45, trend: "up" },
    { rank: 2, name: "Marie Martin", club: "Lyon Coinche", points: 2792, matches: 42, trend: "up" },
    { rank: 3, name: "Pierre Durand", club: "Marseille Cards", points: 2735, matches: 48, trend: "same" },
    { rank: 4, name: "Sophie Bernard", club: "Toulouse Belote", points: 2689, matches: 41, trend: "down" },
    { rank: 5, name: "Luc Moreau", club: "Nice Gaming", points: 2654, matches: 44, trend: "up" },
    { rank: 6, name: "Claire Petit", club: "Bordeaux Cards", points: 2621, matches: 39, trend: "up" },
    { rank: 7, name: "Thomas Roux", club: "Lille Belote", points: 2598, matches: 43, trend: "same" },
    { rank: 8, name: "Julie Simon", club: "Strasbourg Club", points: 2567, matches: 40, trend: "down" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Classements nationaux</h1>
            <p className="text-xl text-muted-foreground">
              Suivez les meilleurs joueurs de belote et coinche en temps réel
            </p>
          </div>

          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl text-primary">Saison 2025-2026</CardTitle>
                  <CardDescription>Classement général - Mise à jour en temps réel</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Download size={18} className="mr-2" />
                    Exporter (CSV)
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Rechercher un joueur ou un club..."
                    className="pl-10 border-2 focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="border-primary text-primary">Tous</Button>
                <Button variant="outline" size="sm">Île-de-France</Button>
                <Button variant="outline" size="sm">Auvergne-Rhône-Alpes</Button>
                <Button variant="outline" size="sm">PACA</Button>
                <Button variant="outline" size="sm">Autre région</Button>
              </div>

              <div className="rounded-lg border-2 border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead className="w-16 font-bold">Rang</TableHead>
                      <TableHead className="font-bold">Joueur</TableHead>
                      <TableHead className="font-bold">Club</TableHead>
                      <TableHead className="text-right font-bold">Points</TableHead>
                      <TableHead className="text-right font-bold">Matchs</TableHead>
                      <TableHead className="w-20 text-center font-bold">Évolution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankings.map((player) => (
                      <TableRow key={player.rank} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-bold text-primary">
                          {player.rank <= 3 ? (
                            <Badge 
                              className={
                                player.rank === 1 ? "bg-accent text-accent-foreground" : 
                                player.rank === 2 ? "bg-primary/80 text-primary-foreground" :
                                "bg-primary/60 text-primary-foreground"
                              }
                            >
                              {player.rank}
                            </Badge>
                          ) : (
                            player.rank
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{player.name}</TableCell>
                        <TableCell className="text-muted-foreground">{player.club}</TableCell>
                        <TableCell className="text-right font-bold text-primary">{player.points}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{player.matches}</TableCell>
                        <TableCell className="text-center">
                          {player.trend === "up" && (
                            <TrendingUp className="inline text-green-600" size={18} />
                          )}
                          {player.trend === "down" && (
                            <TrendingUp className="inline text-red-600 transform rotate-180" size={18} />
                          )}
                          {player.trend === "same" && (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex justify-center">
                <Button variant="outline">Charger plus de résultats</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Comment gagner des points ?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Victoire :</span>
                  <span className="font-bold text-primary">3 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Match nul :</span>
                  <span className="font-bold text-primary">1 point</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bonus écart :</span>
                  <span className="font-bold text-primary">0-2 points</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Coefficients tournois</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Local :</span>
                  <span className="font-bold text-primary">× 1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Régional :</span>
                  <span className="font-bold text-primary">× 1.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">National :</span>
                  <span className="font-bold text-primary">× 2.0</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Saisons précédentes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <Button variant="link" className="p-0 h-auto text-accent hover:text-accent-dark">
                  Classement 2024-2025
                </Button>
                <br />
                <Button variant="link" className="p-0 h-auto text-accent hover:text-accent-dark">
                  Classement 2023-2024
                </Button>
                <br />
                <Button variant="link" className="p-0 h-auto text-accent hover:text-accent-dark">
                  Archives complètes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Classements;
