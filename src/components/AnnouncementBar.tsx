
import React, { useState } from 'react';
import { X } from 'lucide-react';

export const HomeHeader = () => {
  // This is a null component that exists to prevent errors
  return null;
};

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#FF5722] text-white py-2 px-4 text-center relative z-20">
      <p className="text-sm font-medium">
        Begrenset tilbud: 50% rabatt på årsabonnement frem til 31. mai!
      </p>
      <button
        onClick={handleClose}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
        aria-label="Lukk"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
