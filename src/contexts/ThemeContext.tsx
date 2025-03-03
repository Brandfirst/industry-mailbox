
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get theme from localStorage, default to dark
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "dark";
  });

  // Effect to apply theme to document when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove("dark", "light");
    
    // Add current theme class to html element
    root.classList.add(theme);
    
    // Update body class for specific styling
    if (theme === "light") {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");

      // For admin theme
      if (root.classList.contains('admin-theme')) {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    } else {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      
      // For admin theme
      if (root.classList.contains('admin-theme')) {
        root.classList.add('dark');
        root.classList.remove('light');
      }
    }
    
    // Store in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
