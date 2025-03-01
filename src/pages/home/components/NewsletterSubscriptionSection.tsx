
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
              className="bg-blue-950/40 border-blue-500/30 text-white" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
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
