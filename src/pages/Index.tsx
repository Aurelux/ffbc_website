import { ArrowRight, Calendar, Trophy, Users, CheckCircle, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import Logo from "/src/logo.png"

const Index = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [license, setLicense] = useState<any>(null);
  const [ranking, setRanking] = useState<any>(null);
    const [club, setClub] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    const [profileData, licenseData, rankingData] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      
      supabase.from('licenses').select('*').eq('user_id', user.id).eq('status', 'approved').single(),
      supabase.from('rankings').select('*').eq('user_id', user.id).order('season', { ascending: false }).limit(1).single()
    ]);
    console.log(licenseData.data)
    const clubs = await Promise.all([supabase.from('clubs').select('*').eq('id', licenseData.data.club_id).single()])
    console.log(clubs)
    if (profileData.data) setProfile(profileData.data);
    if (licenseData.data) setLicense(licenseData.data);
    if (rankingData.data) setRanking(rankingData.data);
    if (clubs) setClub(clubs[0].data);
  };

  console.log(club)

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          {/* Member Card - Only shown when user is logged in */}
          {user && profile && (
            <div className="mb-12 flex justify-center">
              <Card className="w-full max-w-md border-2 border-primary shadow-elegant bg-gradient-to-br from-card to-card/50 overflow-hidden">
                <div className="h-24 bg-gradient-tricolor" />
                <CardContent className="relative pt-0 pb-6 px-6">
                  <div className="flex flex-col items-center -mt-14">
                    <Avatar className="w-24 h-24 border-4 border-card shadow-xl">
                      <AvatarImage src={profile.photo_url || ""} alt={`${profile.first_name} ${profile.last_name}`} />
                      <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 text-2xl font-bold text-primary">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
                      {t.home.memberCard.title}
                    </p>
                    
                    <div className="w-full mt-6 space-y-3">
                      {license && (
                        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <span className="text-sm font-medium text-muted-foreground">
                            {t.home.memberCard.licenseNumber}
                          </span>
                          <span className="font-mono font-bold text-primary">
                            {license.license_number}
                          </span>
                        </div>
                      )}
                      {/* Club Name */}
            {club?.name && (
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <span className="text-sm font-medium text-muted-foreground">
                  {"Club"}
                </span>
                <span className="font-bold text-primary">{club?.name || "Membre d'aucun club"}</span>
              </div>
            )}
                      
                      <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border border-accent/20">
                        <span className="text-sm font-medium text-muted-foreground">
                          {t.home.memberCard.ranking}
                        </span>
                        <span className="font-bold text-accent">
                          {ranking?.rank ? `#${ranking.rank}` : t.home.memberCard.noRanking}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="text-center">
          <div className="mb-8 inline-block">
            <div className="w-36 h-36 bg-background rounded-full flex items-center justify-center shadow-lg overflow-hidden">
    <img src={Logo} alt="FFBC Logo" className="w-full h-full object-contain" />
  </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
            {t.home.hero.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.home.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tournois">
              <Button size="lg" className="bg-primary hover:bg-primary-light text-primary-foreground shadow-lg hover:shadow-xl transition-smooth group">
                <Trophy className="mr-2 group-hover:scale-110 transition-transform" />
                {t.home.hero.cta1}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/affiliation">
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg transition-smooth">
                <Users className="mr-2" />
                {t.home.hero.cta2}
              </Button>
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-accent-light">12,500+</div>
              <div className="text-sm uppercase tracking-wider opacity-90">Licenciés</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-accent-light">450+</div>
              <div className="text-sm uppercase tracking-wider opacity-90">Clubs affiliés</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-accent-light">200+</div>
              <div className="text-sm uppercase tracking-wider opacity-90">Tournois/an</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-accent-light">13</div>
              <div className="text-sm uppercase tracking-wider opacity-90">Régions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            {t.home.quickLinks.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary hover:shadow-lg transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="text-primary-foreground" size={24} />
                </div>
                <CardTitle className="text-2xl text-primary">{t.nav.tournaments}</CardTitle>
                <CardDescription>
                  {t.home.tournaments.viewAll}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/tournois">
                  <Button variant="link" className="p-0 h-auto text-accent hover:text-accent-dark">
                    {t.home.quickLinks.learnRules} <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary hover:shadow-lg transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="text-accent-foreground" size={24} />
                </div>
                <CardTitle className="text-2xl text-primary">{t.nav.rankings}</CardTitle>
                <CardDescription>
                  {t.home.quickLinks.viewRankings}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/classements">
                  <Button variant="link" className="p-0 h-auto text-accent hover:text-accent-dark">
                    {t.home.quickLinks.viewRankings} <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary hover:shadow-lg transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-primary-foreground" size={24} />
                </div>
                <CardTitle className="text-2xl text-primary">{t.nav.affiliation}</CardTitle>
                <CardDescription>
                  {t.home.quickLinks.becomeAffiliated}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/affiliation">
                  <Button variant="link" className="p-0 h-auto text-accent hover:text-accent-dark">
                    {t.home.quickLinks.becomeAffiliated} <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Coinche Royale App Section */}
      <section className="py-20 px-4 bg-accent/10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Smartphone className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-4xl font-bold text-primary mb-4">
                {t.home.app.title}
              </h2>
              <h3 className="text-3xl font-bold text-accent mb-4">
                {t.home.app.name}
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t.home.app.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary transition-smooth">
                <CardContent className="pt-6">
                  <CheckCircle className="w-10 h-10 text-primary mb-3" />
                  <h4 className="font-bold text-lg mb-2">{t.home.app.features.scoring}</h4>
                </CardContent>
              </Card>
              
              <Card className="border-2 hover:border-primary transition-smooth">
                <CardContent className="pt-6">
                  <CheckCircle className="w-10 h-10 text-primary mb-3" />
                  <h4 className="font-bold text-lg mb-2">{t.home.app.features.tournaments}</h4>
                </CardContent>
              </Card>
              
              <Card className="border-2 hover:border-primary transition-smooth">
                <CardContent className="pt-6">
                  <CheckCircle className="w-10 h-10 text-primary mb-3" />
                  <h4 className="font-bold text-lg mb-2">{t.home.app.features.management}</h4>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero text-blue-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.home.hero.subtitle}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t.home.about.mission}
          </p>
          <Link to="/affiliation">
            <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-smooth">
              {t.home.hero.cta2} <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
