
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Announcement bar that appears as a floating button above hero content
const AnnouncementBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-20 left-0 right-0 z-20 flex justify-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="inline-flex items-center gap-2 px-4 py-1.5 bg-black rounded-full border border-[#0FA0CE]/30 shadow-md hover:shadow-[#0FA0CE]/20 transition-all">
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0FA0CE] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FA0CE]"></span>
          </span>
          <span className="text-sm font-medium text-white">Nytt! Newsletter 2.0 er nå tilgjengelig!</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-[#0FA0CE] ml-1" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[#0FA0CE] ml-1" />
          )}
        </PopoverTrigger>
        
        <PopoverContent className="w-80 lg:w-96 bg-black/95 p-4 rounded-lg border border-[#0FA0CE]/20 text-left shadow-glow">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-medium text-[#0FA0CE]">Hva er nytt i Newsletter 2.0?</h3>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
              <li>Forbedret brukergrensesnitt med raskere navigasjon</li>
              <li>Integrering med flere e-postplattformer</li>
              <li>Avanserte filtreringsalternativer</li>
              <li>Enklere deling av nyhetsbrev med kollegaer</li>
              <li>Personlig nyhetsbrevarkiv</li>
            </ul>
            <a href="/features" className="text-[#0FA0CE] hover:text-[#0FA0CE]/80 text-sm flex items-center mt-2">
              Les mer om alle funksjonene <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Export a null component to prevent rendering a second navbar
export const HomeHeader = () => null;

export default AnnouncementBar;
