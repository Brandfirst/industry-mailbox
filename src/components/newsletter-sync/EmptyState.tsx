
import { FileX, RefreshCw, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type EmptyStateProps = {
  selectedAccount: string | null;
  isSyncing: boolean;
};

export function EmptyState({ selectedAccount, isSyncing }: EmptyStateProps) {
  return (
    <div className="text-center py-10 space-y-3 bg-white border rounded-md p-8 shadow-sm">
      <div className="flex justify-center">
        <FileX className="h-12 w-12 text-gray-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-800">No emails found</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {selectedAccount
          ? "No emails have been synced from this email account yet. Click the sync button to import emails."
          : "Select an email account to view and manage emails."}
      </p>
      {selectedAccount && (
        <Alert variant="default" className="mt-4 bg-blue-50/50 border-blue-200 max-w-md mx-auto">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm text-blue-700">
            The sync function will now attempt to import all emails from your account, without filtering for just newsletters.
            <br /><br />
            Note: The demo version uses mock data. In production, it would connect to the Gmail API to fetch your actual emails.
          </AlertDescription>
        </Alert>
      )}
      {isSyncing && (
        <div className="flex justify-center items-center mt-4 text-primary">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          <span>Syncing emails...</span>
        </div>
      )}
    </div>
  );
}
