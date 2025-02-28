
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

        {/* Brands Section */}
        <section className="py-16 px-4 bg-black">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="text-gray-500 mb-10">Brukt av over 5 000 markedsførere i Norge</p>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
              {/* Brand logos - grayscale with hover effect */}
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M10.2 5.6H13.5V18.4H10.2V5.6ZM18.9 5.6H15.6V18.4H18.9V5.6ZM14.7 2.3H17.1V4.7H14.7V2.3Z" fill="currentColor"/>
                  <path d="M27.1991 13.1998L25.1991 9.1998H25.0991L23.1991 13.1998H27.1991ZM25.7991 5.5998L31.7991 18.3998H28.2991L27.0991 15.7998H23.2991L22.0991 18.3998H18.5991L24.5991 5.5998H25.7991Z" fill="currentColor"/>
                  <path d="M32.1 18.4V5.6H37.1C38.9667 5.6 40.4 6.03333 41.4 6.9C42.4 7.76667 42.9 9 42.9 10.6C42.9 12.2 42.4 13.4333 41.4 14.3C40.4 15.1667 38.9667 15.6 37.1 15.6H35.4V18.4H32.1ZM35.4 12.6H36.3C37.0333 12.6 37.5667 12.4667 37.9 12.2C38.2333 11.9333 38.4 11.5 38.4 10.9C38.4 10.3 38.2333 9.86667 37.9 9.6C37.5667 9.33333 37.0333 9.2 36.3 9.2H35.4V12.6Z" fill="currentColor"/>
                  <path d="M43.4 12C43.4 9.66667 44.0333 7.9 45.3 6.7C46.5667 5.5 48.3333 4.9 50.6 4.9C52.8667 4.9 54.6333 5.5 55.9 6.7C57.1667 7.9 57.8 9.66667 57.8 12C57.8 14.3333 57.1667 16.1 55.9 17.3C54.6333 18.5 52.8667 19.1 50.6 19.1C48.3333 19.1 46.5667 18.5 45.3 17.3C44.0333 16.1 43.4 14.3333 43.4 12ZM47 12C47 13.2 47.2667 14.1333 47.8 14.8C48.3333 15.4667 49.3 15.8 50.7 15.8C52.0333 15.8 52.9667 15.4667 53.5 14.8C54.0333 14.1333 54.3 13.2 54.3 12C54.3 10.8 54.0333 9.86667 53.5 9.2C52.9667 8.53333 52.0333 8.2 50.7 8.2C49.3 8.2 48.3333 8.53333 47.8 9.2C47.2667 9.86667 47 10.8 47 12Z" fill="currentColor"/>
                  <path d="M59.1 18.4V5.6H62.4V15.6H66.3V18.4H59.1Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="66" height="24" viewBox="0 0 66 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M5.4 5H13.2V8.2H8.9V10.5H12.9V13.5H8.9V16H13.4V19H5.4V5Z" fill="currentColor"/>
                  <path d="M23 5L27.5 19H23.7L23.1 16.7H19.4L18.8 19H15L19.5 5H23ZM22.4 13.8L21.3 9.4H21.2L20.1 13.8H22.4Z" fill="currentColor"/>
                  <path d="M32.8 8.1V19H29.4V8.1H26.3V5H35.9V8.1H32.8Z" fill="currentColor"/>
                  <path d="M45.1 19V5H48.5V19H45.1Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M10.5 4H4V20H10.5C13.5 20 16 17.5 16 12C16 6.5 13.5 4 10.5 4ZM10.3 16.8H7.2V7.2H10.3C11.9 7.2 12.8 8.9 12.8 12C12.8 15.1 11.9 16.8 10.3 16.8Z" fill="currentColor"/>
                  <path d="M25.8 20.2C22.4 20.2 19.8 17.7 19.8 14.3C19.8 10.9 22.3 8.4 25.7 8.4C29.1 8.4 31.7 10.9 31.7 14.3C31.7 17.7 29.2 20.2 25.8 20.2ZM25.8 11.2C24.1 11.2 22.9 12.6 22.9 14.3C22.9 16 24.1 17.4 25.8 17.4C27.5 17.4 28.7 16.1 28.7 14.3C28.7 12.5 27.5 11.2 25.8 11.2Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M16.6 4H12V20H16.6V4Z" fill="currentColor"/>
                  <path d="M31.2 8.6L27.6 16.6L24 8.6H20.2V20H23.6V12L27.2 20H28L31.6 12V20H35V8.6H31.2Z" fill="currentColor"/>
                  <path d="M44.2 8.6V11.2H41V20H37.6V11.2H34.4V8.6H44.2Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="140" height="24" viewBox="0 0 140 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M13.8 4H9.2L4 20H8.6L9.6 16.8H13.4L14.4 20H19L13.8 4ZM10.4 13.6L11.6 9.4L12.8 13.6H10.4Z" fill="currentColor"/>
                  <path d="M28.5 16.6L24.9 8.6H21.1V20H24.5V12L28.1 20H28.9L32.5 12V20H35.9V8.6H32.1L28.5 16.6Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="grayscale opacity-60 hover:opacity-100 transition-opacity">
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M20.8 10H20.2C19.6 8.7 18.5 8 17 8C14.5 8 12.8 9.9 12.8 12.7C12.8 15.5 14.5 17.4 17 17.4C18.5 17.4 19.6 16.7 20.2 15.4H20.8V16.1C20.8 18.1 19.5 19.4 17.3 19.4C16 19.4 14.9 19 14.3 18.1L12.3 19.6C13.3 21 14.9 21.7 17.3 21.7C20.7 21.7 23 19.6 23 16.1V8.2H20.8V10ZM17.3 15.1C15.9 15.1 15 14.1 15 12.7C15 11.3 15.9 10.3 17.3 10.3C18.7 10.3 19.6 11.3 19.6 12.7C19.6 14.1 18.7 15.1 17.3 15.1Z" fill="currentColor"/>
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
