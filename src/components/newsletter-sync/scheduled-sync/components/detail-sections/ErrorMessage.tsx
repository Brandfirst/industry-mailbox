
import React from "react";

interface ErrorMessageProps {
  errorMessage: string | null;
}

export function ErrorMessage({ errorMessage }: ErrorMessageProps) {
  if (!errorMessage) return null;
  
  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <div className="text-gray-600 mb-1">Error:</div>
      <div className="text-red-600 break-words">{errorMessage}</div>
    </div>
  );
}
