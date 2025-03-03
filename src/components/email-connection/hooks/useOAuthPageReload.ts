
import { useEffect, useState } from "react";

export const useOAuthPageReload = (setIsConnecting: (value: boolean) => void) => {
  // Check for page reload during OAuth flow
  useEffect(() => {
    const pageReloadHandler = () => {
      // If there's an OAuth flow in progress, save that info to survive page reload
      if (sessionStorage.getItem('gmailOAuthInProgress') === 'true') {
        sessionStorage.setItem('oauth_page_reloaded', 'true');
        console.log("EmailConnectionState: Page reload detected during OAuth flow");
      }
    };

    // Listen for beforeunload events to detect page reloads
    window.addEventListener('beforeunload', pageReloadHandler);
    
    // Check if we're recovering from a page reload
    const pageReloaded = sessionStorage.getItem('oauth_page_reloaded') === 'true';
    if (pageReloaded) {
      console.log("EmailConnectionState: Recovering from page reload during OAuth flow");
      sessionStorage.removeItem('oauth_page_reloaded');
      
      // Don't auto-clear the OAuth state since we're recovering
      setIsConnecting(true);
    }
    
    return () => {
      window.removeEventListener('beforeunload', pageReloadHandler);
    };
  }, [setIsConnecting]);
};
