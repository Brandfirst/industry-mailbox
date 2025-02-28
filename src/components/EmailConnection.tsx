
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, RefreshCw, Trash2, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getUserEmailAccounts, connectGoogleEmail, disconnectEmailAccount, syncEmailAccount } from "@/lib/supabase";

const EmailConnection = () => {
  const { user } = useAuth();
  const [emailAccounts, setEmailAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(null);
  const [isDisconnecting, setIsDisconnecting] = useState(null);

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
    console.log("Starting Google OAuth flow...");
    
    // Use the current origin for the redirect URI
    const redirectUri = `${window.location.origin}/admin`;
    
    // Build the OAuth URL - this would typically use environment variables for the client ID
    // For testing, we'll use a placeholder client ID
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID";
    
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
    
    // For testing purposes, just show a toast message instead of actually redirecting
    toast.info("Gmail connection would redirect to Google login (simulation)");
    
    // In production, uncomment this line to actually redirect
    // window.location.href = authUrl.toString();
  };

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
                    onClick={() => toast.info("Sync initiated")}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Sync
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info("Account disconnected")}
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

export default EmailConnection;
