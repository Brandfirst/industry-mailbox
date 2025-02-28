
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Database, Users, BarChart, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    document.title = "NewsletterHub - Norges største nyhetsbrev arkiv";
  }, []);

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
    },
    {
      text: "Den beste ressursen for å holde seg oppdatert på markedsføringstrender i Norge.",
      author: "Anders Nilsen",
      company: "BrandCore Norge",
      initial: "A",
    },
    {
      text: "Helt uunnværlig for strategiarbeidet vårt. Vi sparer så mye tid på research!",
      author: "Sofie Berg",
      company: "Mediekonsulenterne",
      initial: "S",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-900 to-black py-12 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background pattern/grid */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-20 -left-20 right-0 bottom-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEiPjxwYXRoIGQ9Ik0tMTAgMzBoOTBNLTEwIC0zMGg5ME0zMCAtMTB2OTBNLTMwIC0xMHY5MCIvPjwvZz48L3N2Zz4=')] bg-center opacity-10"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <div className="animate-slide-down">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
                For <span className="smaller-text">byråer</span> og markedsførere
                <span className="block text-blue-400 mt-2 relative">
                  Norges største database av nyhetsbrev
                  <div className="absolute -bottom-2 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animated-border"></div>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
                Få inspirasjonen og innsikten du trenger for bedre markedsføring.
              </p>
              
              {/* Stats section */}
              <div className="mb-8">
                <div className="stats-grid">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div 
                        key={index} 
                        className={`stat-card shine-effect animate-count-up animate-delay-${index * 100}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="stat-value">{stat.value}</div>
                          <Icon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="stat-label">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Testimonials */}
              <div className="mb-8">
                <div className="testimonials-grid">
                  {testimonials.map((testimonial, index) => (
                    <div 
                      key={index}
                      className="testimonial-card shine-effect"
                    >
                      <div className="testimonial-text">
                        {testimonial.text}
                      </div>
                      <div className="testimonial-author">
                        <div className="testimonial-avatar">
                          {testimonial.initial}
                        </div>
                        <div className="testimonial-info">
                          <div className="testimonial-name">{testimonial.author}</div>
                          <div className="testimonial-company">{testimonial.company}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
                <Link to="/search">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto">
                    Start Søket
                    <Search className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button size="lg" variant="outline" className="border-blue-400/30 text-blue-400 hover:bg-blue-900/20 w-full sm:w-auto">
                    Opprett Konto
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UI Showcase */}
      <section className="relative py-12 lg:py-20 overflow-hidden mesh-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Finn inspirasjon og forstå markedet bedre
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Enkel tilgang til tusenvis av nyhetsbrev fra ledende norske merkevarer og byråer.
            </p>
          </div>
          
          <div className="relative">
            <div className="max-w-5xl mx-auto">
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
                  <div className="bg-dark-900 p-4 md:p-6">
                    {/* App Header */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-white text-sm font-medium">Søk i Nyhetsbrev</h3>
                          <p className="text-gray-400 text-xs">Finn og analyser norske nyhetsbrev</p>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                          <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">Mine Favoritter</div>
                          <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">Merker</div>
                          <div className="bg-dark-400 rounded-md px-3 py-1 text-gray-300 text-xs">Hjelp</div>
                        </div>
                      </div>
                      
                      {/* Search Bar */}
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center bg-dark-400 rounded-md px-3 py-1.5 w-full sm:w-64">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="text-gray-400 text-sm">Søk på merkevare eller bransje...</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <div className="bg-dark-400 rounded-md px-3 py-1.5 text-sm text-gray-300">
                            <div className="flex items-center">
                              <span>Filter</span>
                              <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          <div className="bg-blue-500 rounded-md px-3 py-1.5 text-sm text-white">
                            <span>Søk</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Newsletter Grid - Fixed gradient issue for mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* CTA Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Klar til å finne din inspirasjon?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Få tilgang til Norges største nyhetsbrevdatabase i dag. 
            Spar tid, finn inspirasjon og hold deg oppdatert.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg">
              Kom i gang - Gratis!
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2023 NewsletterHub. Alle rettigheter reservert.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
