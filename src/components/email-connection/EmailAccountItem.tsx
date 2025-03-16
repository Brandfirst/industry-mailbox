
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RotateCw, RefreshCw, TrashIcon, AlertTriangle } from "lucide-react";
import { syncEmailAccount, disconnectEmailAccount } from "@/lib/supabase/emailAccounts";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export interface EmailAccountItemProps {
  account: {
    id: string;
    email: string;
    last_sync: string | null;
    provider: string;
  };
  onDelete?: (id: string) => void;
  onSync?: (id: string) => Promise<any>;
  isSyncing?: boolean;
  isDisconnecting?: boolean;
}

export const EmailAccountItem = ({
  account,
  onDelete,
  onSync,
  isSyncing = false,
  isDisconnecting = false
}: EmailAccountItemProps) => {
  const [syncError, setSyncError] = useState<string | null>(null);
  const [needsReauth, setNeedsReauth] = useState(false);
  const [syncAttempts, setSyncAttempts] = useState(0);
  
  const handleSync = async () => {
    if (isSyncing) return; // Prevent multiple syncs
    
    setSyncError(null);
    setNeedsReauth(false);
    setSyncAttempts(prev => prev + 1);
    
    // Create a unique ID for this toast
    const toastId = `sync-${account.id}-${Date.now()}`;
    
    try {
      toast.loading(`Syncing emails from ${account.email}...`, {
        id: toastId,
        duration: 30000 // 30 seconds max
      });
      
      // If component has onSync prop, use it
      if (onSync) {
        const result = await onSync(account.id);
        toast.dismiss(toastId);
        
        if (result?.requiresReauthentication) {
          setNeedsReauth(true);
          setSyncError("Authentication expired. Please reconnect your account.");
          toast.error("Authentication expired. Please reconnect your account.", {
            id: toastId,
          });
        } else if (!result?.success) {
          setSyncError(result?.error || "Failed to sync emails");
          toast.error(`Sync failed: ${result?.error || "Unknown error"}`, {
            id: toastId,
          });
        } else {
          toast.success(`Successfully synced ${result.count || 0} emails`, {
            id: toastId,
          });
        }
      } else {
        // Otherwise use direct sync method
        const result = await syncEmailAccount(account.id);
        toast.dismiss(toastId);
        
        if (result.success) {
          toast.success(`Successfully synced ${result.count || 0} emails`, {
            id: toastId,
          });
          
          if (result.partial) {
            toast.warning(`${result.failed?.length || 0} emails failed to sync`, {
              duration: 5000,
            });
          }
          
          setSyncError(null);
        } else {
          // Check if this is an authentication error
          if (result.requiresReauthentication) {
            setNeedsReauth(true);
            setSyncError("Authentication expired. Please reconnect your account.");
            toast.error("Authentication expired. Please disconnect and reconnect your account.", {
              id: toastId,
              duration: 8000,
            });
          } else {
            setSyncError(result.error || "Failed to sync emails");
            
            // Format error based on type
            let errorMessage = result.error || "Unknown error";
            if (errorMessage.includes("Failed to send a request")) {
              errorMessage = "Connection error: Server may be busy. Please try again in a moment.";
            }
            
            toast.error(`Sync failed: ${errorMessage}`, {
              id: toastId,
              duration: 8000,
            });
          }
        }
      }
    } catch (error) {
      toast.dismiss(toastId);
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      // Format error for display
      let displayError = errorMsg;
      if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
        displayError = "Network error: Could not connect to the server. Please check your connection.";
      }
      
      setSyncError(displayError);
      toast.error(`Error syncing emails: ${displayError}`, {
        id: toastId,
      });
    }
  };
  
  const handleDelete = async () => {
    if (isDisconnecting) return;
    
    if (window.confirm(`Are you sure you want to disconnect ${account.email}?`)) {
      try {
        if (onDelete) {
          onDelete(account.id);
        } else {
          const result = await disconnectEmailAccount(account.id);
          
          if (result.success) {
            toast.success(`Successfully disconnected ${account.email}`);
          } else {
            toast.error(`Failed to disconnect account: ${result.error}`);
          }
        }
      } catch (error) {
        toast.error(`Error disconnecting account: ${error.message}`);
      }
    }
  };
  
  // Format the last sync time
  const lastSyncFormatted = account.last_sync
    ? formatDistanceToNow(new Date(account.last_sync), { addSuffix: true })
    : "Never";
  
  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://www.google.com/s2/favicons?domain=gmail.com&sz=64`} alt="Provider logo" />
              <AvatarFallback>{account.provider.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium">{account.email}</h3>
              <p className="text-sm text-muted-foreground">
                Last synced: {lastSyncFormatted}
              </p>
              
              {syncError && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertTriangle className="inline-block w-4 h-4 mr-1" />
                  {syncError}
                </div>
              )}
              
              {needsReauth && (
                <div className="mt-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="text-xs"
                  >
                    Disconnect & Reconnect
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <RotateCw className="h-4 w-4 mr-1" />
              )}
              Sync
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isSyncing || isDisconnecting}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
