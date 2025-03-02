
import React from 'react';

interface HeroHeadingProps {
  customTitle?: string;
  customSubtitle?: string;
}

const HeroHeading: React.FC<HeroHeadingProps> = ({ customTitle, customSubtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
        {customTitle || "Finn de beste nyhetsbrevene i Norge"}
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        {customSubtitle || "En omfattende samling av de mest populære nyhetsbrevene fra norske merkenavn og byråer"}
      </p>
    </div>
  );
};

export default HeroHeading;
