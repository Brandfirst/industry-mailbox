
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

export interface SyncResult {
  success: boolean;
  error?: string;
  count?: number;
  synced?: any[];
  failed?: any[];
  partial?: boolean;
  warning?: string;
  details?: any;
  statusCode?: number;
  timestamp: number;
}

export interface DisconnectResult {
  success: boolean;
  error?: string;
}
