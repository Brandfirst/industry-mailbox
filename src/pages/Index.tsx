
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Search, Shield, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  useEffect(() => {
    document.title = "NewsletterHub - Norges største nyhetsbrev arkiv";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main className="flex-1">
        {/* Announcement Banner */}
        <div className="bg-black border border-white/10 rounded-full py-2 px-6 mx-auto mt-8 max-w-max flex items-center gap-2">
          <span className="animate-pulse relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <p className="text-sm text-white font-medium">Nytt! Newsletter 2.0 er nå tilgjengelig!</p>
        </div>
        
        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden mesh-gradient">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <div className="animate-slide-down">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
                For byråer og markedsførere
                <span className="block text-blue-400 mt-2 relative">
                  Norges største database av nyhetsbrev
                  <div className="absolute -bottom-2 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Få tilgang til markedsføringsintelligens fra tusenvis av norske nyhetsbrev. Ideelt for markedsførere, byråer og bransjefolk.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
                <Link to="/search">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                    Start Søket
                    <Search className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button size="lg" variant="outline" className="border-blue-400/30 text-blue-400 hover:bg-blue-900/20">
                    Opprett Konto
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              {/* App Mockup */}
              <div className="relative mx-auto max-w-4xl">
                <div className="bg-dark-300 rounded-lg overflow-hidden shadow-2xl border border-white/10">
                  {/* Browser Header */}
                  <div className="bg-dark-400 h-8 flex items-center px-3 border-b border-white/10">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto flex items-center bg-dark-500 rounded-md px-2 py-1">
                      <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-xs text-gray-400">app.newsletterhub.no/sok</span>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="bg-dark-300 flex">
                    {/* Sidebar */}
                    <div className="bg-[#0a1227] w-48 border-r border-white/10 py-4 hidden md:block">
                      <div className="px-4 mb-6">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 16L7 11L8.4 9.55L12 13.15L15.6 9.55L17 11L12 16Z" fill="currentColor"/>
                          </svg>
                          <span className="text-white font-medium">NewsletterHub</span>
                        </div>
                      </div>
                      <div className="space-y-1 px-2">
                        <div className="bg-blue-500/20 text-blue-400 rounded-md py-1.5 px-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="currentColor"/>
                          </svg>
                          <span className="text-sm">Nyhetsbrev</span>
                        </div>
                        <div className="text-gray-400 rounded-md py-1.5 px-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" fill="currentColor"/>
                          </svg>
                          <span className="text-sm">Merker</span>
                        </div>
                        <div className="text-gray-400 rounded-md py-1.5 px-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                          </svg>
                          <span className="text-sm">Statistikk</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 px-4 py-4">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-white text-sm font-medium">Søk i Nyhetsbrev</h3>
                          <p className="text-gray-400 text-xs">Finn og analyser norske nyhetsbrev</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">Mine Favoritter</div>
                          <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">Merker</div>
                          <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">Hjelp</div>
                          <Button size="sm" className="bg-blue-500 text-white text-xs rounded-md">Lagre Søk</Button>
                        </div>
                      </div>
                      
                      {/* Search Bar */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center bg-dark-400 rounded-md px-3 py-1.5 w-64">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="text-xs text-gray-400">Søk i nyhetsbrev...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-dark-400 rounded-md px-3 py-1.5">
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="text-xs text-gray-400">Filtrer</span>
                          </div>
                          <div className="flex items-center bg-dark-400 rounded-md px-3 py-1.5">
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                            <span className="text-xs text-gray-400">Sorter</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Newsletter Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Newsletter Card 1 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <div className="w-full h-40 bg-blue-100 flex items-center justify-center">
                              <div className="text-center px-4">
                                <h3 className="text-blue-800 font-bold">Ukens Tilbud</h3>
                                <p className="text-blue-600 text-sm">Opptil 50% rabatt!</p>
                              </div>
                            </div>
                            <div className="absolute top-2 left-2 bg-white rounded-full p-1">
                              <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                                E
                              </div>
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
                        
                        {/* Newsletter Card 2 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <div className="w-full h-40 bg-green-100 flex items-center justify-center">
                              <div className="text-center px-4">
                                <h3 className="text-green-800 font-bold">Sommertilbud</h3>
                                <p className="text-green-600 text-sm">Nye kolleksjoner</p>
                              </div>
                            </div>
                            <div className="absolute top-2 left-2 bg-white rounded-full p-1">
                              <div className="bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                                H
                              </div>
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
                        
                        {/* Newsletter Card 3 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <div className="w-full h-40 bg-orange-100 flex items-center justify-center">
                              <div className="text-center px-4">
                                <h3 className="text-orange-800 font-bold">Helgetilbud</h3>
                                <p className="text-orange-600 text-sm">Gratis frakt!</p>
                              </div>
                            </div>
                            <div className="absolute top-2 left-2 bg-white rounded-full p-1">
                              <div className="bg-orange-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                                C
                              </div>
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
                        
                        {/* Newsletter Card 4 */}
                        <div className="bg-white rounded-md overflow-hidden">
                          <div className="relative">
                            <div className="w-full h-40 bg-purple-100 flex items-center justify-center">
                              <div className="text-center px-4">
                                <h3 className="text-purple-800 font-bold">Månedens Nytt</h3>
                                <p className="text-purple-600 text-sm">Tips og trender</p>
                              </div>
                            </div>
                            <div className="absolute top-2 left-2 bg-white rounded-full p-1">
                              <div className="bg-purple-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                                D
                              </div>
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

        {/* Brands Section - Updated with logos similar to reference */}
        <section className="py-16 px-4 bg-black">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center text-white text-xl mb-12">Brukt av over 5 000+ merker og byråer</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
              {/* Row 1 */}
              <div className="flex items-center justify-center">
                <svg className="h-6 text-white" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4H20V8H10V11H18V15H10V20H5V4Z" fill="currentColor"/>
                  <path d="M26 4V12H26.2L32 4H38L30.5 12.5L38.5 22H32.5L27 14.8H26V22H21V4H26Z" fill="currentColor"/>
                  <path d="M49 4L55 22H50L49 18H43L42 22H37L43 4H49Z" fill="currentColor"/>
                  <path d="M57 4H64C67.3 4 70 6.7 70 10C70 13.3 67.3 16 64 16H62V22H57V4ZM62 12H63.5C64.4 12 65 11.1 65 10C65 8.9 64.4 8 63.5 8H62V12Z" fill="currentColor"/>
                  <path d="M72 4H77V22H72V4Z" fill="currentColor"/>
                  <path d="M86 4H91V18H99V22H86V4Z" fill="currentColor"/>
                  <path d="M105 4H110V18H118V22H105V4Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-8 text-white" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7.5L18.5 9H16.5L15 7.5L13.5 9H11.5L10 7.5L8.5 9H6.5L5 7.5V16.5L6.5 15H8.5L10 16.5L11.5 15H13.5L15 16.5L16.5 15H18.5L20 16.5V7.5Z" fill="currentColor"/>
                  <path d="M28 8.5C28 7.7 28.7 7 29.5 7H32.5C33.3 7 34 7.7 34 8.5V15.5C34 16.3 33.3 17 32.5 17H29.5C28.7 17 28 16.3 28 15.5V8.5Z" fill="currentColor"/>
                  <path d="M39 7H46V9H42V11H45V13H42V15H46V17H39V7Z" fill="currentColor"/>
                  <path d="M52 7L48 17H50L50.5 15.5H53.5L54 17H56L52 7ZM51 13.5L52 10.5L53 13.5H51Z" fill="currentColor"/>
                  <path d="M65 7H67V17H65V13H62V17H60V7H62V11H65V7Z" fill="currentColor"/>
                  <path d="M71 7H73V17H71V7Z" fill="currentColor"/>
                  <path d="M76 7H80C82.2 7 84 8.8 84 11C84 13.2 82.2 15 80 15H78V17H76V7ZM78 13H80C81.1 13 82 12.1 82 11C82 9.9 81.1 9 80 9H78V13Z" fill="currentColor"/>
                  <path d="M88 7H90V15H94V17H88V7Z" fill="currentColor"/>
                  <path d="M97 7H99V17H97V7Z" fill="currentColor"/>
                  <path d="M103 7H111V9H105V11H110V13H105V17H103V7Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-7 text-white" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4H15V20H10V4Z" fill="currentColor"/>
                  <path d="M20 4H25L32 14V4H37V20H32L25 10V20H20V4Z" fill="currentColor"/>
                  <path d="M43 4H48V15H55V20H43V4Z" fill="currentColor"/>
                  <path d="M60 4H75V9H70V20H65V9H60V4Z" fill="currentColor"/>
                  <path d="M80 4H85V20H80V4Z" fill="currentColor"/>
                  <path d="M90 4H100C103 4 105 6 105 9C105 11 104 12.5 102 13L106 20H100L97 14H95V20H90V4ZM95 10H99C99.6 10 100 9.6 100 9C100 8.4 99.6 8 99 8H95V10Z" fill="currentColor"/>
                  <path d="M110 4H125V9H115V10H123V14H115V15H125V20H110V4Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-7 text-white" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 8C9 5.8 10.8 4 13 4H20V8H14V20H10V8H9Z" fill="currentColor"/>
                  <path d="M22 4H26V15C26 16.7 27.3 18 29 18C30.7 18 32 16.7 32 15V4H36V15C36 18.9 32.9 22 29 22C25.1 22 22 18.9 22 15V4Z" fill="currentColor"/>
                  <path d="M39 4H43V10H48V4H52V20H48V14H43V20H39V4Z" fill="currentColor"/>
                  <path d="M55 4H69V8H64V20H60V8H55V4Z" fill="currentColor"/>
                  <path d="M71 4H75V20H71V4Z" fill="currentColor"/>
                  <path d="M78 4H82V16H89V20H78V4Z" fill="currentColor"/>
                  <path d="M91 4H95V20H91V4Z" fill="currentColor"/>
                  <path d="M98 4H112V8H102V10H110V14H102V16H112V20H98V4Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-8 text-white" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6C10 4.9 10.9 4 12 4H21C22.1 4 23 4.9 23 6V18C23 19.1 22.1 20 21 20H12C10.9 20 10 19.1 10 18V6ZM14 8V16H19V8H14Z" fill="currentColor"/>
                  <path d="M28 4H42C44.2 4 46 5.8 46 8V16C46 18.2 44.2 20 42 20H28V4ZM32 8V16H41C41.6 16 42 15.6 42 15V9C42 8.4 41.6 8 41 8H32Z" fill="currentColor"/>
                  <path d="M53 4C51.9 4 51 4.9 51 6V10C51 11.1 51.9 12 53 12H58V15C58 15.6 57.6 16 57 16H51V20H57C59.2 20 62 18.2 62 16V10C62 8.9 61.1 8 60 8H55V7C55 6.4 55.4 6 56 6H62V4H53Z" fill="currentColor"/>
                  <path d="M67 4H71V16H78V20H67V4Z" fill="currentColor"/>
                  <path d="M83 4H87V16H94V20H83V4Z" fill="currentColor"/>
                  <path d="M99 4H103V20H99V4Z" fill="currentColor"/>
                  <path d="M108 4H112V16H119V20H108V4Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-7 text-white" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4H24V8H18V20H14V8H10V4Z" fill="currentColor"/>
                  <path d="M26 4H41V8H30V10H39V14H30V16H41V20H26V4Z" fill="currentColor"/>
                  <path d="M43 4H57V8H47V10H56V14H47V16H57V20H43V4Z" fill="currentColor"/>
                  <path d="M59 4H73V8H63V10H72V14H63V16H73V20H59V4Z" fill="currentColor"/>
                  <path d="M75 4H80L87 14V4H91V20H86L79 10V20H75V4Z" fill="currentColor"/>
                  <path d="M95 4H103C107 4 110 7 110 12C110 17 107 20 103 20H95V4ZM99 8V16H102C104 16 106 15 106 12C106 9 104 8 102 8H99Z" fill="currentColor"/>
                  <path d="M112 4H126V8H116V10H125V14H116V16H126V20H112V4Z" fill="currentColor"/>
                </svg>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-center">
                <svg className="h-6 text-white" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7H15V9H10V11H14V13H10V15H15V17H5V7Z" fill="currentColor"/>
                  <path d="M17 7H22V15H28V17H17V7Z" fill="currentColor"/>
                  <path d="M30 7H35V17H30V7Z" fill="currentColor"/>
                  <path d="M37 7H47V9H42V17H37V7Z" fill="currentColor"/>
                  <path d="M49 7H59V9H54V17H49V7Z" fill="currentColor"/>
                  <path d="M61 7H71V9H66V11H70V13H66V15H71V17H61V7Z" fill="currentColor"/>
                  <path d="M73 7H78V17H73V7Z" fill="currentColor"/>
                  <path d="M80 7H90V9H85V11H89V13H85V15H90V17H80V7Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-8 text-white" viewBox="0 0 140 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 22C5.8 22 4 20.2 4 18V12C4 9.8 5.8 8 8 8H16C18.2 8 20 9.8 20 12V18C20 20.2 18.2 22 16 22H8ZM8 11C7.4 11 7 11.4 7 12V18C7 18.6 7.4 19 8 19H16C16.6 19 17 18.6 17 18V12C17 11.4 16.6 11 16 11H8Z" fill="currentColor"/>
                  <path d="M24 22V8H27V16L35 8H38V22H35V14L27 22H24Z" fill="currentColor"/>
                  <path d="M42 22V8H50C52.2 8 54 9.8 54 12V18C54 20.2 52.2 22 50 22H42ZM45 19H50C50.6 19 51 18.6 51 18V12C51 11.4 50.6 11 50 11H45V19Z" fill="currentColor"/>
                  <path d="M56 22V8H64C66.2 8 68 9.8 68 12C68 13.4 67.2 14.6 66 15.2C67.2 15.8 68 17 68 18.4C68 20.5 66.2 22 64 22H56ZM59 13H64C64.6 13 65 12.6 65 12C65 11.4 64.6 11 64 11H59V13ZM59 19H64C64.6 19 65 18.6 65 18C65 17.4 64.6 17 64 17H59V19Z" fill="currentColor"/>
                  <path d="M70 22V8H78C80.2 8 82 9.8 82 12V14C82 16.2 80.2 18 78 18H73V22H70ZM73 15H78C78.6 15 79 14.6 79 14V12C79 11.4 78.6 11 78 11H73V15Z" fill="currentColor"/>
                  <path d="M84 22V8H87V22H84Z" fill="currentColor"/>
                  <path d="M90 22V8H93V19H100V22H90Z" fill="currentColor"/>
                  <path d="M104 22V8H107V19H114V22H104Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-8 text-white" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 12C20 7.6 16.4 4 12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12ZM16 12C16 14.2 14.2 16 12 16C9.8 16 8 14.2 8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12Z" fill="currentColor"/>
                  <path d="M30 4H26V20H30V4Z" fill="currentColor"/>
                  <path d="M44 4H40V12L34 4H30V20H34V12L40 20H44V4Z" fill="currentColor"/>
                  <path d="M58 4H54V9H49V4H45V20H49V13H54V20H58V4Z" fill="currentColor"/>
                  <path d="M72 12C72 7.6 68.4 4 64 4C59.6 4 56 7.6 56 12C56 16.4 59.6 20 64 20C68.4 20 72 16.4 72 12ZM68 12C68 14.2 66.2 16 64 16C61.8 16 60 14.2 60 12C60 9.8 61.8 8 64 8C66.2 8 68 9.8 68 12Z" fill="currentColor"/>
                  <path d="M86 4H82V12L76 4H72V20H76V12L82 20H86V4Z" fill="currentColor"/>
                  <path d="M94 4H90V20H94V4Z" fill="currentColor"/>
                  <path d="M108 4H104V9H99V4H95V20H99V13H104V20H108V4Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-8 text-white" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12C10 7.6 13.6 4 18 4H22V8H18C15.8 8 14 9.8 14 12C14 14.2 15.8 16 18 16H22V20H18C13.6 20 10 16.4 10 12Z" fill="currentColor"/>
                  <path d="M24 4H28V10H34V4H38V20H34V14H28V20H24V4Z" fill="currentColor"/>
                  <path d="M41 4H55V8H45V10H53V14H45V16H55V20H41V4Z" fill="currentColor"/>
                  <path d="M58 4H67C69.8 4 72 6.2 72 9V15C72 17.8 69.8 20 67 20H58V4ZM62 8V16H66C67.1 16 68 15.1 68 14V10C68 8.9 67.1 8 66 8H62Z" fill="currentColor"/>
                  <path d="M75 4H83C87.4 4 91 7.6 91 12C91 16.4 87.4 20 83 20H75V4ZM79 8V16H83C85.2 16 87 14.2 87 12C87 9.8 85.2 8 83 8H79Z" fill="currentColor"/>
                  <path d="M94 4H102C106.4 4 110 7.6 110 12C110 16.4 106.4 20 102 20H94V4ZM98 8V16H102C104.2 16 106 14.2 106 12C106 9.8 104.2 8 102 8H98Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-7 text-white" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12C10 7.6 13.6 4 18 4C22.4 4 26 7.6 26 12C26 16.4 22.4 20 18 20C13.6 20 10 16.4 10 12ZM14 12C14 14.2 15.8 16 18 16C20.2 16 22 14.2 22 12C22 9.8 20.2 8 18 8C15.8 8 14 9.8 14 12Z" fill="currentColor"/>
                  <path d="M30 4H34V16H42V20H30V4Z" fill="currentColor"/>
                  <path d="M45 4H60V8H45V4Z" fill="currentColor"/>
                  <path d="M46 12H58V16H46V12Z" fill="currentColor"/>
                  <path d="M45 20H60V16H45V20Z" fill="currentColor"/>
                  <path d="M65 4H69V16H77V20H65V4Z" fill="currentColor"/>
                  <path d="M80 4H95V8H89V20H85V8H80V4Z" fill="currentColor"/>
                  <path d="M98 4H110V8H102V10H109V14H102V16H110V20H98V4Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg className="h-8 text-white" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 8C5 5.8 6.8 4 9 4H12V8H10C9.4 8 9 8.4 9 9V20H5V8Z" fill="currentColor"/>
                  <path d="M14 4H18V12H24V4H28V20H24V16H18V20H14V4Z" fill="currentColor"/>
                  <path d="M31 4H41C43.2 4 45 5.8 45 8V16C45 18.2 43.2 20 41 20H31V4ZM35 8V16H40C40.6 16 41 15.6 41 15V9C41 8.4 40.6 8 40 8H35Z" fill="currentColor"/>
                  <path d="M48 4H58C60.2 4 62 5.8 62 8V16C62 18.2 60.2 20 58 20H48V4ZM52 8V16H57C57.6 16 58 15.6 58 15V9C58 8.4 57.6 8 57 8H52Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-dark-200">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              <span className="bg-blue-500/10 px-3 py-1 rounded-md text-blue-400 inline-block mb-2 text-sm">Fordeler</span>
              Markedsføringsintelligens som gir resultater
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Search Feature */}
              <div className="feature-card bg-dark-300 rounded-xl p-6 shadow-card border border-white/5">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">Finn inspirasjon</h3>
                <p className="text-gray-400">
                  Få kreative ideer ved å se gjennom andre kampanjer. Perfekter ditt neste nyhetsbrev.
                </p>
              </div>
              
              {/* Collections Feature */}
              <div className="feature-card bg-dark-300 rounded-xl p-6 shadow-card border border-white/5">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">Spor konkurrenter</h3>
                <p className="text-gray-400">
                  Hold øye med konkurrentene og vær alltid ett skritt foran i markedet.
                  <span className="block mt-2 text-xs text-blue-400">Premium Funksjon</span>
                </p>
              </div>
              
              {/* Admin Feature */}
              <div className="feature-card bg-dark-300 rounded-xl p-6 shadow-card border border-white/5">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">Avdekk muligheter</h3>
                <p className="text-gray-400">
                  Skap kampanjer som skiller seg ut i mengden av markedskommunikasjon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features */}
        <section className="py-20 px-4 bg-black relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-40 left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              <span className="bg-blue-500/10 px-3 py-1 rounded-md text-blue-400 inline-block mb-2 text-sm">Premium</span>
              Oppgrader med NewsVault Pro
            </h2>
            <p className="text-center text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Alt du trenger for å forbedre din e-postmarkedsføring
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="feature-card bg-dark-300 rounded-xl p-6 shadow-card border border-white/5">
                <h3 className="text-xl font-medium mb-3 text-white">Komplett Arkiv</h3>
                <p className="text-gray-400">
                  Søk gjennom år med nyhetsbrev fra norske bedrifter
                </p>
              </div>
              
              <div className="feature-card bg-dark-300 rounded-xl p-6 shadow-card border border-white/5">
                <h3 className="text-xl font-medium mb-3 text-white">Avanserte Filtre</h3>
                <p className="text-gray-400">
                  Filtrer etter sesong, markedsmål og mer
                </p>
              </div>
              
              <div className="feature-card bg-dark-300 rounded-xl p-6 shadow-card border border-white/5">
                <h3 className="text-xl font-medium mb-3 text-white">Organiser Mapper</h3>
                <p className="text-gray-400">
                  Lagre nyhetsbrev for fremtidig referanse, med private notater
                </p>
              </div>
              
              <div className="feature-card bg-dark-300 rounded-xl p-6 shadow-card border border-white/5">
                <h3 className="text-xl font-medium mb-3 text-white">Eksporter Data</h3>
                <p className="text-gray-400">
                  Last ned i CSV eller PDF format for enkel rapportering
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8">
                  Prøv Premium Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 bg-black">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Mail className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-white">NewsletterHub</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Vilkår</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Personvern</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Kontakt</a>
              <a href="/admin" className="hover:text-gray-300 transition-colors">Admin</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} NewsletterHub. Alle rettigheter reservert.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
