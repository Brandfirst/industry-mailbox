
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = "", 
  variant = "outline" 
}) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={`rounded-full border-[#FF5722]/30 hover:border-[#FF5722]/60 ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-[#FF5722]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-[#FF5722]" />
      )}
    </Button>
  );
};

export default ThemeToggle;
