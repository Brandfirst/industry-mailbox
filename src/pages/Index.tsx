
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Database, Users, BarChart, Calendar, Mail, Star, Award, ChevronDown, ChevronUp, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import Embla from 'embla-carousel-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const isMobile = useIsMobile();
  const [testimonialViewportRef, emblaApi] = Embla({ 
    loop: true, 
    align: "center",
    skipSnaps: false
  });
  const [isNewFeaturesOpen, setIsNewFeaturesOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [email, setEmail] = useState("");
  
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
    {
      text: "Fantastisk verktøy for å analysere nyhetsbrev fra hele markedet samlet på ett sted.",
      author: "Kristian Hansen",
      company: "MarkedsInsikt AS",
      initial: "K",
      rating: 5,
    },
    {
      text: "Har økt konverteringsraten på nyhetsbrevene våre med 35% takket være inspirasjonen fra andre bransjer.",
      author: "Nina Larsen",
      company: "E-handel Norge",
      initial: "N",
      rating: 5,
    },
  ];

  // Features for the new version
  const newFeatures = [
    "Raskere søk",
    "API-tilgang",
    "Nytt design",
    "Mobile app beta"
  ];

  // Pricing tiers
  const pricingTiers = [
    {
      name: "Basis",
      price: "499 kr",
      period: "per måned",
      description: "Perfekt for enkeltpersoner og små team",
      features: [
        "500 nyhetsbrev per måned",
        "Grunnleggende analyse",
        "5 lagrede søk",
        "E-post support"
      ],
      cta: "Prøv gratis"
    },
    {
      name: "Pro",
      price: "999 kr",
      period: "per måned",
      description: "For profesjonelle markedsførere",
      features: [
        "Ubegrenset nyhetsbrev",
        "Avansert analyse og innsikt",
        "Ubegrensede lagrede søk",
        "Prioritert support",
        "API-tilgang"
      ],
      cta: "Få tilgang nå",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Kontakt oss",
      period: "skreddersydd",
      description: "For større byråer med spesielle behov",
      features: [
        "Alt i Pro-pakken",
        "Dedikert supportkontakt",
        "Skreddersydde rapporter",
        "Teamopplæring",
        "White-label muligheter"
      ],
      cta: "Kontakt salg"
    }
  ];

  // Feature list for detailed section
  const featuresList = [
    {
      title: "Omfattende Database",
      description: "Få tilgang til over 5000 nyhetsbrev fra ledende norske merkevarer.",
      icon: Database
    },
    {
      title: "Konkurranseanalyse",
      description: "Analyser hva konkurrentene dine sender til sine abonnenter.",
      icon: BarChart
    },
    {
      title: "Inspirasjonsbibliotek",
      description: "Finn inspirasjon til dine egne nyhetsbrev fra de beste i bransjen.",
      icon: Star
    },
    {
      title: "Trendrapporter",
      description: "Ukentlige rapporter om trender i nyhetsbrev på tvers av bransjer.",
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar with updated styling to match image */}
      <header className="border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mail className="text-blue-400 h-6 w-6" />
            <span className="text-white font-bold text-xl">NewsletterHub</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white hover:text-blue-400 transition-colors">Hjem</Link>
            <Link to="/search" className="text-white hover:text-blue-400 transition-colors">Søk</Link>
            <Link to="/auth?mode=login" className="text-white hover:text-blue-400 transition-colors">Logg inn</Link>
            <Link to="/auth?mode=signup">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4">Registrer</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* New version announcement */}
      <div className="py-3 bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-blue-900/40 border-y border-blue-500/20">
        <div className="container mx-auto flex justify-center items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-blue-300">Nytt! Newsletter 2.0 er nå tilgjengelig!</span>
        </div>
      </div>

      {/* Hero Section with clean design matching the image */}
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
            
            {/* App screenshot that closely matches the provided image */}
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-800">
              <div className="bg-gray-900 h-8 flex items-center px-3 border-b border-gray-800">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto flex items-center bg-gray-800 rounded-md px-2 py-1">
                  <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 16L7 11L8.4 9.55L12 13.15L15.6 9.55L17 11L12 16Z" fill="currentColor"></path>
                  </svg>
                  <span className="text-xs text-gray-400">app.newsletterhub.no/sok</span>
                </div>
              </div>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-black to-blue-950/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Komplett oversikt over norske nyhetsbrev</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              NewsletterHub samler nyhetsbrev fra de største norske merkevarene på ett sted, 
              slik at du enkelt kan finne inspirasjon og analysere trender.
            </p>
          </div>
          
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-card animate-count-up animate-delay-${index * 100}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="stat-value">{stat.value}</span>
                  <stat.icon className="h-6 w-6 text-blue-400" />
                </div>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-blue-950/30 to-black">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Alt du trenger for å skape bedre nyhetsbrev</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              NewsletterHub gir deg verktøyene du trenger for å analysere, sammenligne og få inspirasjon til dine egne nyhetsbrev.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresList.map((feature, index) => (
              <div key={index} className="feature-card bg-blue-950/20 p-6 rounded-xl border border-blue-500/10 hover:border-blue-500/30">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/search">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">Utforsk alle funksjoner</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-black to-blue-950/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-blue-400 border-blue-500/30 bg-blue-500/5 px-3 py-1">
              <Award className="w-4 h-4 mr-1" /> Brukervurderinger
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hva våre kunder sier</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Hør fra markedsførere og byråer som bruker NewsletterHub hver dag for å forbedre sine nyhetsbrev.
            </p>
          </div>
          
          <div className="carousel-container">
            <div className="embla" ref={testimonialViewportRef}>
              <div className="embla__container">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="embla__slide px-2 md:px-4">
                    <div className="testimonial-card shine-effect">
                      <div className="mb-4 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-500'}`} fill={i < testimonial.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <p className="testimonial-text mb-4">{testimonial.text}</p>
                      <div className="testimonial-author">
                        <div className="testimonial-avatar bg-blue-500/10">
                          {testimonial.initial}
                        </div>
                        <div className="testimonial-info">
                          <div className="testimonial-name">{testimonial.author}</div>
                          <div className="testimonial-company">{testimonial.company}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pagination dots */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-blue-500' : 'bg-gray-600'}`}
                  onClick={() => emblaApi?.scrollTo(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-blue-950/20 to-black">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-blue-400 border-blue-500/30 bg-blue-500/5 px-3 py-1">
              Prisplaner
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Finn den riktige planen for deg</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Vi tilbyr fleksible prisplaner for å passe ethvert behov, fra enkeltpersoner til store byråer.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`relative rounded-xl p-6 transition-all ${tier.popular ? 'bg-gradient-to-b from-blue-800/30 to-blue-950/30 border border-blue-500/30 shadow-xl' : 'bg-blue-950/10 border border-gray-800'}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-blue-500 text-xs font-bold rounded-full text-white">
                    Mest Populær
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-gray-400 mb-1">{tier.period}</span>
                </div>
                <p className="text-gray-300 mb-6">{tier.description}</p>
                <div className="mb-8">
                  <div className="text-sm font-medium mb-4">Inkluderer:</div>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="text-green-400 w-5 h-5 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className={`w-full ${tier.popular ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'border border-blue-500/30 text-blue-400 hover:bg-blue-500/10'}`}>
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 text-gray-400 max-w-2xl mx-auto">
            <p>Alle planer inkluderer 14 dagers gratis prøveperiode. Ingen kredittkortinformasjon nødvendig. Du kan avbryte når som helst.</p>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="py-20 bg-gradient-to-b from-black to-blue-950/20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-2xl border border-blue-500/20 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Få eksklusive markedsføringstips</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Registrer deg for vårt ukentlige nyhetsbrev og få eksklusive innsikter og tips om nyhetsbrev-markedsføring.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Din e-postadresse" 
                className="bg-blue-950/40 border-blue-500/30 text-white" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Abonner
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-gray-400 mt-4">
              Ved å registrere deg godtar du våre vilkår og personvernerklæring. Du kan når som helst melde deg av.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-blue-950/20 to-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ofte stilte spørsmål</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Få svar på de vanligste spørsmålene om NewsletterHub.
            </p>
          </div>
          
          <div className="space-y-4">
            <Collapsible className="bg-blue-950/10 rounded-lg border border-blue-500/10">
              <CollapsibleTrigger className="w-full px-6 py-4 flex justify-between items-center">
                <span className="text-lg font-medium">Hva er NewsletterHub?</span>
                <ChevronDown className="h-5 w-5 text-blue-400 transition-transform ui-open:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-4 text-gray-300">
                <p>NewsletterHub er Norges største database av nyhetsbrev. Vi samler inn, analyserer og kategoriserer nyhetsbrev fra tusenvis av norske merkevarer, slik at markedsførere og byråer kan finne inspirasjon, analysere trender og forbedre sine egne nyhetsbrev.</p>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible className="bg-blue-950/10 rounded-lg border border-blue-500/10">
              <CollapsibleTrigger className="w-full px-6 py-4 flex justify-between items-center">
                <span className="text-lg font-medium">Hvordan fungerer tjenesten?</span>
                <ChevronDown className="h-5 w-5 text-blue-400 transition-transform ui-open:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-4 text-gray-300">
                <p>Etter registrering får du umiddelbart tilgang til vår omfattende database. Du kan søke basert på bransje, merkevare, emne og mer. Se nyhetsbrev i full størrelse, analyser elementene og få inspirasjon til dine egne kampanjer.</p>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible className="bg-blue-950/10 rounded-lg border border-blue-500/10">
              <CollapsibleTrigger className="w-full px-6 py-4 flex justify-between items-center">
                <span className="text-lg font-medium">Hvor ofte oppdateres databasen?</span>
                <ChevronDown className="h-5 w-5 text-blue-400 transition-transform ui-open:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-4 text-gray-300">
                <p>Vår database oppdateres daglig med de nyeste nyhetsbrevene fra alle registrerte merkevarer. Det betyr at du alltid har tilgang til de siste trendene og kampanjene i markedet.</p>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible className="bg-blue-950/10 rounded-lg border border-blue-500/10">
              <CollapsibleTrigger className="w-full px-6 py-4 flex justify-between items-center">
                <span className="text-lg font-medium">Kan jeg prøve tjenesten før jeg kjøper?</span>
                <ChevronDown className="h-5 w-5 text-blue-400 transition-transform ui-open:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-4 text-gray-300">
                <p>Ja, alle våre planer kommer med en 14-dagers gratis prøveperiode. Du trenger ikke å oppgi betalingsinformasjon for å starte prøveperioden, og du kan avbryte når som helst.</p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-blue-950/30">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 rounded-2xl border border-blue-500/20 p-8 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Klar til å forbedre dine nyhetsbrev?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Start 14-dagers gratis prøveperiode i dag og få tilgang til markedets beste nyhetsbrev-database.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-7 text-lg">
                  Start gratis prøveperiode
                </Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-blue-500/10 px-8 py-7 text-lg">
                  Se demoer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-8 border-t border-blue-500/20 bg-black">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="text-blue-400 h-5 w-5" />
                <span className="text-white font-bold text-lg">NewsletterHub</span>
              </div>
              <p className="text-gray-400 mb-4">
                Norges største database av nyhetsbrev for markedsførere og byråer.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Produkt</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-blue-400">Funksjoner</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400">Priser</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400">Integrasjoner</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Ressurser</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-blue-400">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400">Guider</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400">Webinarer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400">Hjelp & Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Selskap</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-blue-400">Om oss</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400">Karriere</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400">Kontakt</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400">Personvern</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} NewsletterHub. Alle rettigheter reservert.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-blue-400 text-sm">Personvern</a>
              <a href="#" className="text-gray-500 hover:text-blue-400 text-sm">Vilkår</a>
              <a href="#" className="text-gray-500 hover:text-blue-400 text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
