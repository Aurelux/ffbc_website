import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Upload, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";


const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
    const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<any>(null);
  const [tempLicense, setTempLicense] = useState<any>(null);
    const [tempClub, setTempClub] = useState<any>(null);
  const [createdTournaments, setCreatedTournaments] = useState<any[]>([]);
const [joinedTournaments, setJoinedTournaments] = useState<any[]>([]);
  const [license, setLicense] = useState<any>(null);
   const [club, setClub] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchLicense();
      fetchProfile();
      fetchClub();
    }
  }, [user]);
  const fetchLicense = async () => {
    const { data, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_id", user?.id)
      .single();
    if (error) console.error("Error fetching license:", error);
    else setLicense(data);
  };
  const fetchClub = async () => {
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .eq("id", license.club_id)
      .single();
    if (error) console.error("Error fetching license:", error);
    else setClub(data);
  };


  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
  };
  useEffect(() => {
  if (user) {
    fetchTournaments();
  }
}, [user]);

const fetchTournaments = async () => {
  if (!user) return;

  try {
    // Tournois créés par l'utilisateur
    const { data: created, error: createdError } = await supabase
      .from("tournaments")
      .select("*")
      .eq("organizer_id", user.id);

    if (createdError) throw createdError;

    // Tournois auxquels il participe
    const { data: registrations, error: regError } = await supabase
      .from("tournament_registrations")
      .select("tournament_id, tournament: tournament_id (*)")
      .eq("user_id", user.id);

    if (regError) throw regError;

    setCreatedTournaments(created || []);
    setJoinedTournaments(registrations.map((r) => r.tournament) || []);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
  }
};

const handleEdit = () => {
    setEditing(true);
    setTempProfile(profile);
    setTempLicense(license);
    setTempClub(club);
  };

  const handleCancel = () => {
    setEditing(false);
    setTempProfile(profile);
    setTempLicense(license);
    setTempClub(club);
  };
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    setUploading(true);

    try {
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ photo_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, photo_url: publicUrl });
      toast({
        title: t.profile?.photoUpdated || "Photo updated successfully",
        description: t.profile?.photoUpdatedDesc || "Your profile photo has been updated",
      });
    } catch (error: any) {
      toast({
        title: t.common?.error || "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update(tempProfile)
        .eq("id", user.id);
      if (profileError) throw profileError;

      // Update license
      if (tempLicense) {
        const { error: licenseError } = await supabase
          .from("licenses")
          .update(tempLicense)
          .eq("user_id", user.id);
        if (licenseError) throw licenseError;
      }

      setProfile(tempProfile);
      setLicense(tempLicense);
      setEditing(false);
      toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées" });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const profileFields = [
    { key: "first_name", label: "Prénom" },
    { key: "last_name", label: "Nom" },
    { key: "email", label: "Email" },
    { key: "gender", label: "Genre" },
    { key: "date_of_birth", label: "Date de naissance", type: "date" },
    { key: "phone", label: "Téléphone" },
    { key: "address", label: "Adresse" },
    { key: "postal_code", label: "Code postal" },
    { key: "city", label: "Ville" },
  ];

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto">
            <p>{t.common?.loading || "Loading..."}</p>
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
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-primary">Mon Profil</CardTitle>
              <CardDescription>Gérez vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile.photo_url} />
                  <AvatarFallback className="text-2xl">
                    <User size={48} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center gap-2">
                  {editing && (
                    <>
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <Button variant="outline" disabled={uploading} asChild>
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            {uploading ? "Uploading..." : "Changer la photo"}
                          </span>
                        </Button>
                      </Label>
                      <Input id="avatar-upload" type="file" className="hidden" onChange={handleFileUpload} />
                    </>
                  )}
                </div>
              </div>

              {/* Editable Profile Fields */}
              <div className="space-y-4">
                {profileFields.map((field) => (
                  <div key={field.key}>
                    <Label>{field.label}</Label>
                    <Input
                      type={field.type || "text"}
                      value={editing ? tempProfile[field.key] : profile[field.key] || ""}
                      disabled={!editing}
                      className={!editing ? "bg-gray-100" : ""}
                      onChange={(e) => editing && setTempProfile({ ...tempProfile, [field.key]: e.target.value })}
                    />
                  </div>
                ))}
                {/* License Info */}
                {club && (
                  <>
                    <div>
                      <Label>Nom du Club</Label>
                      <Input
                        value={editing ? tempClub.name : club.name || ""}
                        disabled={!editing}
                        className={!editing ? "bg-gray-100" : ""}
                        onChange={(e) => editing && setTempClub({ ...tempClub, name: e.target.value })}
                        />
                    </div>
                </>
                )}{license && (
                  <>
                    <div>
                      <Label>Numéro de licence</Label>
                      <Input
                        value={editing ? tempLicense.license_number : license.license_number || ""}
                        disabled={!editing}
                        className={!editing ? "bg-gray-100" : ""}
                        onChange={(e) => editing && setTempLicense({ ...tempLicense, license_number: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
              {!editing ? (
                <Button onClick={handleEdit}>Modifier</Button>
              ) : (
                <div className="flex gap-4">
                  <Button onClick={handleSave}>Enregistrer</Button>
                  <Button variant="outline" onClick={handleCancel}>Annuler</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* --- Mes Tournois --- */}
<div className="container mx-auto max-w-3xl mt-10 space-y-10">
  {/* Tournois créés */}
  <Card>
    <CardHeader>
      <CardTitle>Mes Tournois Créés</CardTitle>
      <CardDescription>Les tournois dont vous êtes l’organisateur</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {createdTournaments.length > 0 ? (
        createdTournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/30 transition"
          >
            <div>
              <p className="text-lg font-semibold">{tournament.name}</p>
              <p className="text-sm text-muted-foreground">
                {tournament.location} — {new Date(tournament.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/manage-tournament/${tournament.id}`)}
            >
              ⚙️ Gérer
            </Button>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">Aucun tournoi créé</p>
      )}
    </CardContent>
  </Card>

  {/* Tournois rejoints */}
  <Card>
    <CardHeader>
      <CardTitle>Tournois auxquels je participe</CardTitle>
      <CardDescription>Les tournois où vous êtes inscrit</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {joinedTournaments.length > 0 ? (
        joinedTournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/30 transition"
          >
            <div>
              <p className="text-lg font-semibold">{tournament.name}</p>
              <p className="text-sm text-muted-foreground">
                {tournament.location} — {new Date(tournament.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate(`/tournois`)}
            >
              👀 Voir
            </Button>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">Aucun tournoi rejoint</p>
      )}
    </CardContent>
  </Card>
</div>

      <Footer />
    </div>
  );
};

export default Profile;
