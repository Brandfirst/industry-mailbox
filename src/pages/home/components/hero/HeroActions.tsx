
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

const HeroActions = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-10">
      <Link to="/search">
        <Button 
          size="lg" 
          className="relative overflow-hidden"
          style={{
            backgroundColor: "transparent",
            borderColor: "rgba(255, 87, 34, 0.3)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5722]/10 to-[#FF8A50]/10 opacity-0 hover:opacity-100 transition-opacity"></div>
          <span className="relative z-10">Utforsk nyhetsbrev</span> <Search className="ml-2 h-4 w-4 relative z-10" />
        </Button>
      </Link>
      <Link to="/auth?mode=signup">
        <Button 
          size="lg" 
          variant="outline" 
          className="relative overflow-hidden"
          style={{
            backgroundColor: "transparent",
            borderColor: "rgba(255, 87, 34, 0.3)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5722]/10 to-[#FF8A50]/10 opacity-0 hover:opacity-100 transition-opacity"></div>
          <span className="relative z-10">Prøv gratis</span> <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
        </Button>
      </Link>
    </div>
  );
};

export default HeroActions;
