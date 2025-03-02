
import React from 'react';

const DataVisualizationSection: React.FC = () => {
  return (
    <div 
      data-editable="true" 
      data-editable-type="padding" 
      data-editable-id="data-viz-section" 
      className="text-center mb-14 border-t border-gray-800 pt-10"
    >
      <h2 
        data-editable="true" 
        data-editable-type="text" 
        data-editable-id="data-viz-heading" 
        className="text-3xl md:text-4xl font-bold mb-4 text-white"
      >
        Dyp innsikt i nyhetsbrev-landskapet
      </h2>
      <p 
        data-editable="true" 
        data-editable-type="text" 
        data-editable-id="data-viz-desc" 
        className="text-lg text-gray-300 max-w-3xl mx-auto"
      >
        NewsletterHub kombinerer AI-analyse med omfattende data fra ledende norske merkevarer, 
        for å gi deg uovertruffen innsikt i nyhetsbrev-trender, design og effektivitet.
      </p>
    </div>
  );
};

export default DataVisualizationSection;
