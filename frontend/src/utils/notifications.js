// Toast notification utilities that use NotificationContext
import { useNotification } from '../contexts/NotificationContext';

// Event-based notification system
const notificationEvents = {
  SUCCESS: 'toast:success',
  ERROR: 'toast:error',
  INFO: 'toast:info',
  WARNING: 'toast:warning'
};

// Setup event listeners
if (typeof window !== 'undefined') {
  Object.values(notificationEvents).forEach(eventType => {
    window.addEventListener(eventType, (e) => {
      const { message } = e.detail || {};
      if (message && window.notificationHandler) {
        const type = eventType.split(':')[1]; // Extract the type (success, error, etc.)
        window.notificationHandler[type]?.(message);
      }
    });
  });
}

/**
 * Show a success toast notification
 * @param {string} message - The success message to display
 */
export const showSuccess = (message) => {
  dispatchToastEvent(notificationEvents.SUCCESS, message);
};

/**
 * Show an error toast notification
 * @param {string} message - The error message to display
 */
export const showError = (message) => {
  dispatchToastEvent(notificationEvents.ERROR, message);
};

/**
 * Show an info toast notification
 * @param {string} message - The info message to display
 */
export const showInfo = (message) => {
  dispatchToastEvent(notificationEvents.INFO, message);
};

/**
 * Show a warning toast notification
 * @param {string} message - The warning message to display
 */
export const showWarning = (message) => {
  dispatchToastEvent(notificationEvents.WARNING, message);
};

// Helper function to dispatch notification events
function dispatchToastEvent(eventType, message) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventType, {
      detail: { message }
    }));
  } else {
    console.log(`${eventType.split(':')[1].toUpperCase()}: ${message}`);
  }
}

/**
 * Helper hook to initialize the notification utilities with context
 * Call this in your top-level component 
 */
export const useInitNotifications = () => {
  const notificationFunctions = useNotification();
  
  // Register notification handler globally
  if (typeof window !== 'undefined') {
    window.notificationHandler = notificationFunctions;
  }
  
  return notificationFunctions;
};