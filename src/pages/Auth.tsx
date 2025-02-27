
import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  const [activeTab, setActiveTab] = useState(mode === "signup" ? "signup" : "signin");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setActiveTab(mode === "signup" ? "signup" : "signin");
  }, [mode]);
  
  useEffect(() => {
    document.title = `${activeTab === "signup" ? "Sign Up" : "Sign In"} | NewsletterHub`;
  }, [activeTab]);
  
  const handleSubmit = (e: React.FormEvent, type: "signin" | "signup") => {
    e.preventDefault();
    
    // Mock auth flow - would be replaced with real auth
    toast.success(
      type === "signin" ? "Signed in successfully!" : "Account created successfully!", 
      { duration: 3000 }
    );
    
    setTimeout(() => {
      navigate("/search");
    }, 1000);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <Mail className="w-6 h-6 text-primary" />
        <span className="text-xl font-medium">NewsletterHub</span>
      </Link>
      
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-card p-8 animate-fade-in">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={(e) => handleSubmit(e, "signin")}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <Input 
                      id="email-signin" 
                      type="email" 
                      placeholder="your@email.com" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password-signin">Password</Label>
                      <Link 
                        to="#" 
                        className="text-xs text-primary hover:text-mint-dark"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input 
                        id="password-signin" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        required 
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-mint-dark">
                    Sign In
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit(e, "signup")}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Doe" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input 
                      id="email-signup" 
                      type="email" 
                      placeholder="your@email.com" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password-signup" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        required 
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
                    </Label>
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-mint-dark">
                    Create Account
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to our <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default Auth;
