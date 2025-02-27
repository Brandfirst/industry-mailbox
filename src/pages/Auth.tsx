
import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured } from "@/lib/supabase";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  const redirect = searchParams.get("redirect") || "/search";
  const [activeTab, setActiveTab] = useState(mode === "signup" ? "signup" : "signin");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const { signIn, signUp, isLoading, user, forgotPassword } = useAuth();
  
  // Check if Supabase is configured
  const [isConfigured] = useState(isSupabaseConfigured());
  
  useEffect(() => {
    if (!isConfigured) {
      toast({
        title: "Konfigurasjonsfeil",
        description: "Manglende Supabase-konfigurasjonsvariabler. Vennligst sjekk .env-filen.",
        variant: "destructive"
      });
    }
  }, [isConfigured, toast]);
  
  useEffect(() => {
    setActiveTab(mode === "signup" ? "signup" : "signin");
  }, [mode]);
  
  useEffect(() => {
    document.title = `${activeTab === "signup" ? "Registrer" : "Logg inn"} | NewsletterHub`;
  }, [activeTab]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfigured) {
      toast({
        title: "Tjeneste utilgjengelig",
        description: "Påloggingstjenesten er ikke riktig konfigurert.",
        variant: "destructive"
      });
      return;
    }
    
    if (!email || !password) {
      toast({
        title: "Feil",
        description: "Vennligst fyll inn alle feltene",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        toast({
          title: "Suksess",
          description: "Du er nå logget inn",
        });
        navigate(redirect);
      } else {
        toast({
          title: "Feil ved innlogging",
          description: result.error || "Kunne ikke logge inn. Vennligst sjekk brukernavn og passord.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Feil ved innlogging",
        description: "Det oppstod en feil ved innloggingsforsøket. Vennligst prøv igjen senere.",
        variant: "destructive"
      });
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfigured) {
      toast({
        title: "Tjeneste utilgjengelig",
        description: "Registreringstjenesten er ikke riktig konfigurert.",
        variant: "destructive"
      });
      return;
    }
    
    if (!email || !password || !firstName || !lastName) {
      toast({
        title: "Feil",
        description: "Vennligst fyll inn alle feltene",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Feil",
        description: "Passordet må være minst 6 tegn",
        variant: "destructive"
      });
      return;
    }
    
    if (!agreeToTerms) {
      toast({
        title: "Feil",
        description: "Du må godta vilkårene for å registrere deg",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await signUp(email, password, { firstName, lastName });
      
      if (result.success) {
        toast({
          title: "Konto opprettet",
          description: "Din konto er nå opprettet. Du kan nå logge inn.",
        });
        // Navigate to sign in tab after successful sign up
        setActiveTab("signin");
      } else {
        toast({
          title: "Feil ved registrering",
          description: result.error || "Kunne ikke opprette konto. Prøv igjen senere.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Feil ved registrering",
        description: "Det oppstod en feil ved registreringsforsøket. Vennligst prøv igjen senere.",
        variant: "destructive"
      });
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleForgotPassword = async () => {
    if (!isConfigured) {
      toast({
        title: "Tjeneste utilgjengelig",
        description: "Tilbakestillingstjenesten er ikke riktig konfigurert.",
        variant: "destructive"
      });
      return;
    }
    
    if (!email) {
      toast({
        title: "Feil",
        description: "Vennligst fyll inn e-postadresse",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        toast({
          title: "E-post sendt",
          description: "Sjekk e-posten din for instruksjoner om tilbakestilling av passord",
        });
      } else {
        toast({
          title: "Feil",
          description: result.error || "Kunne ikke sende tilbakestillingslenke. Prøv igjen senere.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast({
        title: "Feil",
        description: "Det oppstod en feil ved forsøket på å tilbakestille passordet. Vennligst prøv igjen senere.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <Mail className="w-6 h-6 text-primary" />
        <span className="text-xl font-medium">NewsletterHub</span>
      </Link>
      
      <div className="w-full max-w-md">
        {!isConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-amber-800">
            <p className="text-sm font-medium">Tjenesten er ikke riktig konfigurert</p>
            <p className="text-xs mt-1">Supabase-tilkoblingen mangler nødvendige miljøvariabler.</p>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-card p-8 animate-fade-in">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="signin">Logg inn</TabsTrigger>
              <TabsTrigger value="signup">Registrer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signin">E-post</Label>
                    <Input 
                      id="email-signin" 
                      type="email" 
                      placeholder="din@epost.no" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password-signin">Passord</Label>
                      <button
                        type="button"
                        className="text-xs text-primary hover:text-mint-dark"
                        onClick={handleForgotPassword}
                      >
                        Glemt passord?
                      </button>
                    </div>
                    <div className="relative">
                      <Input 
                        id="password-signin" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={toggleShowPassword}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-mint-dark" 
                    disabled={isLoading || !isConfigured}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logger inn...
                      </>
                    ) : (
                      "Logg inn"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Fornavn</Label>
                      <Input 
                        id="first-name" 
                        placeholder="Ola" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required 
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Etternavn</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Nordmann" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required 
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">E-post</Label>
                    <Input 
                      id="email-signup" 
                      type="email" 
                      placeholder="din@epost.no" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Passord</Label>
                    <div className="relative">
                      <Input 
                        id="password-signup" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="pr-10"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={toggleShowPassword}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Passordet må være minst 6 tegn</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                      required 
                      disabled={isLoading}
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground">
                      Jeg godtar <Link to="#" className="text-primary hover:underline">vilkårene</Link> og <Link to="#" className="text-primary hover:underline">personvernerklæringen</Link>
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-mint-dark"
                    disabled={isLoading || !agreeToTerms || !isConfigured}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Oppretter konto...
                      </>
                    ) : (
                      "Opprett konto"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          Ved å logge inn godtar du våre <Link to="#" className="text-primary hover:underline">Vilkår</Link> og <Link to="#" className="text-primary hover:underline">Personvernerklæring</Link>.
        </p>
      </div>
    </div>
  );
};

export default Auth;
