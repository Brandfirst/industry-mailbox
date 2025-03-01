import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Database, Users, BarChart, Calendar, Mail, Star, Award, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import Embla from 'embla-carousel-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Index = () => {
  const isMobile = useIsMobile();
  const [testimonialViewportRef, emblaApi] = Embla({ 
    loop: true, 
    align: "center",
    skipSnaps: false
  });
  const [isNewFeaturesOpen, setIsNewFeaturesOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    document.title = "NewsletterHub - Norges største nyhetsbrev arkiv";

    if (emblaApi) {
      emblaApi.on('select', () => {
        setActiveIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  // Stats data with mock values for now
  const stats = [
    { value: "5,000+", label: "Nyhetsbrev", icon: Mail },
    { value: "200+", label: "Byråer", icon: Users },
    { value: "97%", label: "Fornøyde kunder", icon: BarChart },
    { value: "12,000+", label: "Ukentlige brukere", icon: Calendar },
  ];

  // Testimonials data
  const testimonials = [
    {
      text: "NewsletterHub har hjulpet oss å finne de beste markedsførings-ideene fra konkurrentene våre.",
      author: "Marie Johansen",
      company: "Digital Byrå AS",
      initial: "M",
      rating: 5,
    },
    {
      text: "Den beste ressursen for å holde seg oppdatert på markedsføringstrender i Norge.",
      author: "Anders Nilsen",
      company: "BrandCore Norge",
      initial: "A",
      rating: 5,
    },
    {
      text: "Helt uunnværlig for strategiarbeidet vårt. Vi sparer så mye tid på research!",
      author: "Sofie Berg",
      company: "Mediekonsulenterne",
      initial: "S",
      rating: 4,
    },
  ];

  // Features for the new version
  const newFeatures = [
    "Raskere søk",
    "API-tilgang",
    "Nytt design",
    "Mobile app beta"
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Hero Section with mesh-gradient background and detailed app UI */}
      <section className="py-16 px-4 relative overflow-hidden mesh-gradient">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main content container */}
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="animate-slide-down">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
              For <span className="smaller-text">byråer</span> og markedsførere
              <span className="block text-blue-400 mt-2 relative">
                Norges største database av nyhetsbrev
                <div className="absolute -bottom-2 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Få tilgang til markedsføringsintelligens fra tusenvis av norske nyhetsbrev. 
              Ideelt for markedsførere, byråer og bransjefolk.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link to="/search">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-6 text-lg">
                  Start Søket
                  <Search className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button size="lg" variant="outline" className="border-blue-400/30 text-blue-400 hover:bg-blue-900/20 px-6 py-6 text-lg">
                  Opprett Konto
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            {/* Detailed app UI preview */}
            <div className="relative mx-auto max-w-4xl">
              <div className="bg-dark-300 rounded-lg overflow-hidden shadow-2xl border border-white/10">
                {/* Browser-like header */}
                <div className="bg-dark-400 h-8 flex items-center px-3 border-b border-white/10">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto flex items-center bg-dark-500 rounded-md px-2 py-1">
                    <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 16L7 11L8.4 9.55L12 13.15L15.6 9.55L17 11L12 16Z" fill="currentColor"></path>
                    </svg>
                    <span className="text-xs text-gray-400">app.newsletterhub.no/sok</span>
                  </div>
                </div>

                {/* App UI with sidebar and content */}
                <div className="bg-dark-300 flex">
                  {/* Sidebar - hidden on mobile */}
                  <div className="bg-[#0a1227] w-48 border-r border-white/10 py-4 hidden md:block">
                    <div className="px-4 mb-6">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="currentColor"></path>
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
                  <div className="flex-1 px-4 py-4">
                    {/* Top bar */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-white text-sm font-medium">Søk i Nyhetsbrev</h3>
                        <p className="text-gray-400 text-xs">Finn og analyser norske nyhetsbrev</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">Mine Favoritter</div>
                        <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">Merker</div>
                        <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">Hjelp</div>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary/90 h-9 px-3 bg-blue-500 text-white text-xs rounded-md">
                          Lagre Søk
                        </button>
                      </div>
                    </div>

                    {/* Search bar and filters */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center bg-dark-400 rounded-md px-3 py-1.5 w-64">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <span className="text-xs text-gray-400">Søk i nyhetsbrev...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-dark-400 rounded-md px-3 py-1.5">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                          </svg>
                          <span className="text-xs text-gray-400">Filtrer</span>
                        </div>
                        <div className="flex items-center bg-dark-400 rounded-md px-3 py-1.5">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                          </svg>
                          <span className="text-xs text-gray-400">Sorter</span>
                        </div>
                      </div>
                    </div>

                    {/* Newsletter grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* Newsletter 1 */}
                      <div className="bg-white rounded-md overflow-hidden">
                        <div className="relative">
                          <div className="w-full h-40 bg-blue-100 flex items-center justify-center">
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
                            <div className="text-xs font-medium">Elkjøp</div>
                            <div className="text-xs text-gray-500">1 dag siden</div>
                          </div>
                          <div className="bg-blue-100 rounded px-2 py-1 text-center">
                            <span className="text-xs font-bold text-blue-800">Forbrukerelektronikk</span>
                          </div>
                        </div>
                      </div>

                      {/* Newsletter 2 */}
                      <div className="bg-white rounded-md overflow-hidden">
                        <div className="relative">
                          <div className="w-full h-40 bg-green-100 flex items-center justify-center">
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
                            <div className="text-xs font-medium">H&M</div>
                            <div className="text-xs text-gray-500">2 dager siden</div>
                          </div>
                          <div className="bg-green-100 rounded px-2 py-1 text-center">
                            <span className="text-xs font-bold text-green-800">Mote</span>
                          </div>
                        </div>
                      </div>

                      {/* Newsletter 3 */}
                      <div className="bg-white rounded-md overflow-hidden">
                        <div className="relative">
                          <div className="w-full h-40 bg-orange-100 flex items-center justify-center">
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
                            <div className="text-xs font-medium">COOP</div>
                            <div className="text-xs text-gray-500">3 dager siden</div>
                          </div>
                          <div className="bg-orange-100 rounded px-2 py-1 text-center">
                            <span className="text-xs font-bold text-orange-800">Dagligvarer</span>
                          </div>
                        </div>
                      </div>

                      {/* Newsletter 4 */}
                      <div className="bg-white rounded-md overflow-hidden">
                        <div className="relative">
                          <div className="w-full h-40 bg-purple-100 flex items-center justify-center">
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
                            <div className="text-xs font-medium">DNB</div>
                            <div className="text-xs text-gray-500">4 dager siden</div>
                          </div>
                          <div className="bg-purple-100 rounded px-2 py-1 text-center">
                            <span className="text-xs font-bold text-purple-800">Finans</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UI Showcase */}
      <section className="relative py-16 lg:py-24 overflow-hidden mesh-gradient">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Finn inspirasjon og forstå markedet bedre
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Enkel tilgang til tusenvis av nyhetsbrev fra ledende norske merkevarer og byråer.
            </p>
          </div>
          
          <div className="relative">
            <div className="max-w-6xl mx-auto">
              <Card className="rounded-xl border-0 shadow-2xl overflow-hidden bg-dark-800 border-0">
                <CardContent className="p-0">
                  <div className="bg-black/20 backdrop-blur rounded-t-xl">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* App UI */}
                  <div className="bg-dark-900 p-4 md:p-8">
                    {/* App Header */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-white text-base md:text-lg font-medium">Søk i Nyhetsbrev</h3>
                          <p className="text-gray-400 text-sm">Finn og analyser norske nyhetsbrev</p>
                        </div>
                        <div className="hidden md:flex items-center gap-3">
                          <div className="bg-dark-400 rounded-md px-3 py-1.5 text-gray-300 text-sm">Mine Favoritter</div>
                          <div className="bg-dark-400 rounded-md px-3 py-1.5 text-gray-300 text-sm">Merker</div>
                          <div className="bg-dark-400 rounded-md px-3 py-1.5 text-gray-300 text-sm">Hjelp</div>
                        </div>
                      </div>
                      
                      {/* Search Bar */}
                      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                        <div className="flex items-center bg-dark-400 rounded-md px-4 py-2.5 w-full sm:w-96">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="text-gray-400 text-sm">Søk på merkevare eller bransje...</span>
                        </div>
                        
                        <div className="flex space-x-3">
                          <div className="bg-dark-400 rounded-md px-4 py-2.5 text-sm text-gray-300">
                            <div className="flex items-center">
                              <span>Filter</span>
                              <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          <div className="bg-blue-500 rounded-md px-4 py-2.5 text-sm text-white">
                            <span>Søk</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Newsletter Grid - Enhanced for desktop display */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Newsletter Card 1 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <div className="h-32 bg-gradient-to-br from-blue-400 to-indigo-600"></div>
                            <div className="absolute top-2 right-2 bg-white/80 px-2 py-0.5 rounded text-xs text-blue-600 font-medium">Retail</div>
                          </div>
                          <div className="p-3">
                            <h4 className="text-gray-900 font-medium text-sm truncate">IKEA Nyheter</h4>
                            <p className="text-gray-500 text-xs">20. mars 2023</p>
                          </div>
                        </div>

                        {/* Newsletter Card 2 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <div className="h-32 bg-gradient-to-br from-amber-400 to-red-500"></div>
                            <div className="absolute top-2 right-2 bg-white/80 px-2 py-0.5 rounded text-xs text-amber-600 font-medium">Mat</div>
                          </div>
                          <div className="p-3">
                            <h4 className="text-gray-900 font-medium text-sm truncate">Meny - Ukens Tilbud</h4>
                            <p className="text-gray-500 text-xs">18. mars 2023</p>
                          </div>
                        </div>

                        {/* Newsletter Card 3 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <div className="h-32 bg-gradient-to-br from-teal-400 to-green-500"></div>
                            <div className="absolute top-2 right-2 bg-white/80 px-2 py-0.5 rounded text-xs text-green-600 font-medium">Finans</div>
                          </div>
                          <div className="p-3">
                            <h4 className="text-gray-900 font-medium text-sm truncate">DNB Innsikt</h4>
                            <p className="text-gray-500 text-xs">15. mars 2023</p>
                          </div>
                        </div>

                        {/* Newsletter Card 4 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <div className="h-32 bg-gradient-to-br from-purple-400 to-pink-500"></div>
                            <div className="absolute top-2 right-2 bg-white/80 px-2 py-0.5 rounded text-xs text-purple-600 font-medium">Fashion</div>
                          </div>
                          <div className="p-3">
                            <h4 className="text-gray-900 font-medium text-sm truncate">H&M Trends</h4>
                            <p className="text-gray-500 text-xs">14. mars 2023</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Elements */}
              <div className="absolute -top-10 -right-16 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced spacing */}
      <section className="bg-black py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-white">
            Klar til å finne din inspirasjon?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto">
            Få tilgang til Norges største nyhetsbrevdatabase i dag. 
            Spar tid, finn inspirasjon og hold deg oppdatert.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-7 text-xl shadow-lg">
              Kom i gang - Gratis!
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Better spacing */}
      <footer className="bg-gray-900 py-10 md:py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>© 2023 NewsletterHub. Alle rettigheter reservert.</p>
            </div>
            <div className="flex space-x-8 md:space-x-12">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Vilkår</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Personvern</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
