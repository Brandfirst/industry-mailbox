
import React from 'react';

const EmptyPreview: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl">
      <p className="text-gray-500 text-xs md:text-base">No preview</p>
    </div>
  );
};

export default EmptyPreview;
