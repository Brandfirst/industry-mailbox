
import React from 'react';

const LogoSection = () => {
  // Array of brand names to use as text-based logos
  const brands = [
    'Moncler', 'Wayfair', 'Skims', 'Fenty Beauty', 'Sephora', 
    'Rare Beauty', 'Louis Vuitton', 'Walmart', 'Michael Kors'
  ];

  return (
    <section className="py-12 bg-black">
      <div className="container mx-auto px-4">
        <div className="w-full flex flex-col gap-4 md:gap-8 md:items-center">
          <span className="text-[#3a6ffb] uppercase text-sm font-bold leading-snug tracking-wide md:text-lg text-center">
            Trusted by thousands of the Internet's best brands
          </span>
          
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            {brands.map((brand, index) => (
              <div key={index} className="flex-[0_0_calc(50%-20px)] md:flex-[0_0_calc(16.66%-20px)] text-center">
                <div className="h-12 flex items-center justify-center">
                  <span className="text-gray-300 font-medium text-lg">{brand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoSection;
