
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { debugLog } from "@/lib/utils/content-sanitization/debugUtils";

export const useDebugMode = (emailAccountsLength: number, redirectUri: string) => {
  const location = useLocation();
  const [showDebug, setShowDebug] = useState(false);
  
  // Enable debug mode if debug parameter is present or user is admin
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const debug = searchParams.get('debug');
    
    // Check if user is admin (this could be expanded based on your auth system)
    const isAdmin = localStorage.getItem('user_is_admin') === 'true';
    
    setShowDebug(debug === 'true' || isAdmin);
    
    if (debug === 'true' || isAdmin) {
      debugLog("Email connection debugging enabled");
      debugLog("Current redirect URI:", redirectUri);
      debugLog("VITE_GOOGLE_CLIENT_ID exists:", !!import.meta.env.VITE_GOOGLE_CLIENT_ID);
      debugLog("Email accounts count:", emailAccountsLength);
    }
  }, [location.search, redirectUri, emailAccountsLength]);
  
  return showDebug;
};
