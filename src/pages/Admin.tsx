import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";
import { AdminTournamentApproval } from "@/components/AdminTournamentApproval";
import { MatchScoreEntry } from "@/components/MatchScoreEntry";
import { AdminScoreValidation } from "@/components/AdminScoreValidation";
import { AdminClubApproval } from "@/components/AdminClubApproval";

interface License {
  id: string;
  user_id: string;
  type: string;
  status: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const Admin = () => {
  const { isAdmin, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires",
        variant: "destructive",
      });
    }
  }, [isAdmin, loading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchLicenses();
    }
  }, [isAdmin]);

  const fetchLicenses = async () => {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLicenses(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const updateLicenseStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('licenses')
        .update({ 
          status,
          ...(status === 'approved' ? { 
            license_number: `FFBC-${Date.now()}`,
            issue_date: new Date().toISOString().split('T')[0],
            expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
          } : {})
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Licence ${status === 'approved' ? 'approuvée' : 'rejetée'}`,
      });
      
      fetchLicenses();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-primary mb-8">{t.admin.title}</h1>

          <Tabs defaultValue="licenses" className="space-y-6">
            <TabsList>
              <TabsTrigger value="licenses">{t.admin.licenses}</TabsTrigger>
              <TabsTrigger value="clubs">{t.admin.clubs}</TabsTrigger>
              <TabsTrigger value="tournaments">{t.admin.tournaments}</TabsTrigger>
            </TabsList>

            <TabsContent value="licenses">
              <Card>
                <CardHeader>
                  <CardTitle>{t.admin.licenses}</CardTitle>
                  <CardDescription>
                    Gérer les demandes de licences et affiliations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <p>Chargement...</p>
                  ) : licenses.length === 0 ? (
                    <p className="text-muted-foreground">{t.admin.noData}</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>{t.admin.actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {licenses.map((license) => (
                          <TableRow key={license.id}>
                            <TableCell>
                              {license.profiles?.first_name} {license.profiles?.last_name}
                            </TableCell>
                            <TableCell>{license.profiles?.email}</TableCell>
                            <TableCell>{license.type}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  license.status === 'approved'
                                    ? 'default'
                                    : license.status === 'pending'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                              >
                                {license.status === 'approved' && t.admin.approved}
                                {license.status === 'pending' && t.admin.pending}
                                {license.status === 'rejected' && t.admin.rejected}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(license.created_at).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell>
                              {license.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => updateLicenseStatus(license.id, 'approved')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateLicenseStatus(license.id, 'rejected')}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clubs">
              <AdminClubApproval />
            </TabsContent>

            <TabsContent value="tournaments" className="space-y-6">
              <AdminTournamentApproval />
              <AdminScoreValidation />
              <MatchScoreEntry />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
