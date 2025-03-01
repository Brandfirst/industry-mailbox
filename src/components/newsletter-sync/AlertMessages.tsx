
import { AlertCircle, AlertTriangle } from "lucide-react";

type AlertMessagesProps = {
  errorMessage: string | null;
  warningMessage: string | null;
};

export function AlertMessages({ errorMessage, warningMessage }: AlertMessagesProps) {
  return (
    <>
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="text-red-700 font-medium">{errorMessage}</span>
        </div>
      )}
      
      {warningMessage && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 mb-4 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span className="text-yellow-700 font-medium">{warningMessage}</span>
        </div>
      )}
    </>
  );
}
