
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === "signin") {
        const { success, error } = await signIn(formData.email, formData.password);
        if (success) {
          navigate("/search");
          toast({
            title: "Velkommen tilbake!",
            description: "Du er nå logget inn.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Feil ved innlogging",
            description: error || "Kunne ikke logge inn. Prøv igjen.",
          });
        }
      } else {
        const { success, error } = await signUp(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
        if (success) {
          navigate("/search");
          toast({
            title: "Velkommen!",
            description: "Kontoen din er opprettet.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Feil ved registrering",
            description: error || "Kunne ikke opprette konto. Prøv igjen.",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "En feil har oppstått",
        description: "Kunne ikke fullføre forespørselen. Prøv igjen senere.",
      });
    }
  };

  return (
    <div className="container max-w-md mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "signin" ? "Logg inn" : "Registrer deg"}</CardTitle>
          <CardDescription>
            {mode === "signin" 
              ? "Logg inn for å få tilgang til alle funksjoner." 
              : "Opprett en konto for å få tilgang til alle funksjoner."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Fornavn</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Etternavn</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passord</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {mode === "signin" ? "Logg inn" : "Registrer"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {mode === "signin" ? (
              <p>
                Har du ikke en konto?{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => navigate("/auth?mode=signup")}
                >
                  Registrer deg her
                </Button>
              </p>
            ) : (
              <p>
                Har du allerede en konto?{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => navigate("/auth?mode=signin")}
                >
                  Logg inn her
                </Button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
