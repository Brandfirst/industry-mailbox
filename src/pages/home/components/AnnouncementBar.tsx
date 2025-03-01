
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const AnnouncementBar = () => {
  return (
    <div className="py-3 bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-blue-900/40 border-y border-blue-500/20">
      <div className="container mx-auto flex justify-center items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <span className="text-blue-300">Nytt! Newsletter 2.0 er nå tilgjengelig!</span>
      </div>
    </div>
  );
};

export const HomeHeader = () => {
  return (
    <header className="border-b border-blue-500/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Mail className="text-blue-400 h-6 w-6" />
          <span className="text-white font-bold text-xl">NewsletterHub</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-white hover:text-blue-400 transition-colors">Hjem</Link>
          <Link to="/search" className="text-white hover:text-blue-400 transition-colors">Søk</Link>
          <Link to="/auth?mode=login" className="text-white hover:text-blue-400 transition-colors">Logg inn</Link>
          <Link to="/auth?mode=signup">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4">Registrer</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AnnouncementBar;
