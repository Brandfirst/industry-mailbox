
import { Mail, Users, BarChart, Calendar } from "lucide-react";
import { useState } from "react";
import { SectionManager, Section } from "@/components/SectionManager";

const StatsSection = () => {
  // Stats data with mock values for now
  const stats = [
    { value: "5,000+", label: "Nyhetsbrev", icon: Mail },
    { value: "200+", label: "Byråer", icon: Users },
    { value: "97%", label: "Fornøyde kunder", icon: BarChart },
    { value: "12,000+", label: "Ukentlige brukere", icon: Calendar },
  ];

  // Logo data
  const logos = [
    { name: "TRUE CLASSIC", className: "font-bold tracking-wide" },
    { name: "AGI", className: "font-light" },
    { name: "VAYNERMEDIA", className: "font-medium" },
    { name: "THE RIDGE", className: "font-bold" },
    { name: "PARAMOUNT", className: "font-light italic" },
    { name: "TUBESCIENCE", className: "font-medium tracking-wide" },
    { name: "JONES ROAD", className: "font-bold tracking-widest" },
    { name: "JAMBYS", className: "font-light italic" },
    { name: "KETTLE & FIRE", className: "font-medium" },
    { name: "BACARDI", className: "font-bold" },
    { name: "MAGIC SPOON", className: "font-medium" },
    { name: "HEXCLAD", className: "font-bold tracking-wider" },
  ];

  // Define the sections
  const brandLogosSection = (
    <div className="pb-8 mb-0 pt-0 -mt-8">
      <h3 className="text-center text-sm md:text-base text-gray-400 mb-4">Loved by 5,000+ Brands & Agencies</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12">
        {logos.map((logo, index) => (
          <div key={index} className="flex items-center justify-center">
            <span className={`text-white text-sm md:text-base opacity-80 hover:opacity-100 transition-opacity ${logo.className}`}>
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const statsGridSection = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16 border-t border-gray-800 pt-10">
      {stats.map((stat, index) => (
        <div key={index} className="p-6 bg-[#0A0A0A] rounded-xl border border-[#3a6ffb]/20 hover:border-[#3a6ffb]/30 transition-all">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
            <stat.icon className="h-6 w-6 text-[#3a6ffb]" />
          </div>
          <span className="text-sm text-gray-300">{stat.label}</span>
        </div>
      ))}
    </div>
  );

  // Define initial sections - moving brandLogos to be first
  const initialSections: Section[] = [
    { id: "brandLogos", title: "Brand Logos", component: brandLogosSection },
    { id: "statsGrid", title: "Stats Grid", component: statsGridSection }
  ];

  // State for managing the sections
  const [sectionsList, setSectionsList] = useState<Section[]>(initialSections);

  // Handle section reordering
  const handleReorder = (reorderedSections: Section[]) => {
    setSectionsList(reorderedSections);
  };

  return (
    <section className="py-2 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Render sections based on their order */}
        {sectionsList.map((section) => (
          <div key={section.id}>{section.component}</div>
        ))}

        {/* Section Manager component */}
        <SectionManager sections={sectionsList} onReorder={handleReorder} />
      </div>
    </section>
  );
};

export default StatsSection;
