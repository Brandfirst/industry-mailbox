
import React from 'react';
import { LucideIcon } from 'lucide-react';

type StatData = {
  value: string;
  label: string;
  icon: LucideIcon;
};

interface StatsGridSectionProps {
  stats: StatData[];
}

const StatsGridSection: React.FC<StatsGridSectionProps> = ({ stats }) => {
  return (
    <div 
      data-editable="true" 
      data-editable-type="margin" 
      data-editable-id="stats-grid-container" 
      className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16 border-t border-gray-800 pt-10"
    >
      {stats.map((stat, index) => (
        <div 
          key={index} 
          data-editable="true" 
          data-editable-type="padding" 
          data-editable-id={`stat-card-${index}`} 
          className="p-6 bg-[#0A0A0A] rounded-xl border border-[#3a6ffb]/20 hover:border-[#3a6ffb]/30 transition-all"
        >
          <div className="flex justify-between items-center mb-2">
            <span 
              data-editable="true" 
              data-editable-type="text" 
              data-editable-id={`stat-value-${index}`} 
              className="text-2xl md:text-3xl font-bold text-white"
            >
              {stat.value}
            </span>
            <stat.icon className="h-6 w-6 text-[#3a6ffb]" />
          </div>
          <span 
            data-editable="true" 
            data-editable-type="text" 
            data-editable-id={`stat-label-${index}`} 
            className="text-sm text-gray-300"
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatsGridSection;
