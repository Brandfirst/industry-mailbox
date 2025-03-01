
import { useState } from "react";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface LogoutHandlerProps {
  onLogout?: () => void;
  className?: string;
  isMobile?: boolean;
}

export const LogoutHandler = ({ onLogout, className, isMobile = false }: LogoutHandlerProps) => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  const forceCleanSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      toast({
        title: "Logger ut...",
        description: "Du blir logget ut av systemet",
      });
      
      try {
        try {
          localStorage.removeItem('professional');
          console.log("Removed 'professional' item");
        } catch (localErr) {
          console.warn("Failed to remove 'professional' directly", localErr);
        }
        
        try {
          localStorage.setItem('professional', 'null');
          localStorage.removeItem('professional');
          console.log("Overwrote and removed 'professional' item");
        } catch (overwriteErr) {
          console.warn("Failed to overwrite 'professional'", overwriteErr);
        }
        
        const safeRemoveItem = (key: string) => {
          try {
            localStorage.removeItem(key);
            console.log(`Removed ${key} from localStorage`);
          } catch (e) {
            console.warn(`Failed to remove ${key}:`, e);
          }
        };
        
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          try {
            const key = localStorage.key(i);
            if (key && (key.startsWith('supabase.') || key === 'professional')) {
              keysToRemove.push(key);
            }
          } catch (e) {
            console.warn(`Error accessing localStorage key at index ${i}:`, e);
          }
        }
        
        console.log("Will attempt to remove these keys:", keysToRemove);
        
        for (const key of keysToRemove) {
          safeRemoveItem(key);
        }
      } catch (storageErr) {
        console.error("Error cleaning localStorage:", storageErr);
      }
      
      try {
        await supabase.auth.signOut();
        console.log("Supabase signOut successful");
      } catch (signOutErr) {
        console.error("Error in direct supabase.auth.signOut():", signOutErr);
      }
      
      await signOut().catch(err => {
        console.error("Error in AuthContext signOut:", err);
      });
      
      if (onLogout) {
        onLogout();
      }
      
      setTimeout(() => {
        console.log("Forcefully redirecting to homepage");
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error("Error during forced sign out:", error);
      toast({
        title: "Feil ved utlogging",
        description: "Kunne ikke logge ut. Prøv igjen.",
        variant: "destructive",
      });
      
      window.location.href = '/';
    }
  };

  if (isMobile) {
    return (
      <button 
        onClick={forceCleanSignOut}
        className={`w-full text-red-400 border-red-400/20 hover:bg-red-400/10 ${className}`}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logg ut
      </button>
    );
  }

  return (
    <div onClick={forceCleanSignOut} className={`text-red-400 hover:bg-dark-400 ${className}`}>
      <LogOut className="w-4 h-4 mr-2" />
      Logg ut
    </div>
  );
};
