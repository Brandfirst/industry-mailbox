
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Removed SplineBackground */}
      
      <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
        <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-[#FF5722]/20 p-8 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Klar til å forbedre dine nyhetsbrev?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Start 14-dagers gratis prøveperiode i dag og få tilgang til markedets beste nyhetsbrev-database.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gradient-button px-8 py-7 text-lg">
                Start gratis prøveperiode
              </Button>
            </Link>
            <Link to="/search">
              <Button size="lg" variant="outline" className="glass-button px-8 py-7 text-lg">
                Se demoer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
