
import { FileX, RefreshCw } from "lucide-react";

export type EmptyStateProps = {
  selectedAccount: string | null;
  isSyncing: boolean;
};

export function EmptyState({ selectedAccount, isSyncing }: EmptyStateProps) {
  return (
    <div className="text-center py-10 space-y-3">
      <div className="flex justify-center">
        <FileX className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No newsletters found</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        {selectedAccount
          ? "No newsletters have been synced from this email account yet. Click the sync button to import newsletters."
          : "Select an email account to view and manage newsletters."}
      </p>
      {isSyncing && (
        <div className="flex justify-center items-center mt-4 text-primary">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          <span>Syncing newsletters...</span>
        </div>
      )}
    </div>
  );
}
