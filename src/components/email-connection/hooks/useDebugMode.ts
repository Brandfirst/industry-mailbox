
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useDebugMode = (emailAccountsLength: number, redirectUri: string) => {
  const location = useLocation();
  const [showDebug, setShowDebug] = useState(false);
  
  // Enable debug mode if debug parameter is present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const debug = searchParams.get('debug');
    setShowDebug(debug === 'true');
    
    if (debug === 'true') {
      console.log("[DEBUG MODE] Email connection debugging enabled");
      console.log("[DEBUG INFO] Current redirect URI:", redirectUri);
      console.log("[DEBUG INFO] VITE_GOOGLE_CLIENT_ID exists:", !!import.meta.env.VITE_GOOGLE_CLIENT_ID);
      console.log("[DEBUG INFO] Email accounts count:", emailAccountsLength);
    }
  }, [location.search, redirectUri, emailAccountsLength]);
  
  return showDebug;
};
