
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, RefreshCw, Trash2, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getUserEmailAccounts, connectGoogleEmail, disconnectEmailAccount, syncEmailAccount } from "@/lib/supabase";
import { useLocation, useNavigate } from "react-router-dom";

const EmailConnection = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [emailAccounts, setEmailAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(null);
  const [isDisconnecting, setIsDisconnecting] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEmailAccounts();
    }
    
    // Check for OAuth callback
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state === 'gmail_connect' && user) {
      handleOAuthCallback(code);
      // Remove the query parameters to prevent reprocessing
      navigate('/admin', { replace: true });
    }
  }, [user, location]);

  const fetchEmailAccounts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const accounts = await getUserEmailAccounts(user.id);
      setEmailAccounts(accounts);
    } catch (error) {
      console.error("Error fetching email accounts:", error);
      toast.error("Failed to load email accounts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthCallback = async (code) => {
    if (!user) return;
    
    try {
      setIsConnecting(true);
      toast.loading("Connecting Gmail account...");
      const result = await connectGoogleEmail(user.id, code);
      
      if (result.success) {
        toast.success("Gmail account connected successfully!");
        // Refresh the email accounts list
        fetchEmailAccounts();
      } else {
        toast.error(`Failed to connect Gmail: ${result.error}`);
      }
    } catch (error) {
      console.error("Error handling OAuth callback:", error);
      toast.error("Failed to complete Gmail connection");
    } finally {
      setIsConnecting(false);
      // Always clear the OAuth flag
      sessionStorage.removeItem('gmailOAuthInProgress');
    }
  };

  const initiateGoogleOAuth = () => {
    if (isConnecting) return; // Prevent multiple clicks
    
    console.log("Starting Google OAuth flow...");
    setIsConnecting(true);
    
    // Get the OAuth client ID from environment variables
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error("Google client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to your environment.");
      setIsConnecting(false);
      return;
    }
    
    try {
      // Save a flag in sessionStorage to detect if we're in the middle of an OAuth flow
      sessionStorage.setItem('gmailOAuthInProgress', 'true');
      
      // Use the same origin for the redirect URI
      const redirectUri = `${window.location.origin}/admin`;
      
      // Properly construct the Google OAuth URL
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.append("client_id", clientId);
      authUrl.searchParams.append("redirect_uri", redirectUri);
      authUrl.searchParams.append("scope", "https://www.googleapis.com/auth/gmail.readonly");
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("access_type", "offline");
      authUrl.searchParams.append("prompt", "consent");
      authUrl.searchParams.append("state", "gmail_connect");

      // Redirect to Google OAuth consent screen
      console.log("Redirecting to Google OAuth URL:", authUrl.toString());
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Error initiating OAuth flow:", error);
      toast.error("Failed to start Google authentication");
      setIsConnecting(false);
      sessionStorage.removeItem('gmailOAuthInProgress');
    }
  };

  const handleDisconnect = async (accountId) => {
    if (!user) return;
    
    setIsDisconnecting(accountId);
    try {
      const result = await disconnectEmailAccount(accountId);
      
      if (result.success) {
        toast.success("Email account disconnected");
        // Refresh the email accounts list
        fetchEmailAccounts();
      } else {
        toast.error(`Failed to disconnect: ${result.error}`);
      }
    } catch (error) {
      console.error("Error disconnecting email account:", error);
      toast.error("Failed to disconnect email account");
    } finally {
      setIsDisconnecting(null);
    }
  };

  const handleSync = async (accountId) => {
    if (!user) return;
    
    setIsSyncing(accountId);
    try {
      const result = await syncEmailAccount(accountId);
      
      if (result.success) {
        toast.success("Email account synced successfully");
        // Refresh the email accounts list to get the updated last_sync time
        fetchEmailAccounts();
      } else {
        toast.error(`Failed to sync: ${result.error}`);
      }
    } catch (error) {
      console.error("Error syncing email account:", error);
      toast.error("Failed to sync email account");
    } finally {
      setIsSyncing(null);
    }
  };

  // Check if we just returned from a failed OAuth flow and make sure the button doesn't disappear
  useEffect(() => {
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
    
    if (oauthInProgress === 'true' && !location.search.includes('code=')) {
      // We were in an OAuth flow but came back without a code
      console.log("Detected return from OAuth flow without code");
      toast.error("Gmail connection was cancelled or failed");
      sessionStorage.removeItem('gmailOAuthInProgress');
      setIsConnecting(false);
    }
    
    // Always reset isConnecting when component mounts/unmounts to ensure button is visible
    return () => {
      setIsConnecting(false);
      if (sessionStorage.getItem('gmailOAuthInProgress') === 'true' && !location.search.includes('code=')) {
        sessionStorage.removeItem('gmailOAuthInProgress');
      }
    };
  }, [location]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Connect Email Accounts
        </CardTitle>
        <CardDescription>
          Connect your email accounts to automatically fetch and archive newsletters.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : emailAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Mail className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-1">No Email Accounts Connected</h3>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              Connect your Gmail account to automatically import newsletters.
            </p>
            <Button 
              onClick={initiateGoogleOAuth} 
              disabled={isConnecting}
              className="relative"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Connect Gmail
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {emailAccounts.map((account) => (
              <div 
                key={account.id} 
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{account.email}</div>
                  <div className="text-sm text-muted-foreground">
                    Connected {new Date(account.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last sync: {account.last_sync ? new Date(account.last_sync).toLocaleString() : 'Never'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={isSyncing === account.id}
                    onClick={() => handleSync(account.id)}
                  >
                    {isSyncing === account.id ? (
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-1" />
                    )}
                    Sync
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={isDisconnecting === account.id}
                    onClick={() => handleDisconnect(account.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                    Disconnect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {emailAccounts.length > 0 && (
          <Button 
            variant="outline" 
            onClick={initiateGoogleOAuth}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            Connect Another Account
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EmailConnection;
