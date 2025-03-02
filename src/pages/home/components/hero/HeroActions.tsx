
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

const HeroActions = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-10">
      <Link to="/search">
        <Button size="lg" className="gradient-button">
          Utforsk nyhetsbrev <Search className="ml-2 h-4 w-4" />
        </Button>
      </Link>
      <Link to="/auth?mode=signup">
        <Button size="lg" variant="outline" className="glass-button">
          Prøv gratis <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default HeroActions;
