
import { useState } from "react";
import DynamicCounter from "../DynamicCounter";
import EditableText from "@/components/EditableText";

const HeroHeading = () => {
  const [headingText1, setHeadingText1] = useState("Norges største database");
  const [headingText2, setHeadingText2] = useState("av");
  const [headingText3, setHeadingText3] = useState("nyhetsbrev");
  const [subtitleText1, setSubtitleText1] = useState("Utforsk mer enn");
  const [subtitleText2, setSubtitleText2] = useState("nyhetsbrev fra");
  const [subtitleText3, setSubtitleText3] = useState("varemerker. Laget for markedsførere");
  const [subtitleText4, setSubtitleText4] = useState("og byråer");
  const [subtitleText5, setSubtitleText5] = useState("som ønsker å skape effektive og engasjerende nyhetsbrev.");

  return (
    <div className="animate-slide-down max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-ebgaramond tracking-tight mb-6">
        <span className="block text-white mb-2">
          <EditableText 
            text={headingText1} 
            onSave={setHeadingText1} 
            className="inline" 
            as="span" 
          />
        </span>
        <span className="block mt-2 text-white">
          <EditableText 
            text={headingText2} 
            onSave={setHeadingText2} 
            className="inline" 
            as="span" 
          />
          <span className="text-[#FF5722] ml-2">
            <EditableText 
              text={headingText3} 
              onSave={setHeadingText3} 
              className="inline" 
              as="span" 
            />
          </span>
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        <EditableText 
          text={subtitleText1} 
          onSave={setSubtitleText1} 
          className="inline" 
          as="span" 
        />
        <DynamicCounter 
          startValue={70350} 
          incrementAmount={7} 
          intervalMs={1000} 
          prefix=" " 
          suffix=" " 
        />
        <EditableText 
          text={subtitleText2} 
          onSave={setSubtitleText2} 
          className="inline" 
          as="span" 
        />
        <DynamicCounter 
          startValue={1750} 
          incrementAmount={2} 
          intervalMs={1000} 
          prefix=" " 
          suffix=" " 
        />
        <EditableText 
          text={subtitleText3} 
          onSave={setSubtitleText3} 
          className="inline" 
          as="span" 
        />
        <span className="smaller-text mx-1">
          <EditableText 
            text={subtitleText4} 
            onSave={setSubtitleText4} 
            className="inline" 
            as="span" 
          />
        </span>
        <EditableText 
          text={subtitleText5} 
          onSave={setSubtitleText5} 
          className="inline" 
          as="span" 
        />
      </p>
    </div>
  );
};

export default HeroHeading;
