// frontend/src/components/RouteLogger.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Component that logs route changes to help with debugging navigation issues
 * This component should be placed high in the component tree, ideally in App.jsx
 * Press Ctrl+Shift+D to show debug tools
 */
const RouteLogger = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDebugTools, setShowDebugTools] = useState(false);

  useEffect(() => {
    // Log route change with detailed information
    console.log("****************************************");
    console.log("🔄 ROUTE CHANGE DETECTED");
    console.log("Current path:", location.pathname);
    console.log("State data:", location.state ? JSON.stringify(location.state) : "None");
    console.log("Navigation timestamp:", new Date().toISOString());
    
    // Check for query parameters
    if (location.search) {
      console.log("Query parameters:", location.search);
    }
    
    // Check session storage for navigation-related flags
    try {
      const navigationFlags = {
        showNewBill: sessionStorage.getItem('showNewBill'),
        showVendorReview: sessionStorage.getItem('showVendorReview'),
        forceNavigateToCreateBill: sessionStorage.getItem('forceNavigateToCreateBill'),
        backButtonClicked: sessionStorage.getItem('backButtonClicked'),
        backButtonTimestamp: sessionStorage.getItem('backButtonTimestamp'),
        emergencyNavigation: sessionStorage.getItem('emergencyNavigation'),
        emergencyNavigationReason: sessionStorage.getItem('emergencyNavigationReason'),
        createBillSourceRoute: sessionStorage.getItem('createBillSourceRoute'),
        pendingSourceRoute: sessionStorage.getItem('pendingSourceRoute')
      };
      
      // Only log flags that exist
      Object.entries(navigationFlags).forEach(([key, value]) => {
        if (value) {
          console.log(`Navigation flag ${key}:`, value);
        }
      });
    } catch (error) {
      console.error("Error reading sessionStorage in RouteLogger:", error);
    }
    
    // Add keyboard shortcut: Ctrl+Shift+D to show debug tools
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDebugTools(prev => !prev);
        console.log("Debug tools visibility toggled:", !showDebugTools);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Return cleanup function
    return () => {
      console.log(`Navigating away from ${location.pathname}`);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [location, showDebugTools]);

  // Direct navigation to BillReview for debugging
  const goToBillReview = () => {
    console.log("MANUAL DEBUG: Direct navigation to /bill-review");
    navigate('/bill-review');
  };
  
  // Direct navigation to Create Bill
  const goToCreateBill = () => {
    console.log("MANUAL DEBUG: Direct navigation to /create-bill");
    navigate('/create-bill');
  };
  
  // Force direct navigation with window.location
  const forceNavToBillReview = () => {
    console.log("MANUAL DEBUG: Forcing navigation to /bill-review with location.href");
    window.location.href = "/bill-review";
  };

  if (!showDebugTools) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      padding: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div>Current Path: <strong>{location.pathname}</strong></div>
      <div style={{ marginTop: '8px' }}>Debug Navigation:</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        <button
          style={{
            background: '#3498db',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '12px'
          }}
          onClick={goToBillReview}
        >
          Go to Bill Review (navigate)
        </button>
        <button
          style={{
            background: '#e74c3c',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '12px'
          }}
          onClick={forceNavToBillReview}
        >
          Force Go to Bill Review (location.href)
        </button>
        <button
          style={{
            background: '#2ecc71',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '12px'
          }}
          onClick={goToCreateBill}
        >
          Go to Create Bill
        </button>
        <button
          style={{
            background: '#7f8c8d',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '12px'
          }}
          onClick={() => setShowDebugTools(false)}
        >
          Hide Debug Tools
        </button>
      </div>
    </div>
  );
};

export default RouteLogger;