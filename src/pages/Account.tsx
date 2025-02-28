
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle, Mail, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";

const Account = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || "");
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || "");

  const handleSave = () => {
    // This would normally update the user's profile
    toast({
      title: "Profil oppdatert",
      description: "Endringene dine har blitt lagret.",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container max-w-3xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">Min konto</h1>
        <p className="text-muted-foreground mb-8">Administrer kontoinnstillingene dine.</p>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Profilinformasjon
              </CardTitle>
              <CardDescription>
                Oppdater din personlige informasjon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Fornavn</Label>
                        <Input 
                          id="firstName" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Etternavn</Label>
                        <Input 
                          id="lastName" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Avbryt</Button>
                      <Button onClick={handleSave}>Lagre endringer</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Fornavn</Label>
                        <p>{user?.user_metadata?.first_name || "Ikke angitt"}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Etternavn</Label>
                        <p>{user?.user_metadata?.last_name || "Ikke angitt"}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Label className="text-sm text-muted-foreground">E-post</Label>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user?.email}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={() => setIsEditing(true)}>Rediger profil</Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Abonnement
              </CardTitle>
              <CardDescription>
                Administrer abonnementet ditt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Nåværende plan</Label>
                  <p className="font-medium">{isPremium ? "Premium" : "Gratis"}</p>
                </div>
                {!isPremium && (
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Funksjon under utvikling",
                        description: "Betalingssystemet er ikke implementert ennå."
                      });
                    }}
                  >
                    Oppgrader til Premium
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;
