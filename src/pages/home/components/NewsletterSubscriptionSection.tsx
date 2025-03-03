
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";

const NewsletterSubscriptionSection = () => {
  const [email, setEmail] = useState("");
  const { theme } = useTheme();
  
  return (
    <section className={`py-20 relative overflow-hidden ${theme === 'light' ? 'bg-gray-100' : 'bg-black'}`}>
      {/* Removed SplineBackground */}
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <div className={`${theme === 'light' ? 'bg-white shadow-lg' : 'bg-black/90 backdrop-blur-md'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-[#FF5722]/20'} p-8 md:p-12 text-center`}>
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 newsletter-header inline-block px-6 py-2 border rounded-lg ${theme === 'light' ? 'border-gray-300 bg-gray-50 text-gray-900' : 'border-[#FF5722]/30 text-white'}`}>
            Få eksklusive markedsføringstips
          </h2>
          <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-8 max-w-xl mx-auto`}>
            Registrer deg for vårt ukentlige nyhetsbrev og få eksklusive innsikter og tips om nyhetsbrev-markedsføring.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Din e-postadresse" 
              className={`${theme === 'light' ? 'bg-white border-gray-300' : 'bg-black/30 backdrop-blur-sm border-[#FF5722]/20'} ${theme === 'light' ? 'text-gray-900' : 'text-white'} rounded-xl`} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'gradient-button'}>
              Abonner
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-4`}>
            Ved å registrere deg godtar du våre vilkår og personvernerklæring. Du kan når som helst melde deg av.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscriptionSection;
