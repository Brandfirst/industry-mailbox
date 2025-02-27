
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Mail, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    document.title = "Page Not Found | NewsletterHub";
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md animate-fade-in">
        <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! We couldn't find the page you're looking for.
        </p>
        <Link to="/">
          <Button className="bg-primary hover:bg-mint-dark text-white">
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
