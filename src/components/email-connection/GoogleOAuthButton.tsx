
import { Button } from "@/components/ui/button";
import { RefreshCw, PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { useGoogleOAuthButton } from "./hooks/useGoogleOAuthButton";

interface GoogleOAuthButtonProps {
  isConnecting: boolean;
  buttonText?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
}

export const GoogleOAuthButton = ({ 
  isConnecting, 
  buttonText = "Connect Gmail", 
  variant = "default",
  className = ""
}: GoogleOAuthButtonProps) => {
  const { isConnecting: authConnecting, initiateGoogleOAuth } = useGoogleOAuthButton(isConnecting);
  
  // Log when the button is clicked to help with debugging
  const handleClick = () => {
    console.log('[GOOGLE AUTH] Button clicked, initiating Google OAuth flow...');
    initiateGoogleOAuth();
  };
  
  // Log when the component mounts to help with debugging
  useEffect(() => {
    console.log('[GOOGLE AUTH] GoogleOAuthButton mounted', {
      isConnecting,
      authConnecting,
      buttonText,
      variant,
      timestamp: new Date().toISOString()
    });
  }, [isConnecting, authConnecting, buttonText, variant]);

  return (
    <Button 
      onClick={handleClick} 
      disabled={authConnecting}
      variant={variant}
      className={className}
    >
      {authConnecting ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </>
      )}
    </Button>
  );
};
