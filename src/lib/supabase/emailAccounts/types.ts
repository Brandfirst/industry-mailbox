
// Email accounts type definitions
export interface GoogleOAuthResult {
  success: boolean;
  account?: any;
  error?: string;
  details?: any;
  googleError?: string;
  googleErrorDescription?: string;
  statusCode?: number;
  edgeFunctionError?: string;
  tokenInfo?: any;
}

export interface DisconnectResult {
  success: boolean;
  error?: string;
}

// Re-export sync types for backward compatibility
export * from './sync/types';
