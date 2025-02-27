
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, RefreshCw, Trash2, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getUserEmailAccounts, connectGoogleEmail, disconnectEmailAccount, syncEmailAccount, EmailAccount } from "@/lib/supabase";

const ConnectEmail = () => {
  const { user } = useAuth();
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState<string | null>(null);

  useEffect(() => {
    fetchEmailAccounts();
  }, [user]);

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

  const initiateGoogleOAuth = () => {
    // Define the OAuth parameters
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error("Google Client ID is not configured");
      return;
    }

    const redirectUri = `${window.location.origin}/admin`;
    const scope = "https://www.googleapis.com/auth/gmail.readonly";
    const responseType = "code";
    const accessType = "offline";
    const prompt = "consent";

    // Build the OAuth URL
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.append("client_id", clientId);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("scope", scope);
    authUrl.searchParams.append("response_type", responseType);
    authUrl.searchParams.append("access_type", accessType);
    authUrl.searchParams.append("prompt", prompt);
    authUrl.searchParams.append("state", "gmail_connect");

    // Redirect to Google OAuth consent screen
    window.location.href = authUrl.toString();
  };

  const handleOAuthCallback = async () => {
    if (!user) return;

    // Check if we're returning from OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    const state = urlParams.get("state");

    if (authCode && state === "gmail_connect") {
      try {
        toast.loading("Connecting Gmail account...");
        const { success, error, data } = await connectGoogleEmail(user.id, authCode);
        
        if (success) {
          toast.success("Gmail account connected successfully");
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          // Refresh accounts list
          fetchEmailAccounts();
        } else {
          toast.error(`Failed to connect Gmail account: ${error}`);
        }
      } catch (error) {
        console.error("Error connecting Gmail account:", error);
        toast.error("Failed to connect Gmail account");
      }
    }
  };

  const handleSyncAccount = async (accountId: string) => {
    setIsSyncing(accountId);
    try {
      const { success, error } = await syncEmailAccount(accountId);
      
      if (success) {
        toast.success("Sync started successfully. This may take a few minutes.");
      } else {
        toast.error(`Failed to sync: ${error}`);
      }
    } catch (error) {
      console.error("Error syncing account:", error);
      toast.error("Failed to sync account");
    } finally {
      setIsSyncing(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    setIsDisconnecting(accountId);
    try {
      const { success, error } = await disconnectEmailAccount(accountId);
      
      if (success) {
        toast.success("Email account disconnected");
        fetchEmailAccounts();
      } else {
        toast.error(`Failed to disconnect: ${error}`);
      }
    } catch (error) {
      console.error("Error disconnecting account:", error);
      toast.error("Failed to disconnect account");
    } finally {
      setIsDisconnecting(null);
    }
  };

  // Check for OAuth callback when component mounts
  useEffect(() => {
    handleOAuthCallback();
  }, [user]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Email</CardTitle>
          <CardDescription>You need to be logged in to connect email accounts.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
            <Button onClick={initiateGoogleOAuth}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect Gmail
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
                    onClick={() => handleSyncAccount(account.id)}
                    disabled={!!isSyncing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing === account.id ? 'animate-spin' : ''}`} />
                    Sync
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDisconnect(account.id)}
                    disabled={!!isDisconnecting}
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
          <Button variant="outline" onClick={initiateGoogleOAuth}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Connect Another Account
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConnectEmail;
