
import React from 'react';

interface ErrorAlertProps {
  show: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 text-sm">
      <p className="text-amber-700">
        Some content in this newsletter could not be displayed properly due to security restrictions.
      </p>
    </div>
  );
};

export default ErrorAlert;
