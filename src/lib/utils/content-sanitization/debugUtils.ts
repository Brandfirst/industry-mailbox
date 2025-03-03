
/**
 * Debug utilities for content sanitization
 * These utilities help with conditional logging for admins
 */

// Check if the current user is in debug mode
// This can be determined by URL parameter or admin status
export const isInDebugMode = (): boolean => {
  // Check for ?debug=true in URL (for admin debug access)
  const urlParams = new URLSearchParams(window.location.search);
  const debugParam = urlParams.get('debug');
  
  // Additional ways to check for admin status
  // For this app, we'll check for a user_is_admin flag in localStorage
  // This should be set by the auth system when a user with admin privileges logs in
  const isAdminUser = localStorage.getItem('user_is_admin') === 'true';
  
  return debugParam === 'true' || isAdminUser;
};

/**
 * Conditionally log messages only when in debug mode
 * This prevents cluttering the console for regular users
 */
export const debugLog = (message: string, data?: any): void => {
  if (!isInDebugMode()) return;
  
  if (data) {
    console.log(`[DEBUG] ${message}`, data);
  } else {
    console.log(`[DEBUG] ${message}`);
  }
};

