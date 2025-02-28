
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

  const activeLink = "text-blue-400 font-medium";
  const inactiveLink = "text-gray-300 hover:text-white transition-colors";
  
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      toast({
        title: "Logger ut...",
        description: "Du blir logget ut av systemet",
      });
      
      // Call the signOut function and wait for it to complete
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
    <nav className="sticky top-0 z-50 w-full bg-dark-200/80 backdrop-blur-sm border-b border-white/10">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-medium tracking-tight text-white">NewsletterHub</span>
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
                <Button variant="outline" className="btn-hover-effect border-blue-400 text-blue-400 hover:bg-blue-400/10">
                  Oppgrader
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-dark-400 hover:bg-dark-500">
                    <User className="w-5 h-5 text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-dark-300 border-white/10">
                  <DropdownMenuLabel className="text-gray-100">
                    {user.user_metadata.firstName || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => navigate('/account')} className="hover:bg-dark-400 text-gray-200">
                    Min konto
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-dark-400 text-gray-200">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/saved')} className="hover:bg-dark-400 text-gray-200">
                    Lagrede nyhetsbrev
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-red-400 hover:bg-dark-400"
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
                <Button variant="ghost" className="btn-hover-effect text-gray-300 hover:text-white">Logg inn</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-colors btn-hover-effect">
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
            className="text-gray-300"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-down">
          <div className="flex flex-col px-4 pt-2 pb-4 space-y-4 border-t border-white/10 bg-dark-300">
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
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                {!isPremium && (
                  <Button variant="outline" className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10">
                    Oppgrader
                  </Button>
                )}
                
                <Button 
                  variant="default" 
                  className="w-full bg-dark-400 text-white hover:bg-dark-500"
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
                    className="w-full text-gray-300 border-white/10 hover:bg-dark-400"
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
                  className="w-full text-red-400 border-red-400/20 hover:bg-red-400/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logg ut
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <Link to="/auth?mode=signin" className="w-full" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full text-gray-300 border-white/10 hover:bg-dark-400">Logg inn</Button>
                </Link>
                <Link to="/auth?mode=signup" className="w-full" onClick={toggleMenu}>
                  <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">Registrer</Button>
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
