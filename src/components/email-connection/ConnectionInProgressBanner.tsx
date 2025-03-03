
interface ConnectionInProgressBannerProps {
  show: boolean;
}

export const ConnectionInProgressBanner = ({ show }: ConnectionInProgressBannerProps) => {
  if (!show) return null;
  
  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 mb-4 rounded-md">
      <p className="font-medium">Connecting your Gmail account...</p>
      <p className="text-sm mt-1">This may take a moment. If nothing happens after 15 seconds, please try again.</p>
    </div>
  );
};
