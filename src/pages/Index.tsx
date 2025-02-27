
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Search, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Index = () => {
  useEffect(() => {
    document.title = "NewsletterHub - The Newsletter Archive";
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
                All Your Newsletters
                <span className="block text-primary">In One Place</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Search, filter, and organize newsletters from across the web.
                Never miss important content again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/search">
                  <Button size="lg" className="bg-primary hover:bg-mint-dark text-white">
                    Start Searching
                    <Search className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-mint-light">
                    Create Account
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
              <span className="bg-primary/10 px-3 py-1 rounded-md text-primary inline-block mb-2 text-sm">Features</span>
              Powerful Newsletter Management
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Search Feature */}
              <div className="bg-white rounded-xl p-6 shadow-card transition-all duration-300 hover:translate-y-[-5px]">
                <div className="h-12 w-12 bg-mint-light rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Smart Search</h3>
                <p className="text-muted-foreground">
                  Search across thousands of newsletters with our powerful search engine.
                  Filter by industry, sender, or content.
                </p>
              </div>
              
              {/* Collections Feature */}
              <div className="bg-white rounded-xl p-6 shadow-card transition-all duration-300 hover:translate-y-[-5px]">
                <div className="h-12 w-12 bg-mint-light rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Premium Collections</h3>
                <p className="text-muted-foreground">
                  Save newsletters to your personal collections and organize them for future reference.
                  <span className="block mt-2 text-xs text-primary">Premium Feature</span>
                </p>
              </div>
              
              {/* Admin Feature */}
              <div className="bg-white rounded-xl p-6 shadow-card transition-all duration-300 hover:translate-y-[-5px]">
                <div className="h-12 w-12 bg-mint-light rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Admin Dashboard</h3>
                <p className="text-muted-foreground">
                  Powerful admin tools for managing newsletters, categorizing content,
                  and viewing detailed analytics.
                </p>
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
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of users who are already organizing their newsletters with NewsletterHub.
              </p>
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-primary hover:bg-mint-dark text-white">
                  Sign Up — It's Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
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
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              <a href="/admin" className="hover:text-foreground transition-colors">Admin</a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NewsletterHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
