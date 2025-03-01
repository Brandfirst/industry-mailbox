
import { RefreshCw } from "lucide-react";

export function LoadingState() {
  return (
    <div className="py-32 flex justify-center items-center">
      <RefreshCw className="animate-spin h-8 w-8 text-primary" />
    </div>
  );
}
