/**
 * Development Helper Utilities
 * 
 * This file contains utilities that are only intended for development/testing use.
 * These helpers should never interfere with production code.
 */

/**
 * Determines if the application is running in development mode
 * @returns {boolean} true if in development mode
 */
export const isDevelopmentMode = () => {
  // Check for development environments
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('replit.dev') ||
    window.location.hostname.includes('.repl.co')
  );
};

/**
 * Reset authentication state for development testing
 * This function clears localStorage and sessionStorage and redirects to signup
 */
export const resetAuthForTesting = () => {
  if (!isDevelopmentMode()) {
    console.warn('Auth reset attempted in production environment - operation blocked');
    return;
  }
  
  console.log('🧪 DEV: Clearing auth state for testing');
  
  // Clear all localStorage items
  localStorage.clear();
  
  // Clear all sessionStorage items
  sessionStorage.clear();
  
  // Log the cleanup
  console.log('🧪 DEV: Storage cleared, redirecting to signup page');
  
  // Redirect to signup
  window.location.href = '/signup';
};