import React, { createContext, useContext, useReducer } from 'react';

// Create context
const NotificationContext = createContext();

// Generate unique ID for notifications
const generateUniqueId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Notification reducer to manage state
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [...state, {
        id: action.payload.id || generateUniqueId(),
        type: action.payload.type,
        message: action.payload.message,
        actionLabel: action.payload.actionLabel,
        onAction: action.payload.onAction,
        autoClose: action.payload.autoClose,
        duration: action.payload.duration
      }];
    case 'REMOVE_NOTIFICATION':
      return state.filter(notification => notification.id !== action.payload);
    case 'CLEAR_ALL_NOTIFICATIONS':
      return [];
    default:
      return state;
  }
};

// NotificationProvider component
export const NotificationProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  // Add a new notification with optional action and return its ID
  const addNotification = (type, message, options = {}) => {
    const { actionLabel, onAction, autoClose, duration } = options;
    const notificationId = generateUniqueId();
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { 
        id: notificationId,
        type, 
        message, 
        actionLabel, 
        onAction, 
        autoClose, 
        duration 
      }
    });
    
    return notificationId;
  };

  // Remove a notification by ID
  const removeNotification = (id) => {
    dispatch({
      type: 'REMOVE_NOTIFICATION',
      payload: id
    });
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  // Helper functions for common notification types
  const showSuccess = (message, options = {}) => addNotification('success', message, options);
  const showError = (message, options = {}) => addNotification('error', message, options);
  const showWarning = (message, options = {}) => addNotification('warning', message, options);
  const showInfo = (message, options = {}) => addNotification('info', message, options);
  
  // Action-specific helpers
  const showActionableSuccess = (message, actionLabel, onAction) => {
    showSuccess(message, { 
      actionLabel, 
      onAction, 
      autoClose: true,
      duration: 2500 // Auto-dismiss after 2.5 seconds
    });
  };
  
  // Test function to show all notification types
  const testAllNotifications = () => {
    showSuccess('Operation completed successfully');
    setTimeout(() => showInfo('Here is some helpful information'), 300);
    setTimeout(() => showWarning('Please note this important warning'), 600);
    setTimeout(() => showError('An error occurred during the operation'), 900);
    setTimeout(() => showActionableSuccess('Vendor created successfully', 'Continue to Bill', () => {
      console.log('Action button clicked');
    }), 1200);
  };

  // Alias for removeNotification for better API clarity
  const closeNotification = (id) => {
    if (id) {
      removeNotification(id);
    }
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        closeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showActionableSuccess,
        testAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;