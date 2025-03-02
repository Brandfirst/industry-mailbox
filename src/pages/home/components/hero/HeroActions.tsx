
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

const HeroActions = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-10">
      <Link to="/search">
        <Button size="lg" className="gradient-button border border-[#888888]/30 announcement-glow-container relative overflow-hidden">
          <div className="absolute inset-0 announcement-glow-effect"></div>
          <span className="relative z-10">Utforsk nyhetsbrev</span> <Search className="ml-2 h-4 w-4 relative z-10" />
        </Button>
      </Link>
      <Link to="/auth?mode=signup">
        <Button size="lg" variant="outline" className="glass-button text-white border border-[#888888]/30 announcement-glow-container relative overflow-hidden">
          <div className="absolute inset-0 announcement-glow-effect"></div>
          <span className="relative z-10">Prøv gratis</span> <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
        </Button>
      </Link>
    </div>
  );
};

export default HeroActions;
