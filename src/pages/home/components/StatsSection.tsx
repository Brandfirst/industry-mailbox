
import { Mail, Users, BarChart, Calendar, TrendingUp, PieChart, LineChart } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const StatsSection = () => {
  // Stats data with mock values for now
  const stats = [
    { value: "5,000+", label: "Nyhetsbrev", icon: Mail },
    { value: "200+", label: "Byråer", icon: Users },
    { value: "97%", label: "Fornøyde kunder", icon: BarChart },
    { value: "12,000+", label: "Ukentlige brukere", icon: Calendar },
  ];

  // Mock data for the line chart
  const chartPoints = "M5,40 C20,10 35,50 50,20 C65,50 80,10 95,30";

  // Logo data
  const logos = [
    { name: "TRUE CLASSIC", className: "font-bold tracking-wide" },
    { name: "AGI", className: "font-light" },
    { name: "VAYNERMEDIA", className: "font-medium" },
    { name: "THE RIDGE", className: "font-bold" },
    { name: "PARAMOUNT", className: "font-light italic" },
    { name: "TUBESCIENCE", className: "font-medium tracking-wide" },
    { name: "JONES ROAD", className: "font-bold tracking-widest" },
    { name: "JAMBYS", className: "font-light italic" },
    { name: "KETTLE & FIRE", className: "font-medium" },
    { name: "BACARDI", className: "font-bold" },
    { name: "MAGIC SPOON", className: "font-medium" },
    { name: "HEXCLAD", className: "font-bold tracking-wider" },
  ];

  return (
    <section className="py-8 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Dyp innsikt i nyhetsbrev-landskapet</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            NewsletterHub kombinerer AI-analyse med omfattende data fra ledende norske merkevarer, 
            for å gi deg uovertruffen innsikt i nyhetsbrev-trender, design og effektivitet.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 bg-[#0A0A0A] rounded-xl border border-[#3a6ffb]/20 hover:border-[#3a6ffb]/30 transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                <stat.icon className="h-6 w-6 text-[#3a6ffb]" />
              </div>
              <span className="text-sm text-gray-300">{stat.label}</span>
            </div>
          ))}
        </div>
        
        {/* Brand logos section */}
        <div className="pt-8 pb-16 border-t border-gray-800">
          <h3 className="text-center text-sm md:text-base text-gray-400 mb-10">Loved by 5,000+ Brands & Agencies</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12">
            {logos.map((logo, index) => (
              <div key={index} className="flex items-center justify-center">
                <span className={`text-white text-sm md:text-base opacity-80 hover:opacity-100 transition-opacity ${logo.className}`}>
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Data visualization section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Trend analysis chart */}
          <div className="bg-[#0A0A0A] p-6 rounded-xl border border-[#3a6ffb]/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#3a6ffb]" /> 
                Nyhetsbrev-effektivitet
              </h3>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-[#0A0A0A] text-xs border border-gray-700 rounded text-gray-400">Daglig</span>
                <span className="px-2 py-1 bg-[#3a6ffb] text-xs rounded text-white">Ukentlig</span>
                <span className="px-2 py-1 bg-[#0A0A0A] text-xs border border-gray-700 rounded text-gray-400">Månedlig</span>
              </div>
            </div>
            
            <div className="h-[200px] w-full relative mt-6">
              {/* Chart visualization */}
              <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none" className="overflow-visible">
                {/* Grid lines */}
                <line x1="0" y1="15" x2="100" y2="15" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="0" y1="30" x2="100" y2="30" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="0" y1="45" x2="100" y2="45" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
                
                {/* Blue trend line */}
                <path d={chartPoints} fill="none" stroke="#3a6ffb" strokeWidth="2" />
                
                {/* Gradient under the line */}
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3a6ffb" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3a6ffb" stopOpacity="0" />
                </linearGradient>
                <path d={`${chartPoints} L95,60 L5,60 Z`} fill="url(#blueGradient)" />
                
                {/* Data points */}
                <circle cx="5" cy="40" r="2" fill="#3a6ffb" />
                <circle cx="20" cy="10" r="2" fill="#3a6ffb" />
                <circle cx="35" cy="50" r="2" fill="#3a6ffb" />
                <circle cx="50" cy="20" r="2" fill="#3a6ffb" />
                <circle cx="65" cy="50" r="2" fill="#3a6ffb" />
                <circle cx="80" cy="10" r="2" fill="#3a6ffb" />
                <circle cx="95" cy="30" r="2" fill="#3a6ffb" />
              </svg>
              
              {/* X-axis labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Man</span>
                <span>Tir</span>
                <span>Ons</span>
                <span>Tor</span>
                <span>Fre</span>
                <span>Lør</span>
                <span>Søn</span>
              </div>
            </div>
          </div>
          
          {/* AI insights table */}
          <div className="bg-[#0A0A0A] p-6 rounded-xl border border-[#3a6ffb]/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-[#3a6ffb]" /> 
                AI-drevet analyse
              </h3>
              <span className="px-2 py-1 text-xs bg-[#3a6ffb]/20 text-[#3a6ffb] rounded-full">Oppdatert daglig</span>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Innholdstype</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead className="text-right">Effektivitet</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Produktlansering</TableCell>
                  <TableCell>
                    <span className="flex items-center text-green-400">
                      <TrendingUp size={16} className="mr-1" /> Økende
                    </span>
                  </TableCell>
                  <TableCell className="text-right">89%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Rabattkampanjer</TableCell>
                  <TableCell>
                    <span className="flex items-center text-[#3a6ffb]">
                      <LineChart size={16} className="mr-1" /> Stabil
                    </span>
                  </TableCell>
                  <TableCell className="text-right">76%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Informative artikler</TableCell>
                  <TableCell>
                    <span className="flex items-center text-green-400">
                      <TrendingUp size={16} className="mr-1" /> Økende
                    </span>
                  </TableCell>
                  <TableCell className="text-right">83%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Event-invitasjoner</TableCell>
                  <TableCell>
                    <span className="flex items-center text-[#3a6ffb]">
                      <LineChart size={16} className="mr-1" /> Stabil
                    </span>
                  </TableCell>
                  <TableCell className="text-right">72%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
