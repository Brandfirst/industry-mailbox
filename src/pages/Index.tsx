
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Search, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Index = () => {
  useEffect(() => {
    document.title = "NewsletterHub - Norges største nyhetsbrev arkiv";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="animate-slide-down">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                For byråer og markedsførere
                <span className="block text-primary">Norges største database av nyhetsbrev</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Få tilgang til markedsføringsintelligens fra tusenvis av norske nyhetsbrev. Ideelt for markedsførere, byråer og bransjefolk.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/search">
                  <Button size="lg" className="bg-primary hover:bg-mint-dark text-white">
                    Start Søket
                    <Search className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-mint-light">
                    Opprett Konto
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-secondary">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-primary/10 px-3 py-1 rounded-md text-primary inline-block mb-2 text-sm">Fordeler</span>
              Markedsføringsintelligens som gir resultater
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Search Feature */}
              <div className="bg-white rounded-xl p-6 shadow-card transition-all duration-300 hover:translate-y-[-5px]">
                <div className="h-12 w-12 bg-mint-light rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Finn inspirasjon</h3>
                <p className="text-muted-foreground">
                  Få kreative ideer ved å se gjennom andre kampanjer. Perfekter ditt neste nyhetsbrev.
                </p>
              </div>
              
              {/* Collections Feature */}
              <div className="bg-white rounded-xl p-6 shadow-card transition-all duration-300 hover:translate-y-[-5px]">
                <div className="h-12 w-12 bg-mint-light rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Spor konkurrenter</h3>
                <p className="text-muted-foreground">
                  Hold øye med konkurrentene og vær alltid ett skritt foran i markedet.
                  <span className="block mt-2 text-xs text-primary">Premium Funksjon</span>
                </p>
              </div>
              
              {/* Admin Feature */}
              <div className="bg-white rounded-xl p-6 shadow-card transition-all duration-300 hover:translate-y-[-5px]">
                <div className="h-12 w-12 bg-mint-light rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Avdekk muligheter</h3>
                <p className="text-muted-foreground">
                  Skap kampanjer som skiller seg ut i mengden av markedskommunikasjon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-primary/10 px-3 py-1 rounded-md text-primary inline-block mb-2 text-sm">Premium</span>
              Oppgrader med NewsVault Pro
            </h2>
            <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Alt du trenger for å forbedre din e-postmarkedsføring
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-3">Komplett Arkiv</h3>
                <p className="text-muted-foreground">
                  Søk gjennom år med nyhetsbrev fra norske bedrifter
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-3">Avanserte Filtre</h3>
                <p className="text-muted-foreground">
                  Filtrer etter sesong, markedsmål og mer
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-3">Organiser Mapper</h3>
                <p className="text-muted-foreground">
                  Lagre nyhetsbrev for fremtidig referanse, med private notater
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-3">Avansert Søk</h3>
                <p className="text-muted-foreground">
                  Bruk boolske operatorer, sitater og mer!
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-3">Bygg Merkelister</h3>
                <p className="text-muted-foreground">
                  Følg favorittmerker eller konkurrerende merker
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-3">Søkeord Varsler</h3>
                <p className="text-muted-foreground">
                  Få varsel når søkeord eller konkurrenter nevnes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Examples */}
        <section className="py-16 px-4 bg-secondary">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Nyhetsbrev fra ledende norske bedrifter
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="text-xl font-medium mb-2">Ukens Markedsføring</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  2024-02-24
                  <span className="block">From: Kampanje</span>
                </p>
                <p className="text-muted-foreground">
                  De viktigste trendene innen digital markedsføring denne uken
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="text-xl font-medium mb-2">E-handel Update</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  2024-02-23
                  <span className="block">From: E24</span>
                </p>
                <p className="text-muted-foreground">
                  Siste nytt fra norsk e-handel: trender, tall og analyser
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="text-xl font-medium mb-2">Retail Insights</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  2024-02-22
                  <span className="block">From: DNB Markets</span>
                </p>
                <p className="text-muted-foreground">
                  Ukentlig analyse av detaljhandel og forbrukeratferd i Norge
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-12">
              Få tilgang til Norges største e-post database
            </h2>
            
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-sm text-muted-foreground">Nyhetsbrev arkivert</div>
              </div>
              
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1,000+</div>
                <div className="text-sm text-muted-foreground">Norske bedrifter</div>
              </div>
              
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10+ år</div>
                <div className="text-sm text-muted-foreground">Med data</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="glass-card rounded-2xl py-12 px-4 md:px-8">
              <Mail className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                Klar til å forbedre din markedsføring?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Gratis versjon inkluderer 1 søk per dag. Oppgrader for ubegrenset tilgang.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="bg-primary hover:bg-mint-dark text-white">
                    Start Gratis Prøveperiode
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth?mode=signin">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-mint-light">
                    Logg inn
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Mail className="w-5 h-5 text-primary mr-2" />
              <span className="text-sm font-medium">NewsletterHub</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Vilkår</a>
              <a href="#" className="hover:text-foreground transition-colors">Personvern</a>
              <a href="#" className="hover:text-foreground transition-colors">Kontakt</a>
              <a href="/admin" className="hover:text-foreground transition-colors">Admin</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NewsletterHub. Alle rettigheter reservert.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
