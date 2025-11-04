import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Regles = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">Règles officielles</h1>
            <p className="text-xl text-muted-foreground">
              Découvrez les règles officielles de la belote et de la coinche établies par la FFBC
            </p>
          </div>

          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                <FileText />
                Règlement général
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                Le règlement officiel de la Fédération Française de Belote et Coinche définit les règles 
                applicables lors de tous les tournois et compétitions organisés sous l'égide de la FFBC.
              </p>
              <Button className="bg-accent hover:bg-accent-dark text-accent-foreground">
                <Download className="mr-2" size={18} />
                Télécharger le règlement complet (PDF)
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="border-2 hover:border-primary transition-smooth">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Belote classique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Déroulement</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Jeu à 4 joueurs en équipes de 2</li>
                    <li>Distribution de 8 cartes par joueur</li>
                    <li>Annonces et contrats</li>
                    <li>Valeur des cartes et comptage</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-smooth">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Coinche</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Spécificités</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Enchères libres et coinche/surcoinche</li>
                    <li>Annonces de points obligatoires</li>
                    <li>Pénalités en cas d'échec</li>
                    <li>Variantes acceptées en tournoi</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Règles des tournois</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Système de pointage</h3>
                <p className="text-muted-foreground mb-2">
                  Les tournois officiels de la FFBC utilisent un système de points standardisé :
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>Victoire :</strong> 3 points</li>
                  <li><strong>Match nul :</strong> 1 point</li>
                  <li><strong>Défaite :</strong> 0 point</li>
                  <li><strong>Bonus :</strong> Points additionnels selon l'écart de score</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Formats de tournoi</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>Tournoi local :</strong> coefficient 1.0</li>
                  <li><strong>Tournoi régional :</strong> coefficient 1.5</li>
                  <li><strong>Tournoi national :</strong> coefficient 2.0</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Code de conduite</h3>
                <p className="text-muted-foreground">
                  Tous les participants doivent respecter le code de conduite de la FFBC : 
                  fair-play, respect des adversaires et des arbitres, ponctualité, et tenue vestimentaire appropriée.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Regles;
