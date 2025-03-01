
import { Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";

interface NavigationLinksProps {
  isAdmin: boolean;
  user: any;
  activeLink: string;
  inactiveLink: string;
  onClick?: () => void; // Optional callback for mobile menu
}

export const NavigationLinks = ({ isAdmin, user, activeLink, inactiveLink, onClick }: NavigationLinksProps) => {
  const location = useLocation();
  
  return (
    <>
      <Link 
        to="/" 
        className={`${location.pathname === '/' ? activeLink : inactiveLink} animate-enter`}
        onClick={onClick}
      >
        Hjem
      </Link>
      <Link 
        to="/search" 
        className={`${location.pathname === '/search' ? activeLink : inactiveLink} animate-enter`}
        onClick={onClick}
      >
        Søk
      </Link>
      {user && (
        <Link 
          to="/saved" 
          className={`${location.pathname === '/saved' ? activeLink : inactiveLink} animate-enter`}
          onClick={onClick}
        >
          Lagret
        </Link>
      )}
      {isAdmin && (
        <Link 
          to="/admin" 
          className={`${location.pathname === '/admin' ? activeLink : inactiveLink} animate-enter flex items-center`}
          onClick={onClick}
        >
          <Shield className="w-4 h-4 mr-1" />
          Admin
        </Link>
      )}
    </>
  );
};
