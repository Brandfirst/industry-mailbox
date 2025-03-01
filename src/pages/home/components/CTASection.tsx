
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-blue-950/30">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 rounded-2xl border border-blue-500/20 p-8 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Klar til å forbedre dine nyhetsbrev?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Start 14-dagers gratis prøveperiode i dag og få tilgang til markedets beste nyhetsbrev-database.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-7 text-lg">
                Start gratis prøveperiode
              </Button>
            </Link>
            <Link to="/search">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-blue-500/10 px-8 py-7 text-lg">
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
