
import React from 'react';

type LogoData = {
  name: string;
  className: string;
};

interface BrandLogosSectionProps {
  logos: LogoData[];
}

const BrandLogosSection: React.FC<BrandLogosSectionProps> = ({ logos }) => {
  return (
    <div className="pb-16 mb-10">
      <h3 
        data-editable="true" 
        data-editable-type="text" 
        data-editable-id="brandlogos-title" 
        className="text-center text-sm md:text-base text-gray-400 mb-10"
      >
        Loved by 5,000+ Brands & Agencies
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12">
        {logos.map((logo, index) => (
          <div key={index} className="flex items-center justify-center">
            <span 
              data-editable="true" 
              data-editable-type="text" 
              data-editable-id={`logo-${index}`} 
              className={`text-white text-sm md:text-base opacity-80 hover:opacity-100 transition-opacity ${logo.className}`}
            >
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandLogosSection;
