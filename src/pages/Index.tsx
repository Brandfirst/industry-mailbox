
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
        {/* Hero Section */}
        <section className="py-24 px-4 relative overflow-hidden mesh-gradient">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <div className="animate-slide-down">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
                For byråer og markedsførere
                <span className="block text-blue-400 mt-2">Norges største database av nyhetsbrev</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Få tilgang til markedsføringsintelligens fra tusenvis av norske nyhetsbrev. Ideelt for markedsførere, byråer og bransjefolk.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <h3 className="text-xl font-medium mb-3 text-white">Avansert Søk</h3>
                <p className="text-gray-400">
                  Bruk boolske operatorer, sitater og mer!
                </p>
              </div>
              
              <div className="feature-card bg-dark-300 rounded-xl p-6 shadow-card border border-white/5">
                <h3 className="text-xl font-medium mb-3 text-white">Bygg Merkelister</h3>
                <p className="text-gray-400">
                  Følg favorittmerker eller konkurrerende merker
                </p>
              </div>
              
              <div className="feature-card bg-dark-300 rounded-xl p-6 shadow-card border border-white/5">
                <h3 className="text-xl font-medium mb-3 text-white">Søkeord Varsler</h3>
                <p className="text-gray-400">
                  Få varsel når søkeord eller konkurrenter nevnes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Examples */}
        <section className="py-20 px-4 bg-dark-200">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Nyhetsbrev fra ledende norske bedrifter
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="feature-card bg-dark-300 border-white/5">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-medium mb-2 text-white">Ukens Markedsføring</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    2024-02-24
                    <span className="block">From: Kampanje</span>
                  </p>
                  <p className="text-gray-400">
                    De viktigste trendene innen digital markedsføring denne uken
                  </p>
                </CardContent>
              </Card>
              
              <Card className="feature-card bg-dark-300 border-white/5">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-medium mb-2 text-white">E-handel Update</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    2024-02-23
                    <span className="block">From: E24</span>
                  </p>
                  <p className="text-gray-400">
                    Siste nytt fra norsk e-handel: trender, tall og analyser
                  </p>
                </CardContent>
              </Card>
              
              <Card className="feature-card bg-dark-300 border-white/5">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-medium mb-2 text-white">Retail Insights</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    2024-02-22
                    <span className="block">From: DNB Markets</span>
                  </p>
                  <p className="text-gray-400">
                    Ukentlig analyse av detaljhandel og forbrukeratferd i Norge
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Link to="/search">
                <Button variant="outline" className="border-blue-400/30 text-blue-400 hover:bg-blue-900/20">
                  Se flere eksempler
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-black relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <h2 className="text-3xl font-bold mb-12 text-white">
              Få tilgang til Norges største e-post database
            </h2>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 bg-dark-300 rounded-xl border border-white/5 feature-card">
                <div className="text-4xl font-bold text-blue-400 mb-2">50,000+</div>
                <div className="text-sm text-gray-400">Nyhetsbrev arkivert</div>
              </div>
              
              <div className="p-6 bg-dark-300 rounded-xl border border-white/5 feature-card">
                <div className="text-4xl font-bold text-blue-400 mb-2">1,000+</div>
                <div className="text-sm text-gray-400">Norske bedrifter</div>
              </div>
              
              <div className="p-6 bg-dark-300 rounded-xl border border-white/5 feature-card">
                <div className="text-4xl font-bold text-blue-400 mb-2">10+ år</div>
                <div className="text-sm text-gray-400">Med data</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-dark-200">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="glass-card rounded-2xl py-12 px-4 md:px-8 bg-dark-300/50 backdrop-blur-md border border-white/10">
              <Mail className="h-12 w-12 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4 text-white">
                Klar til å forbedre din markedsføring?
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                Gratis versjon inkluderer 1 søk per dag. Oppgrader for ubegrenset tilgang.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                    Start Gratis Prøveperiode
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth?mode=signin">
                  <Button size="lg" variant="outline" className="border-blue-400/30 text-blue-400 hover:bg-blue-900/20">
                    Logg inn
                  </Button>
                </Link>
              </div>
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
