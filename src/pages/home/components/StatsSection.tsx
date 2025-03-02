
import { useState } from "react";
import { Mail, Users, BarChart, Calendar } from "lucide-react";
import { SectionManager } from "@/components/SectionManager";
import { Section } from "@/components/SectionManager";
import BrandLogosSection from "./stats/BrandLogosSection";
import StatsGridSection from "./stats/StatsGridSection";
import DataVisualizationSection from "./stats/DataVisualizationSection";
import ChartsSection from "./stats/ChartsSection";
import { StatData, LogoData } from "./stats/types";

const StatsSection = () => {
  // Stats data with mock values
  const stats: StatData[] = [
    { value: "5,000+", label: "Nyhetsbrev", icon: Mail },
    { value: "200+", label: "Byråer", icon: Users },
    { value: "97%", label: "Fornøyde kunder", icon: BarChart },
    { value: "12,000+", label: "Ukentlige brukere", icon: Calendar },
  ];

  // Logo data
  const logos: LogoData[] = [
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
  const brandLogosSection = <BrandLogosSection logos={logos} />;
  const statsGridSection = <StatsGridSection stats={stats} />;
  const dataVisualizationSection = <DataVisualizationSection />;
  const chartsSection = <ChartsSection />;

  // Define initial sections
  const initialSections: Section[] = [
    { id: "brandLogos", title: "Brand Logos", component: brandLogosSection },
    { id: "statsGrid", title: "Stats Grid", component: statsGridSection },
    { id: "dataViz", title: "Data Visualization Text", component: dataVisualizationSection },
    { id: "charts", title: "Charts & Analysis", component: chartsSection }
  ];

  // State for managing the sections
  const [sectionsList, setSectionsList] = useState<Section[]>(initialSections);

  // Handle section reordering
  const handleReorder = (reorderedSections: Section[]) => {
    setSectionsList(reorderedSections);
  };

  return (
    <section 
      data-editable="true" 
      data-editable-type="padding" 
      data-editable-id="stats-section-container" 
      className="py-8 bg-black"
    >
      <div 
        data-editable="true" 
        data-editable-type="padding" 
        data-editable-id="stats-container" 
        className="container mx-auto px-4 max-w-7xl"
      >
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
