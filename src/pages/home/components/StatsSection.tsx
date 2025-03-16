
import { useState } from "react";

const StatsSection = () => {
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

  // Define the brand logos section
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

  return (
    <section className="py-2 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        {brandLogosSection}
      </div>
    </section>
  );
};

export default StatsSection;
