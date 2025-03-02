
import { Component } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Define HomeHeader as a null component
export const HomeHeader: Component = () => null;

const AnnouncementBar = () => {
  return (
    <div className="relative z-50 w-full bg-black/80 border-b border-white/10 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-12 px-4 mx-auto md:h-14">
        <div className="hidden md:block">
          {/* Left side - empty on mobile, logo on desktop */}
          <Link to="/" className="flex items-center">
            <span className="text-white text-lg font-bold">NewsletterHub</span>
          </Link>
        </div>
        
        <div className="flex-1 md:flex-none">
          {/* Center announcement - full width on mobile */}
          <div className="flex items-center justify-center gap-1.5 py-0.5 mt-[-8px] md:mt-0">
            <AlertCircle className="h-3.5 w-3.5 text-[#FF5722]" />
            <p className="text-xs font-medium">
              <span className="text-white">Ny versjon 2.0:</span>{" "}
              <span className="text-gray-300">Nå med AI-analyse av nyhetsbrev</span>
            </p>
          </div>
        </div>
        
        <div>
          {/* Right side button */}
          <Button size="sm" variant="ghost" className="h-7 custom-button-hover">
            <Link to="/features">Se alle funksjoner</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
