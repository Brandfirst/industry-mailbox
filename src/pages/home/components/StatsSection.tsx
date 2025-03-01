
import { Mail, Users, BarChart, Calendar } from "lucide-react";

const StatsSection = () => {
  // Stats data with mock values for now
  const stats = [
    { value: "5,000+", label: "Nyhetsbrev", icon: Mail },
    { value: "200+", label: "Byråer", icon: Users },
    { value: "97%", label: "Fornøyde kunder", icon: BarChart },
    { value: "12,000+", label: "Ukentlige brukere", icon: Calendar },
  ];

  return (
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
  );
};

export default StatsSection;
