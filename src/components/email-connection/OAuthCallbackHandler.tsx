
import { useOAuthCallback } from "./oauth/useOAuthCallback";
import { OAuthCallbackHandlerProps } from "./oauth/types";

export const OAuthCallbackHandler = ({
  redirectUri,
  onSuccess,
  onError,
  setIsConnecting
}: OAuthCallbackHandlerProps) => {
  // Use the extracted hook to handle OAuth callback logic
  useOAuthCallback(redirectUri, onSuccess, onError, setIsConnecting);

  return null; // This is a functional component with no UI
};
