
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center">
      <AlertTriangle className="h-5 w-5 mr-2" />
      <span>{error}</span>
    </div>
  );
};

export default ErrorState;
