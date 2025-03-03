
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavigationLinks } from "./NavigationLinks";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { AuthButtons } from "./AuthButtons";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isPremium, isAdmin } = useAuth();

  useEffect(() => {
    console.log('Navbar Auth Debug:', {
      user: user?.email,
      isAdmin: isAdmin,
      userMetadata: user?.user_metadata,
      role: user?.user_metadata?.role
    });
  }, [user, isAdmin]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const activeLink = "text-[#FF5722] font-medium";
  const inactiveLink = "text-gray-400 hover:text-white transition-colors";

  // Don't show navbar on admin pages
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-black backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#FF5722]" />
            <span className="text-xl font-medium tracking-tight text-white">Nyhetsbrevo</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavigationLinks 
            isAdmin={isAdmin} 
            user={user} 
            activeLink={activeLink} 
            inactiveLink={inactiveLink} 
          />
          
          {user ? (
            <UserMenu user={user} isAdmin={isAdmin} isPremium={isPremium} />
          ) : (
            <AuthButtons />
          )}
        </div>

        <div className="flex md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="text-gray-400"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <MobileMenu 
        isOpen={isMenuOpen} 
        user={user} 
        isAdmin={isAdmin} 
        isPremium={isPremium} 
        activeLink={activeLink} 
        inactiveLink={inactiveLink}
        toggleMenu={toggleMenu}
      />
    </nav>
  );
};

export default Navbar;
