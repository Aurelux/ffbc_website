import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files || event.target.files.length === 0) return;

  const file = event.target.files[0];
  const fileExt = file.name.split(".").pop();
  const tempUrl = URL.createObjectURL(file); // preview immédiate
  setProfile({ ...profile, photo_url: tempUrl });

  // si le user n'est pas encore connecté → on s'arrête ici (pas d'upload supabase)
  if (!user) {
    return;
  }

  setUploading(true);
  const filePath = `${user.id}/avatar.${fileExt}`;

  try {
    // Upload vers Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Récupère l’URL publique
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Met à jour le profil en base
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ photo_url: publicUrl })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // Met à jour le state local
    setProfile({ ...profile, photo_url: publicUrl });

    toast({
      title: t.profile?.photoUpdated || "Photo mise à jour",
      description: t.profile?.photoUpdatedDesc || "Votre photo de profil a été mise à jour avec succès.",
    });
  } catch (error: any) {
    toast({
      title: t.common?.error || "Erreur",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setUploading(false);
  }
};


  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: t.auth.success,
          description: "Bienvenue !",
        });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        toast({
          title: "Compte créé avec succès",
          description: "Vous pouvez maintenant vous connecter.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: t.auth.error,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center text-primary">
                {isLogin ? t.auth.login : t.auth.signup}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin 
                  ? "Connectez-vous à votre compte FFBC" 
                  : "Créez votre compte FFBC"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <>
                  <div className="flex flex-col items-center space-y-2">
  <div className="relative">
    <img
      src={profile?.photo_url || "/default-avatar.png"}
      alt="Photo de profil"
      className="w-24 h-24 rounded-full object-cover border border-gray-300"
    />

    <label
      htmlFor="photoInput"
      className={`absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 ${
        uploading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title={uploading ? "Téléversement en cours..." : "Changer la photo"}
    >
      📸
    </label>

    <input
      id="photoInput"
      type="file"
      accept="image/*"
      capture="environment"
      className="hidden"
      
      onChange={handleFileUpload}
      disabled={uploading}
    />
  </div>

  {uploading && (
    <p className="text-sm text-gray-500">{t.profile?.uploading || "Téléversement en cours..."}</p>
  )}
</div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t.auth.firstName}</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t.auth.lastName}</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t.auth.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t.auth.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-light"
                  disabled={loading}
                >
                  {loading 
                    ? "..." 
                    : isLogin ? t.auth.loginButton : t.auth.signupButton
                  }
                </Button>

                <div className="text-center text-sm">
                  {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline font-semibold"
                  >
                    {isLogin ? t.auth.signup : t.auth.login}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
