
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
      <h3 className="text-lg font-medium text-gray-800">No newsletters found</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {selectedAccount
          ? "No newsletters have been synced from this email account yet. Click the sync button to import newsletters."
          : "Select an email account to view and manage newsletters."}
      </p>
      {selectedAccount && (
        <Alert variant="default" className="mt-4 bg-blue-50/50 border-blue-200 max-w-md mx-auto">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm text-blue-700">
            If you know there are newsletters in your account but none appear after syncing, they may not match the system's criteria for newsletters. Currently, we look for email messages that appear to be newsletters based on their content and format.
          </AlertDescription>
        </Alert>
      )}
      {isSyncing && (
        <div className="flex justify-center items-center mt-4 text-primary">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          <span>Syncing newsletters...</span>
        </div>
      )}
    </div>
  );
}
