
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Mail, PlusCircle, RefreshCw, ExternalLink } from "lucide-react";
import { GoogleOAuthButton } from "./GoogleOAuthButton";

interface NoAccountsStateProps {
  isLoading: boolean;
  isConnecting: boolean;
  redirectUri: string;
  handleConnect: (initiateGoogleOAuth: () => void) => void;
}

export const NoAccountsState = ({ 
  isLoading, 
  isConnecting,
  redirectUri,
  handleConnect
}: NoAccountsStateProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full bg-muted" />
        <Skeleton className="h-16 w-full bg-muted" />
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <GoogleOAuthButton isConnecting={isConnecting} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Mail className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="font-medium text-lg mb-1 text-card-foreground">No Email Accounts Connected</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        Connect your Gmail account to automatically import newsletters.
      </p>
      <GoogleOAuthButton isConnecting={isConnecting} />
      
      <div className="mt-4 p-3 border rounded-md bg-secondary text-left w-full max-w-md">
        <h4 className="text-sm font-medium mb-2 text-card-foreground">Google OAuth Configuration</h4>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Redirect URI being used:</p>
            <code className="px-2 py-1 bg-background rounded text-xs block overflow-auto text-foreground">
              {redirectUri}
            </code>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Client ID:</p>
            <code className="px-2 py-1 bg-background rounded text-xs block overflow-hidden text-ellipsis whitespace-nowrap text-foreground">
              {import.meta.env.VITE_GOOGLE_CLIENT_ID}
            </code>
          </div>
          <p className="text-xs text-muted-foreground">
            Make sure the redirect URI matches exactly what's configured in your 
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center mx-1"
            >
              Google Cloud Console
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
            under "Authorized redirect URIs".
          </p>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <h4 className="text-sm font-medium mb-2 text-card-foreground">Supabase Edge Function Status</h4>
          <p className="text-xs text-muted-foreground">
            If you're encountering errors connecting to Gmail, check the 
            <a 
              href="https://supabase.com/dashboard/project/ldhnqpkaifyoxtuchxko/functions/connect-gmail/logs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center mx-1"
            >
              Edge Function Logs
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
            for more detailed error information.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Also verify the 
            <a 
              href="https://supabase.com/dashboard/project/ldhnqpkaifyoxtuchxko/settings/functions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center mx-1"
            >
              Edge Function Secrets
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
            for GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URL.
          </p>
        </div>
      </div>
    </div>
  );
};
