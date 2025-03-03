
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
  variant = "ghost" 
}) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={`rounded-full ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
    </Button>
  );
};

export default ThemeToggle;
