
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon, InfoIcon } from "lucide-react";

type AccountNoticeProps = {
  selectedAccount: string | null;
};

export function AccountNotice({ selectedAccount }: AccountNoticeProps) {
  if (!selectedAccount) {
    return (
      <Alert variant="default" className="mt-4 bg-yellow-50/10 border-yellow-200">
        <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-sm text-yellow-700">
          Select an email account to configure automatic sync settings
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="default" className="mt-4 bg-blue-50/10 border-blue-200">
      <InfoIcon className="h-4 w-4 text-blue-500" />
      <AlertDescription className="text-sm text-blue-700">
        Automatic sync requires that the account remains connected. If authentication expires, 
        you'll need to reconnect the account.
      </AlertDescription>
    </Alert>
  );
}
