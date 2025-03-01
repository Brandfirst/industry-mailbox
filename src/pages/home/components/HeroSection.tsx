
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
        <div className="animate-slide-down max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
            For <span className="smaller-text">byråer</span> og markedsførere
            <span className="block text-blue-400 mt-4 relative">
              Norges største database av nyhetsbrev
              <div className="absolute -bottom-2 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Få tilgang til markedsføringsintelligens fra tusenvis av norske nyhetsbrev. 
            Ideelt for markedsførere, byråer og bransjefolk.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/search">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6">
                Start Søket
                <Search className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-blue-900/20 px-8 py-6">
                Opprett Konto
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          {/* App screenshot component */}
          <AppScreenshot />
        </div>
      </div>
    </section>
  );
};

const AppScreenshot = () => {
  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-800">
      <div className="flex">
        {/* Sidebar - hidden on mobile */}
        <div className="bg-[#0f1729] w-52 border-r border-gray-800 py-4 hidden md:block min-h-[480px]">
          <div className="px-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L7 11L8.4 9.55L12 13.15L15.6 9.55L17 11L12 16Z" fill="currentColor"></path>
              </svg>
              <span className="text-white font-medium">NewsletterHub</span>
            </div>
          </div>
          <div className="space-y-1 px-2">
            <div className="bg-blue-500/20 text-blue-400 rounded-md py-1.5 px-3 flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="currentColor"></path>
              </svg>
              <span className="text-sm">Nyhetsbrev</span>
            </div>
            <div className="text-gray-400 rounded-md py-1.5 px-3 flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" fill="currentColor"></path>
              </svg>
              <span className="text-sm">Merker</span>
            </div>
            <div className="text-gray-400 rounded-md py-1.5 px-3 flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"></path>
              </svg>
              <span className="text-sm">Statistikk</span>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-4 bg-[#111827]">
          <div className="mb-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white text-base font-medium">Søk i Nyhetsbrev</h3>
                <p className="text-gray-400 text-xs">Finn og analyser norske nyhetsbrev</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-[#1f2937] rounded-md px-3 py-1.5 text-gray-300 text-xs">Mine Favoritter</div>
                <div className="bg-[#1f2937] rounded-md px-3 py-1.5 text-gray-300 text-xs">Merker</div>
                <div className="bg-[#1f2937] rounded-md px-3 py-1.5 text-gray-300 text-xs">Hjelp</div>
                <button className="bg-blue-500 hover:bg-blue-600 rounded-md px-3 py-1.5 text-white text-xs">
                  Lagre Søk
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 mb-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Søk i nyhetsbrev..." 
                  className="bg-[#1f2937] border-0 rounded-md pl-10 pr-4 py-2 text-sm text-white w-64 placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 bg-[#1f2937] rounded-md px-3 py-2 text-sm text-gray-300">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                  <span>Filtrer</span>
                </div>
                <div className="flex items-center gap-1 bg-[#1f2937] rounded-md px-3 py-2 text-sm text-gray-300">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                  </svg>
                  <span>Sorter</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Newsletter Cards */}
              <NewsletterSampleCards />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsletterSampleCards = () => {
  return (
    <>
      {/* Newsletter Card 1 */}
      <div className="bg-white rounded-md overflow-hidden">
        <div className="relative">
          <div className="w-full h-36 bg-blue-100 flex items-center justify-center">
            <div className="text-center px-4">
              <h3 className="text-blue-800 font-bold">Ukens Tilbud</h3>
              <p className="text-blue-600 text-sm">Opptil 50% rabatt!</p>
            </div>
          </div>
          <div className="absolute top-2 left-2 bg-white rounded-full p-1">
            <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">E</div>
          </div>
        </div>
        <div className="p-2">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-medium text-gray-800">Elkjøp</div>
            <div className="text-xs text-gray-500">1 dag siden</div>
          </div>
          <div className="bg-blue-100 rounded-md px-2 py-1 text-center">
            <span className="text-xs font-bold text-blue-800">Forbrukerelektronikk</span>
          </div>
        </div>
      </div>

      {/* Newsletter Card 2 */}
      <div className="bg-white rounded-md overflow-hidden">
        <div className="relative">
          <div className="w-full h-36 bg-green-100 flex items-center justify-center">
            <div className="text-center px-4">
              <h3 className="text-green-800 font-bold">Sommertilbud</h3>
              <p className="text-green-600 text-sm">Nye kolleksjoner</p>
            </div>
          </div>
          <div className="absolute top-2 left-2 bg-white rounded-full p-1">
            <div className="bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">H</div>
          </div>
        </div>
        <div className="p-2">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-medium text-gray-800">H&M</div>
            <div className="text-xs text-gray-500">2 dager siden</div>
          </div>
          <div className="bg-green-100 rounded-md px-2 py-1 text-center">
            <span className="text-xs font-bold text-green-800">Mote</span>
          </div>
        </div>
      </div>

      {/* Newsletter Card 3 */}
      <div className="bg-white rounded-md overflow-hidden">
        <div className="relative">
          <div className="w-full h-36 bg-orange-100 flex items-center justify-center">
            <div className="text-center px-4">
              <h3 className="text-orange-800 font-bold">Helgetilbud</h3>
              <p className="text-orange-600 text-sm">Gratis frakt!</p>
            </div>
          </div>
          <div className="absolute top-2 left-2 bg-white rounded-full p-1">
            <div className="bg-orange-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">C</div>
          </div>
        </div>
        <div className="p-2">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-medium text-gray-800">COOP</div>
            <div className="text-xs text-gray-500">3 dager siden</div>
          </div>
          <div className="bg-orange-100 rounded-md px-2 py-1 text-center">
            <span className="text-xs font-bold text-orange-800">Dagligvarer</span>
          </div>
        </div>
      </div>

      {/* Newsletter Card 4 */}
      <div className="bg-white rounded-md overflow-hidden">
        <div className="relative">
          <div className="w-full h-36 bg-purple-100 flex items-center justify-center">
            <div className="text-center px-4">
              <h3 className="text-purple-800 font-bold">Månedens Nytt</h3>
              <p className="text-purple-600 text-sm">Tips og trender</p>
            </div>
          </div>
          <div className="absolute top-2 left-2 bg-white rounded-full p-1">
            <div className="bg-purple-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">D</div>
          </div>
        </div>
        <div className="p-2">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs font-medium text-gray-800">DNB</div>
            <div className="text-xs text-gray-500">4 dager siden</div>
          </div>
          <div className="bg-purple-100 rounded-md px-2 py-1 text-center">
            <span className="text-xs font-bold text-purple-800">Finans</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
