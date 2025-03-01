
import { Button } from "@/components/ui/button";
import { RefreshCw, PlusCircle } from "lucide-react";
import { useGoogleAuth } from "./oauth/useGoogleAuth";

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
  const { isConnecting: authConnecting, initiateGoogleOAuth } = useGoogleAuth(isConnecting);

  return (
    <Button 
      onClick={initiateGoogleOAuth} 
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
