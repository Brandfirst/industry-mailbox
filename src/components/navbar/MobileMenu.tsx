
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { NavigationLinks } from "./NavigationLinks";
import { LogoutHandler } from "./LogoutHandler";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  isAdmin: boolean;
  isPremium: boolean;
  activeLink: string;
  inactiveLink: string;
  toggleMenu: () => void;
}

export const MobileMenu = ({ 
  isOpen, 
  user, 
  isAdmin, 
  isPremium, 
  activeLink, 
  inactiveLink,
  toggleMenu 
}: MobileMenuProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden animate-slide-down">
      <div className={`flex flex-col px-4 pt-2 pb-4 space-y-4 border-t ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-dark-300 border-white/10'}`}>
        <NavigationLinks 
          isAdmin={isAdmin} 
          user={user} 
          activeLink={activeLink} 
          inactiveLink={inactiveLink} 
          onClick={toggleMenu}
        />
        
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <ThemeToggle className={theme === 'light' ? 'border-gray-300' : 'border-[#FF5722]/30'} />
          </div>
        </div>
        
        {user ? (
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            {!isPremium && (
              <Button variant="outline" className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10">
                Oppgrader
              </Button>
            )}
            
            <Button 
              variant="default" 
              className={`w-full ${theme === 'light' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-dark-400 text-white hover:bg-dark-500'}`}
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
                className={`w-full ${theme === 'light' ? 'text-gray-700 border-gray-300' : 'text-gray-300 border-white/10'} hover:bg-dark-400`}
                onClick={() => {
                  navigate('/admin');
                  toggleMenu();
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin panel
              </Button>
            )}
            
            <Button variant="outline">
              <LogoutHandler isMobile={true} className="flex items-center" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <Link to="/auth?mode=signin" className="w-full" onClick={toggleMenu}>
              <Button variant="outline" className={`w-full ${theme === 'light' ? 'text-gray-700 border-gray-300' : 'text-gray-300 border-white/10'} hover:bg-dark-400`}>Logg inn</Button>
            </Link>
            <Link to="/auth?mode=signup" className="w-full" onClick={toggleMenu}>
              <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">Registrer</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
