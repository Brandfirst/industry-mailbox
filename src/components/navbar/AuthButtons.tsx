
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export const AuthButtons = () => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      <Link to="/auth?mode=signin">
        <Button 
          variant="outline" 
          className={theme === 'light' 
            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100' 
            : 'glass-button text-gray-300 hover:text-white backdrop-blur-sm bg-black/30'
          }
        >
          Logg inn
        </Button>
      </Link>
      <Link to="/auth?mode=signup">
        <Button className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'gradient-button'}>
          Registrer
        </Button>
      </Link>
    </div>
  );
};
