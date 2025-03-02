
import { useState } from "react";
import { Mail, Users, BarChart, Calendar } from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";
import EditableText from "@/components/EditableText";

const StatsSection = () => {
  const { isEditMode } = useEditMode();
  const [sectionTitle, setSectionTitle] = useState("Dyp innsikt i nyhetsbrev-landskapet");
  const [sectionDescription, setSectionDescription] = useState("NewsletterHub kombinerer AI-analyse med omfattende data fra ledende norske merkevarer, for å gi deg uovertruffen innsikt i nyhetsbrev-trender, design og effektivitet.");
  
  // Stats data with mock values for now
  const [stats, setStats] = useState([
    { value: "5,000+", label: "Nyhetsbrev", icon: Mail },
    { value: "200+", label: "Byråer", icon: Users },
    { value: "97%", label: "Fornøyde kunder", icon: BarChart },
    { value: "12,000+", label: "Ukentlige brukere", icon: Calendar },
  ]);

  // Logo data
  const [logos, setLogos] = useState([
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
  ]);

  const [brandLogoTitle, setBrandLogoTitle] = useState("Loved by 5,000+ Brands & Agencies");

  const handleStatValueChange = (index: number, newValue: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], value: newValue };
    setStats(newStats);
  };

  const handleStatLabelChange = (index: number, newLabel: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], label: newLabel };
    setStats(newStats);
  };

  const handleLogoNameChange = (index: number, newName: string) => {
    const newLogos = [...logos];
    newLogos[index] = { ...newLogos[index], name: newName };
    setLogos(newLogos);
  };

  return (
    <section className="py-8 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Brand Logos Section */}
        <div className="pb-16 mb-10">
          <EditableText 
            text={brandLogoTitle}
            onSave={setBrandLogoTitle}
            className="text-center text-sm md:text-base text-gray-400 mb-10"
            as="h3"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12">
            {logos.map((logo, index) => (
              <div key={index} className="flex items-center justify-center">
                <EditableText 
                  text={logo.name}
                  onSave={(newName) => handleLogoNameChange(index, newName)}
                  className={`text-white text-sm md:text-base opacity-80 hover:opacity-100 transition-opacity ${logo.className}`}
                  as="span"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16 border-t border-gray-800 pt-10">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 bg-[#0A0A0A] rounded-xl border border-[#3a6ffb]/20 hover:border-[#3a6ffb]/30 transition-all">
              <div className="flex justify-between items-center mb-2">
                <EditableText 
                  text={stat.value}
                  onSave={(newValue) => handleStatValueChange(index, newValue)}
                  className="text-2xl md:text-3xl font-bold text-white"
                  as="span"
                />
                <stat.icon className="h-6 w-6 text-[#3a6ffb]" />
              </div>
              <EditableText 
                text={stat.label}
                onSave={(newLabel) => handleStatLabelChange(index, newLabel)}
                className="text-sm text-gray-300"
                as="span"
              />
            </div>
          ))}
        </div>

        {/* Data Visualization Text Section */}
        <div className="text-center mb-14 border-t border-gray-800 pt-10">
          <EditableText 
            text={sectionTitle}
            onSave={setSectionTitle}
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            as="h2"
          />
          <EditableText 
            text={sectionDescription}
            onSave={setSectionDescription}
            className="text-lg text-gray-300 max-w-3xl mx-auto"
            as="p"
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
