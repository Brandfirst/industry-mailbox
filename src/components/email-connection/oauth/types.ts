
export interface OAuthCallbackHandlerProps {
  redirectUri: string;
  onSuccess: () => Promise<void>;
  onError: (error: string, details?: any, debugInfo?: any) => void;
  setIsConnecting: (isConnecting: boolean) => void;
}

export interface OAuthCallbackResult {
  success: boolean;
  error?: string;
  details?: any;
  debugInfo?: any;
}
