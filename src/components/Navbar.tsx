
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Mail, User, Menu, X, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isPremium, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Navbar Auth Debug:', {
      user: user?.email,
      isAdmin: isAdmin,
      userMetadata: user?.user_metadata,
      role: user?.user_metadata?.role
    });
  }, [user, isAdmin]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const activeLink = "text-mint-dark font-medium";
  const inactiveLink = "text-foreground/80 hover:text-foreground transition-colors";
  
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      toast({
        title: "Logger ut...",
        description: "Du blir logget ut av systemet",
      });
      
      await signOut();
      
      // The redirect is handled by the signOut function
    } catch (error) {
      console.error("Error during sign out:", error);
      toast({
        title: "Feil ved utlogging",
        description: "Kunne ikke logge ut. Prøv igjen.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-mint-dark" />
            <span className="text-xl font-medium tracking-tight">NewsletterHub</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`${location.pathname === '/' ? activeLink : inactiveLink} animate-enter`}
          >
            Hjem
          </Link>
          <Link 
            to="/search" 
            className={`${location.pathname === '/search' ? activeLink : inactiveLink} animate-enter`}
          >
            Søk
          </Link>
          {user && (
            <Link 
              to="/saved" 
              className={`${location.pathname === '/saved' ? activeLink : inactiveLink} animate-enter`}
            >
              Lagret
            </Link>
          )}
          {isAdmin && (
            <Link 
              to="/admin" 
              className={`${location.pathname === '/admin' ? activeLink : inactiveLink} animate-enter flex items-center`}
            >
              <Shield className="w-4 h-4 mr-1" />
              Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              {!isPremium && (
                <Button variant="outline" className="btn-hover-effect text-mint-dark border-mint-dark hover:bg-mint-light">
                  Oppgrader
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.user_metadata.firstName || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    Min konto
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="w-4 h-4 mr-2" />
                      Admin panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/saved')}>
                    Lagrede nyhetsbrev
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logg ut
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth?mode=signin">
                <Button variant="ghost" className="btn-hover-effect">Logg inn</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button className="bg-primary text-white hover:bg-mint-dark transition-colors btn-hover-effect">
                  Registrer
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-down">
          <div className="flex flex-col px-4 pt-2 pb-4 space-y-4 border-t">
            <Link 
              to="/" 
              className={`${location.pathname === '/' ? activeLink : inactiveLink} py-2`}
              onClick={toggleMenu}
            >
              Hjem
            </Link>
            <Link 
              to="/search" 
              className={`${location.pathname === '/search' ? activeLink : inactiveLink} py-2`}
              onClick={toggleMenu}
            >
              Søk
            </Link>
            {user && (
              <Link 
                to="/saved" 
                className={`${location.pathname === '/saved' ? activeLink : inactiveLink} py-2`}
                onClick={toggleMenu}
              >
                Lagret
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`${location.pathname === '/admin' ? activeLink : inactiveLink} py-2 flex items-center`}
                onClick={toggleMenu}
              >
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </Link>
            )}
            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t">
                {!isPremium && (
                  <Button variant="outline" className="w-full text-mint-dark border-mint-dark hover:bg-mint-light">
                    Oppgrader
                  </Button>
                )}
                
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => {
                    navigate('/account');
                    toggleMenu();
                  }}
                >
                  Min konto
                </Button>
                
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      navigate('/admin');
                      toggleMenu();
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin panel
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logg ut
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link to="/auth?mode=signin" className="w-full" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">Logg inn</Button>
                </Link>
                <Link to="/auth?mode=signup" className="w-full" onClick={toggleMenu}>
                  <Button className="w-full bg-primary text-white hover:bg-mint-dark">Registrer</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
