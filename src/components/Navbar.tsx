
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Mail, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Mock authentication state - would be replaced with real auth
  const isAuthenticated = false;
  const isPremium = false;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const activeLink = "text-mint-dark font-medium";
  const inactiveLink = "text-foreground/80 hover:text-foreground transition-colors";

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
            Home
          </Link>
          <Link 
            to="/search" 
            className={`${location.pathname === '/search' ? activeLink : inactiveLink} animate-enter`}
          >
            Search
          </Link>
          {isAuthenticated && (
            <Link 
              to="/saved" 
              className={`${location.pathname === '/saved' ? activeLink : inactiveLink} animate-enter`}
            >
              Saved
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {!isPremium && (
                <Button variant="outline" className="btn-hover-effect text-mint-dark border-mint-dark hover:bg-mint-light">
                  Upgrade
                </Button>
              )}
              <Link to="/account">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth?mode=signin">
                <Button variant="ghost" className="btn-hover-effect">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button className="bg-primary text-white hover:bg-mint-dark transition-colors btn-hover-effect">
                  Sign Up
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
              Home
            </Link>
            <Link 
              to="/search" 
              className={`${location.pathname === '/search' ? activeLink : inactiveLink} py-2`}
              onClick={toggleMenu}
            >
              Search
            </Link>
            {isAuthenticated && (
              <Link 
                to="/saved" 
                className={`${location.pathname === '/saved' ? activeLink : inactiveLink} py-2`}
                onClick={toggleMenu}
              >
                Saved
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-2 border-t">
                {!isPremium && (
                  <Button variant="outline" className="w-full text-mint-dark border-mint-dark hover:bg-mint-light">
                    Upgrade
                  </Button>
                )}
                <Link to="/account" className="w-full" onClick={toggleMenu}>
                  <Button variant="default" className="w-full">Account</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link to="/auth?mode=signin" className="w-full" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth?mode=signup" className="w-full" onClick={toggleMenu}>
                  <Button className="w-full bg-primary text-white hover:bg-mint-dark">Sign Up</Button>
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
