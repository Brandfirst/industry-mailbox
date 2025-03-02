
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { TrendingUp, LineChart, PieChart } from "lucide-react";

const ChartsSection: React.FC = () => {
  // Mock data for the line chart
  const chartPoints = "M5,40 C20,10 35,50 50,20 C65,50 80,10 95,30";

  return (
    <div 
      data-editable="true" 
      data-editable-type="margin" 
      data-editable-id="charts-container" 
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
    >
      {/* Trend analysis chart */}
      <div 
        data-editable="true" 
        data-editable-type="padding" 
        data-editable-id="trend-chart-card" 
        className="bg-[#0A0A0A] p-6 rounded-xl border border-[#3a6ffb]/20"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 
            data-editable="true" 
            data-editable-type="text" 
            data-editable-id="trend-chart-title" 
            className="text-xl font-bold text-white flex items-center"
          >
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
      <div 
        data-editable="true" 
        data-editable-type="padding" 
        data-editable-id="ai-insights-card" 
        className="bg-[#0A0A0A] p-6 rounded-xl border border-[#3a6ffb]/20"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 
            data-editable="true" 
            data-editable-type="text" 
            data-editable-id="ai-insights-title" 
            className="text-xl font-bold text-white flex items-center"
          >
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
              <TableCell 
                data-editable="true" 
                data-editable-type="text" 
                data-editable-id="table-cell-1" 
                className="font-medium"
              >
                Produktlansering
              </TableCell>
              <TableCell>
                <span className="flex items-center text-green-400">
                  <TrendingUp size={16} className="mr-1" /> Økende
                </span>
              </TableCell>
              <TableCell 
                data-editable="true" 
                data-editable-type="text" 
                data-editable-id="table-percent-1" 
                className="text-right"
              >
                89%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell 
                data-editable="true" 
                data-editable-type="text" 
                data-editable-id="table-cell-2" 
                className="font-medium"
              >
                Rabattkampanjer
              </TableCell>
              <TableCell>
                <span className="flex items-center text-[#3a6ffb]">
                  <LineChart size={16} className="mr-1" /> Stabil
                </span>
              </TableCell>
              <TableCell 
                data-editable="true" 
                data-editable-type="text" 
                data-editable-id="table-percent-2" 
                className="text-right"
              >
                76%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell 
                data-editable="true" 
                data-editable-type="text" 
                data-editable-id="table-cell-3" 
                className="font-medium"
              >
                Informative artikler
              </TableCell>
              <TableCell>
                <span className="flex items-center text-green-400">
                  <TrendingUp size={16} className="mr-1" /> Økende
                </span>
              </TableCell>
              <TableCell 
                data-editable="true" 
                data-editable-type="text" 
                data-editable-id="table-percent-3" 
                className="text-right"
              >
                83%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell 
                data-editable="true" 
                data-editable-type="text" 
                data-editable-id="table-cell-4" 
                className="font-medium"
              >
                Event-invitasjoner
              </TableCell>
              <TableCell>
                <span className="flex items-center text-[#3a6ffb]">
                  <LineChart size={16} className="mr-1" /> Stabil
                </span>
              </TableCell>
              <TableCell 
                data-editable="true" 
                data-editable-type="text" 
                data-editable-id="table-percent-4" 
                className="text-right"
              >
                72%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChartsSection;
