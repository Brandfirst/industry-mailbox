
import { Mail, Tag } from "lucide-react";

type EmptyStateProps = {
  type: "noAccounts" | "noNewsletters";
};

export function EmptyState({ type }: EmptyStateProps) {
  if (type === "noAccounts") {
    return (
      <div className="text-center py-8">
        <Mail className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold">No email accounts connected</h3>
        <p className="mt-1 text-sm text-gray-500">
          Connect an email account to start importing newsletters
        </p>
      </div>
    );
  }
  
  return (
    <div className="text-center py-12">
      <Tag className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold">No newsletters found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try syncing your account or select a different email account
      </p>
    </div>
  );
}
