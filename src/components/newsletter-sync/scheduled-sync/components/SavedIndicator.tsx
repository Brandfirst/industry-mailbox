
import React from "react";

type SavedIndicatorProps = {
  hasSaved: boolean;
};

export function SavedIndicator({ hasSaved }: SavedIndicatorProps) {
  if (!hasSaved) {
    return null;
  }
  
  return (
    <div className="text-sm text-green-600 mt-2">
      Schedule saved successfully.
    </div>
  );
}
