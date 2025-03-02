
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mt-12 text-center">
          <Link to="/search">
            <Button className="bg-[#3a6ffb] hover:bg-[#3a6ffb]/90 text-white px-8 py-3">
              Utforsk alle funksjoner
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
