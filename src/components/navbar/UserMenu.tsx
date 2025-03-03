
import { useNavigate } from "react-router-dom";
import { User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutHandler } from "./LogoutHandler";
import { useTheme } from "@/contexts/ThemeContext";

interface UserMenuProps {
  user: any;
  isAdmin: boolean;
  isPremium: boolean;
}

export const UserMenu = ({ user, isAdmin, isPremium }: UserMenuProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center gap-4">
      {!isPremium && (
        <Button variant="outline" className="btn-hover-effect border-blue-400 text-blue-400 hover:bg-blue-400/10">
          Oppgrader
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`rounded-full ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-dark-400 hover:bg-dark-500'}`}
          >
            <User className={`w-5 h-5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className={theme === 'light' ? 'bg-white border-gray-200' : 'bg-dark-300 border-white/10'}
        >
          <DropdownMenuLabel className={theme === 'light' ? 'text-gray-900' : 'text-gray-100'}>
            {user.user_metadata.firstName || user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className={theme === 'light' ? 'bg-gray-200' : 'bg-white/10'} />
          <DropdownMenuItem 
            onClick={() => navigate('/account')} 
            className={theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-dark-400 text-gray-200'}
          >
            Min konto
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem 
              onClick={() => navigate('/admin')} 
              className={theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-dark-400 text-gray-200'}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin panel
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={() => navigate('/saved')} 
            className={theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-dark-400 text-gray-200'}
          >
            Lagrede nyhetsbrev
          </DropdownMenuItem>
          <DropdownMenuSeparator className={theme === 'light' ? 'bg-gray-200' : 'bg-white/10'} />
          <DropdownMenuItem className="p-0">
            <LogoutHandler className="w-full flex items-center px-2 py-1.5 cursor-default" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
