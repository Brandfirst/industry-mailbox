
import DynamicCounter from "../DynamicCounter";

const HeroHeading = () => {
  return (
    <div className="animate-slide-down max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-ebgaramond tracking-tight mb-6">
        <span className="block text-white mb-2">Norges største database</span>
        <span className="block mt-2 text-white">
          av <span className="text-[#FF5722]">nyhetsbrev</span>
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        Utforsk mer enn 
        <DynamicCounter 
          startValue={70350} 
          incrementAmount={7} 
          intervalMs={1000} 
          prefix=" " 
          suffix="" 
        />
         nyhetsbrev fra 
        <DynamicCounter 
          startValue={1750} 
          incrementAmount={2} 
          intervalMs={1000} 
          prefix=" " 
          suffix=" " 
        />
        varemerker. 
        Laget for markedsførere
        <span className="smaller-text mx-1">og byråer</span>
        som ønsker å skape effektive
        og engasjerende nyhetsbrev.
      </p>
    </div>
  );
};

export default HeroHeading;
