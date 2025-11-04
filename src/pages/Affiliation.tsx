import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, FileText, Shield, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClubAffiliationDialog } from "@/components/ClubAffiliationDialog";
import { useEffect } from "react";
import  Culture from "/src/logo_part/culture.png"
import  JEU from "/src/logo_part/jeu.png"
import  SEL from "/src/logo_part/sel.png"
import  FDJ from "/src/logo_part/fdj.png"

const Affiliation = () => {
  const [clubs, setClubs] = useState<any[]>([]);

  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<"individual" | "club">("individual");
  const [isFreeLicense, setIsFreeLicense] = useState(false);
  const [isFreeClub, setIsFreeClub] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    postalCode: "",
    city: "",
    termsAccept: false,
    photoConsent: false,
    gdprConsent: false,
  });
  const [files, setFiles] = useState<{
    identityDocument?: File;
    photo?: File;
    addressProof?: File;
    medicalCertificate?: File;
  }>({});

  const sponsors = [
    {
      name: "Ministère de la Culture",
      type: "Partenaire Institutionnel",
      logo: Culture,
    },
    {
      name: "Fédération Française de Cartes",
      type: "Fédération Partenaire",
      logo: FDJ,
    },
    {
      name: "Sport & Loisirs",
      type: "Sponsor Gold",
      logo: SEL,
    },
    {
      name: "Jeux de Société Plus",
      type: "Sponsor Silver",
      logo: JEU,
    },
  ];

   const staticClubs = [
    { name: "Club de Belote Paris 11", city: "Paris", members: "250+" },
    { name: "AS Coinche Lyon", city: "Lyon", members: "180+" },
    { name: "Belote Club Marseille", city: "Marseille", members: "300+" },
    { name: "Nice Coinche Association", city: "Nice", members: "120+" },
    { name: "Toulouse Belote", city: "Toulouse", members: "200+" },
    { name: "Bordeaux Cards Club", city: "Bordeaux", members: "150+" },
  ];

  

  useEffect(() => {
    checkEligibility();
  }, []);

  const checkEligibility = async () => {
    const { data: licenseData } = await supabase.rpc('is_free_license_eligible');
    const { data: clubData } = await supabase.rpc('is_free_club_eligible');
    setIsFreeLicense(licenseData || false);
    setIsFreeClub(clubData || false);
  };

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('license-documents')
      .upload(path, file);
    if (error) throw error;
    return data.path;
  };

  useEffect(() => {
    const fetchClubs = async () => {
      const { data, error } = await supabase.from("clubs").select("name, city, region");

      if (error) {
        console.error(error);
        setClubs(staticClubs); // fallback si erreur
      } else {
        const formatted = data.map((club: any) => ({
          name: club.name,
          city: club.city,
          region: club.region,
          members: "20+",
        }));

        // Combine clubs Supabase + statiques
        setClubs([...staticClubs, ...formatted]);
      }

      setLoading(false);
    };

    fetchClubs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!formData.termsAccept || !formData.photoConsent || !formData.gdprConsent) {
      toast({
        title: "Erreur",
        description: "Veuillez accepter tous les consentements",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const uploadedFiles: any = {};
      if (files.identityDocument) {
        uploadedFiles.identity_document_url = await uploadFile(files.identityDocument, `${user.id}/identity_${Date.now()}_${files.identityDocument.name}`);
      }
      if (files.photo) {
        uploadedFiles.photo_url = await uploadFile(files.photo, `${user.id}/photo_${Date.now()}_${files.photo.name}`);
      }
      if (files.addressProof) {
        uploadedFiles.address_proof_url = await uploadFile(files.addressProof, `${user.id}/address_${Date.now()}_${files.addressProof.name}`);
      }
      if (files.medicalCertificate) {
        uploadedFiles.medical_certificate_url = await uploadFile(files.medicalCertificate, `${user.id}/medical_${Date.now()}_${files.medicalCertificate.name}`);
      }
      await supabase.from('licenses').insert({ user_id: user.id, type, status: 'pending', ...uploadedFiles });
      await supabase.from('profiles').update({
        first_name: formData.firstName, last_name: formData.lastName, phone: formData.phone,
        date_of_birth: formData.dateOfBirth, gender: formData.gender, address: formData.address,
        postal_code: formData.postalCode, city: formData.city,
      }).eq('id', user.id);
      toast({ title: "Succès", description: "Votre demande a été envoyée" });
      navigate("/");
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>{t.affiliation.form.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>{t.affiliation.form.firstName} *</Label><Input required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}/></div>
                    <div><Label>{t.affiliation.form.lastName} *</Label><Input required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}/></div>
                    <div><Label>{t.affiliation.form.email} *</Label><Input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/></div>
                    <div><Label>{t.affiliation.form.phone}</Label><Input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}/></div>
                  </div>
                  <div><Label>Documents</Label>
                    <Input type="file" accept="image/*,application/pdf" onChange={(e) => setFiles({...files, identityDocument: e.target.files?.[0]})} className="mb-2"/>
                    <Input type="file" accept="image/*" onChange={(e) => setFiles({...files, photo: e.target.files?.[0]})} className="mb-2"/>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2"><Checkbox checked={formData.termsAccept} onCheckedChange={(c) => setFormData({...formData, termsAccept: c as boolean})}/><Label>{t.affiliation.form.termsAccept}</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox checked={formData.photoConsent} onCheckedChange={(c) => setFormData({...formData, photoConsent: c as boolean})}/><Label>{t.affiliation.form.photoConsent}</Label></div>
                    <div className="flex items-center space-x-2"><Checkbox checked={formData.gdprConsent} onCheckedChange={(c) => setFormData({...formData, gdprConsent: c as boolean})}/><Label>{t.affiliation.form.gdprConsent}</Label></div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? "..." : t.affiliation.form.submit}</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">{t.affiliation.title}</h1>
            <p className="text-xl text-muted-foreground">{t.affiliation.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="border-2 hover:border-primary transition-smooth">
              
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-primary-foreground" size={24} />
                </div>
                <CardTitle className="text-2xl text-primary">{t.affiliation.individualLicense}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="pt-4">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {isFreeLicense ? (
                      <>
                        <span className="line-through text-muted-foreground text-xl mr-2">3€</span>
                        <span className="text-green-600">GRATUIT</span>
                      </>
                    ) : (
                      "3€"
                    )}
                  </div>
                  {isFreeLicense && (
                    <p className="text-sm text-green-600 font-semibold mb-2">
                      🎉 Offre de lancement - 1000 premiers inscrits !
                    </p>
                  )}
                  <Button onClick={() => user ? setShowForm(true) : navigate('/auth')} className="w-full bg-primary hover:bg-primary-light text-primary-foreground">Obtenir ma licence</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-accent transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-accent-foreground" size={24} />
                </div>
                <CardTitle className="text-2xl text-primary">{t.affiliation.clubAffiliation}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="pt-4">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {isFreeClub ? (
                      <>
                        <span className="line-through text-muted-foreground text-xl mr-2">20€</span>
                        <span className="text-green-600">GRATUIT</span>
                      </>
                    ) : (
                      "20€"
                    )}
                  </div>
                  {isFreeClub && (
                    <p className="text-sm text-green-600 font-semibold mb-2">
                      🎉 Offre de lancement - 50 premiers clubs !
                    </p>
                  )}
                  <ClubAffiliationDialog isFree={isFreeClub} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Partner Clubs Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {t.affiliation.partners.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.affiliation.partners.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {clubs.map((club, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-smooth">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{club.name}</CardTitle>
                  <CardDescription className="flex justify-between items-center">
                    <span>{club.city}</span>
                    <span className="font-bold text-accent">{club.members}</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {t.affiliation.sponsors.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.affiliation.sponsors.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto items-center">
            {sponsors.map((sponsor, index) => (
               <Card
            key={index}
            className="text-center p-6 border-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center mb-4 overflow-hidden">
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="object-contain w-20 h-20"
              />
            </div>
            <h3 className="font-bold text-lg text-primary mb-1">
              {sponsor.name}
            </h3>
            <p className="text-sm text-muted-foreground">{sponsor.type}</p>
          </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Affiliation;
