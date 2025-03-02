
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewsletterSubscriptionSection = () => {
  const [email, setEmail] = useState("");
  
  return (
    <section className="py-20 bg-gradient-to-b from-black to-blue-950/20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-2xl border border-blue-500/20 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Få eksklusive markedsføringstips</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Registrer deg for vårt ukentlige nyhetsbrev og få eksklusive innsikter og tips om nyhetsbrev-markedsføring.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Din e-postadresse" 
              className="bg-black/30 backdrop-blur-sm border-[#FF5722]/20 text-white" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="bg-gradient-to-r from-[#FF5722] to-[#FF8A50] hover:from-[#FF8A50] hover:to-[#FF5722] text-white transition-all backdrop-blur-sm bg-opacity-20 border border-white/10 shadow-md">
              Abonner
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-400 mt-4">
            Ved å registrere deg godtar du våre vilkår og personvernerklæring. Du kan når som helst melde deg av.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscriptionSection;
