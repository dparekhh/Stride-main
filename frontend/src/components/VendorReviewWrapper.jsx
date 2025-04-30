// src/components/VendorReviewWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VendorReview from './VendorReview';
import { useNotification } from '../contexts/NotificationContext';
import api, { endpoints } from '../utils/api';

/**
 * Wrapper component for VendorReview that handles data management and navigation
 * Responsible for retrieving vendor data from router state or session storage
 * and handling navigation actions (back, continue/create)
 */
const VendorReviewWrapper = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();
  const [vendorData, setVendorData] = useState({
    formData: {},
    uploadedInvoice: null,
    sourceRoute: "newVendor"
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // On mount, attempt to load vendor data from multiple sources
  useEffect(() => {
    console.log("==== VENDOR REVIEW WRAPPER MOUNTED ====");
    
    // Get data from location state
    const stateData = state || {};
    const { formData: stateFormData, uploadedInvoice: stateInvoice, sourceRoute: stateRoute } = stateData;
    
    console.log("VendorReviewWrapper - received source route:", stateRoute);
    
    // Special handling to prevent loops - if we came from CreateBill, we need to handle differently
    if (stateRoute === "createBill") {
      console.log("⚠️ Detected navigation from CreateBill - handling to prevent loop");
      
      // Clear any conflicting loop-causing flags
      sessionStorage.removeItem('createBillSource');
      sessionStorage.removeItem('forceNavigateToCreateBill');
    }
    
    // Check if we have back navigation data in session storage
    let backNavigationData = null;
    try {
      const vendorDataFromBack = sessionStorage.getItem('backNavigationVendorData');
      const invoiceDataFromBack = sessionStorage.getItem('backNavigationInvoiceData');
      const sourceRouteFromBack = sessionStorage.getItem('backNavigationSourceRoute');
      
      // Check for special back-to-vendor-review data from CreateBill
      const backToVendorReviewData = sessionStorage.getItem('backToVendorReviewData');
      const backToVendorReviewInvoice = sessionStorage.getItem('backToVendorReviewInvoice');
      
      if (backToVendorReviewData) {
        console.log("🔄 Found data from CreateBill back navigation");
        const parsedVendorData = JSON.parse(backToVendorReviewData);
        
        backNavigationData = {
          formData: parsedVendorData,
          uploadedInvoice: backToVendorReviewInvoice ? JSON.parse(backToVendorReviewInvoice) : null,
          sourceRoute: "createBill" // Set special source route to prevent loop
        };
        
        // Clear this storage to prevent reusing
        sessionStorage.removeItem('backToVendorReviewData');
        sessionStorage.removeItem('backToVendorReviewInvoice');
      }
      else if (vendorDataFromBack) {
        console.log("Found back navigation vendor data in sessionStorage");
        const parsedVendorData = JSON.parse(vendorDataFromBack);
        
        backNavigationData = {
          formData: parsedVendorData,
          uploadedInvoice: invoiceDataFromBack ? JSON.parse(invoiceDataFromBack) : null,
          sourceRoute: sourceRouteFromBack || "newVendor"
        };
        
        // Clear session storage to prevent reusing data
        sessionStorage.removeItem('backNavigationVendorData');
        sessionStorage.removeItem('backNavigationInvoiceData');
        sessionStorage.removeItem('backNavigationSourceRoute');
        
        console.log("Back navigation data retrieved:", backNavigationData);
      }
    } catch (backError) {
      console.error("Error retrieving back navigation data from session storage:", backError);
    }
    
    // Check if we have data in session storage (from edit page redirects)
    let sessionData = null;
    try {
      const storedData = sessionStorage.getItem('vendorData');
      if (storedData) {
        sessionData = JSON.parse(storedData);
        // Clear session storage to prevent reusing data
        sessionStorage.removeItem('vendorData');
      }
    } catch (error) {
      console.error("Error retrieving data from session storage:", error);
    }
    
    // Determine which data source to use
    let finalData = {
      formData: {},
      uploadedInvoice: null,
      sourceRoute: "newVendor"
    };
    
    // Set priority: back navigation > router state > session storage
    if (backNavigationData && backNavigationData.formData) {
      console.log("Using data from back navigation");
      finalData = backNavigationData;
    } else if (stateFormData && Object.keys(stateFormData).length > 0) {
      // Router state takes precedence after back navigation
      console.log("Using data from router state");
      finalData = {
        formData: stateFormData,
        uploadedInvoice: stateInvoice,
        sourceRoute: stateRoute || "newVendor"
      };
    } else if (sessionData && sessionData.formData) {
      // Then try session storage
      console.log("Using data from session storage");
      finalData = sessionData;
    }
    
    console.log("Final vendor data:", finalData);
    setVendorData(finalData);
    setIsDataLoaded(true);
  }, [state]);
  
  // Extract data for convenience
  const { formData, uploadedInvoice, sourceRoute } = vendorData;
  
  // If no data is loaded yet, don't render anything
  if (!isDataLoaded) {
    return null;
  }
  
  // SPECIAL CASE: If we're coming from the X button on CreateBill,
  // we might have ONLY an invoice preview without formData
  if (uploadedInvoice && (!formData || Object.keys(formData).length === 0)) {
    console.log("We have an invoice preview but no form data - this is likely from X button click");
    console.log("Rendering the VendorReview component with just the invoice preview");
    
    // Create a minimal formData to prevent errors
    const minimalFormData = {
      vendorName: "Select a vendor",
      id: "temp-" + Date.now()
    };
    
    // Update the state to include this minimal data
    setVendorData(prev => ({
      ...prev,
      formData: minimalFormData
    }));
    
    // We'll continue rendering with the minimal data
    return (
      <VendorReview
        formData={minimalFormData}
        uploadedInvoice={uploadedInvoice}
        sourceRoute="newVendor"
        onBack={handleBack}
        onContinue={handleContinue}
        isSubmitting={isSubmitting}
      />
    );
  }
  
  // Standard case: If no formData is provided, redirect to the create-bill page
  if (!formData || Object.keys(formData).length === 0) {
    console.log("No vendor data found, redirecting to create-bill");
    // Always redirect to create-bill regardless of the source route
    navigate("/create-bill");
    return null;
  }
  
  // Handle back button in VendorReview
  const handleBack = () => {
    console.log("⬅️ BACK BUTTON EXPLICITLY TRIGGERED");
    console.log(`Source route when back button clicked: ${sourceRoute}`);
    console.log("handleBack function called - this should ONLY happen when back arrow is clicked");
    
    // Set a flag that this is a back button navigation
    sessionStorage.setItem('backButtonClicked', 'true');
    sessionStorage.setItem('backButtonClickedTimestamp', new Date().toISOString());
    
    // For back navigation, store the current data in session storage
    // so if user goes back then forward again, data is preserved
    try {
      sessionStorage.setItem('backNavigationVendorData', JSON.stringify(formData));
      
      // Enhanced invoice data handling for back navigation
      if (uploadedInvoice) {
        try {
          // Identify what data we can safely serialize
          const serializableInvoice = {};
          
          // Extract serializable properties from the invoice data
          Object.keys(uploadedInvoice).forEach(key => {
            // Skip non-serializable objects/content
            if (key === 'file' || key === 'blob' || 
                (uploadedInvoice[key] instanceof File) || 
                (uploadedInvoice[key] instanceof Blob)) {
              console.log(`Skipping non-serializable invoice property: ${key}`);
              return;
            }
            
            // Extract extractedData if available
            if (key === 'extractedData' && uploadedInvoice.extractedData) {
              serializableInvoice.extractedData = { ...uploadedInvoice.extractedData };
            } else {
              // Copy primitive values and serializable objects
              serializableInvoice[key] = uploadedInvoice[key];
            }
          });
          
          console.log("Preparing serializable invoice data for back navigation:", 
            Object.keys(serializableInvoice));
          
          // Store the serializable portion
          sessionStorage.setItem('backNavigationInvoiceData', 
            JSON.stringify(serializableInvoice));
            
          console.log("Successfully stored serializable invoice data for back navigation");
        } catch (invoiceError) {
          console.error("Error serializing invoice data for back navigation:", invoiceError);
          // Store a simplified reference with minimal necessary data
          const minimalInvoiceData = {
            preview: uploadedInvoice.preview || uploadedInvoice.fileUrl || uploadedInvoice.image || null,
            fileUrl: uploadedInvoice.fileUrl || null,
            invoiceNumber: uploadedInvoice.invoiceNumber || 
              (uploadedInvoice.extractedData ? uploadedInvoice.extractedData.invoice_number : null)
          };
          sessionStorage.setItem('backNavigationInvoiceData', JSON.stringify(minimalInvoiceData));
          console.log("Stored minimal invoice reference for back navigation");
        }
      }
      
      sessionStorage.setItem('backNavigationSourceRoute', sourceRoute);
      console.log("Stored back navigation data in session storage");
    } catch (error) {
      console.error("Error storing back navigation data:", error);
    }
    
    // Determine where to navigate based on source route
    let destination = "";
    if (sourceRoute === "newBill") {
      // Use consistent path variable to prevent JavaScript compilation issues
      const createBillPath = "/create-bill";
      destination = createBillPath;
      console.log(`⬅️ Back button: Navigating back to Create Bill (${destination}) from existing vendor selection`);
      navigate(destination, { 
        state: { 
          uploadedInvoice,
          comingFromBack: true, // Flag to indicate this is a back navigation
          timestamp: new Date().toISOString()
        } 
      });
    } else {
      destination = "/new-vendor";
      console.log(`⬅️ Back button: Navigating back to New Vendor form (${destination})`);
      navigate(destination, { 
        state: { 
          formData, 
          uploadedInvoice,
          edit: true, // Signal that we're editing an existing form
          comingFromBack: true, // Flag to indicate this is a back navigation
          timestamp: new Date().toISOString()
        } 
      });
    }
    console.log(`handleBack triggered, navigating to ${destination}`);
  };

  // Handle continue/create button in VendorReview
  const handleContinue = async () => {
    console.log("======= HANDLE CONTINUE BUTTON CLICKED =======");
    console.log("Button clicked in VendorReviewWrapper with sourceRoute:", sourceRoute);
    console.log("Current form data:", formData);
    console.log("Current uploaded invoice:", uploadedInvoice);
    
    // Start loading state immediately
    setIsSubmitting(true);
    
    try {
      // Log source route for debugging
      console.log(`⚠️ Current sourceRoute: ${sourceRoute}`);
      
      // Force direct navigation to CreateBill regardless of source route or button clicked
      // This ensures consistent navigation from both "Continue" and "Create Vendor" buttons
      console.log("✅ FORCE NAVIGATION TO CREATE BILL regardless of button or source:", formData);
      
      // Using a longer timeout to ensure the loading state is visible for user feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show progress notification for vendor flow
      if (sourceRoute === "newVendor") {
        notification.showSuccess('Creating vendor and proceeding to bill creation...', {
          autoClose: true,
          duration: 3000
        });
      } else if (sourceRoute === "newVendorCreated") {
        notification.showSuccess('Proceeding to bill creation with new vendor...', {
          autoClose: true,
          duration: 3000
        });
      } else {
        notification.showSuccess('Continuing with vendor details...', {
          autoClose: true,
          duration: 3000
        });
      }
      
      // Clear any test mode flags
      sessionStorage.removeItem('existing_vendor_test_mode');
      sessionStorage.removeItem('vendor_test_mode');
      
      // Prepare serializable invoice data
      let serializableInvoice = null;
      if (uploadedInvoice) {
        try {
          serializableInvoice = {};
          
          // Extract serializable properties from the invoice data
          Object.keys(uploadedInvoice).forEach(key => {
            // Skip non-serializable objects/content
            if (key === 'file' || key === 'blob' || 
                (uploadedInvoice[key] instanceof File) || 
                (uploadedInvoice[key] instanceof Blob)) {
              console.log(`Skipping non-serializable invoice property: ${key}`);
              return;
            }
            
            // Extract extractedData if available
            if (key === 'extractedData' && uploadedInvoice.extractedData) {
              serializableInvoice.extractedData = { ...uploadedInvoice.extractedData };
            } else {
              // Copy primitive values and serializable objects
              serializableInvoice[key] = uploadedInvoice[key];
            }
          });
          
          console.log("Prepared serializable invoice data:", Object.keys(serializableInvoice));
        } catch (error) {
          console.error("Error preparing serializable invoice:", error);
          serializableInvoice = {
            preview: uploadedInvoice.preview || uploadedInvoice.fileUrl || uploadedInvoice.image || null,
            fileUrl: uploadedInvoice.fileUrl || null,
            invoiceNumber: uploadedInvoice.invoiceNumber || 
              (uploadedInvoice.extractedData ? uploadedInvoice.extractedData.invoice_number : null)
          };
        }
      }
      
      // Force clearing ALL navigation flags to prevent conflicts
      sessionStorage.removeItem('showNewBill');
      sessionStorage.removeItem('showVendorReview');
      sessionStorage.removeItem('createBillSourceRoute');
      sessionStorage.removeItem('backButtonClicked');
      sessionStorage.removeItem('backButtonClickedTimestamp');
      sessionStorage.removeItem('lastButtonClicked');
      
      // Set a strong flag to force navigation to Create Bill
      sessionStorage.setItem('forceNavigateToCreateBill', 'true');
      sessionStorage.setItem('createBillSource', 'vendorReview');
      sessionStorage.setItem('buttonClickTimestamp', new Date().toISOString());
      
      // Log what we're about to do
      // Use consistent path variable to prevent JavaScript compilation issues
      const createBillPath = "/create-bill";
      console.log(`🚀 DIRECT NAVIGATION to ${createBillPath} with vendor and invoice data`);
      
      // Simplify the navigation process by standardizing on one approach
      // Generate a unique transition ID to ensure state uniqueness
      const transitionId = `vendorReview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log("Navigating to CreateBill with React Router and detailed state");
      
      // Store backup data in sessionStorage as a fallback
      try {
        sessionStorage.setItem('vendorData', JSON.stringify(formData));
        sessionStorage.setItem('invoiceData', JSON.stringify(serializableInvoice));
        sessionStorage.setItem('createBillTransitionId', transitionId);
        sessionStorage.setItem('navigationMethod', 'router');
      } catch (storageError) {
        console.error("Error storing data in sessionStorage:", storageError);
      }
      
      // Use direct React Router navigation with detailed state
      navigate(createBillPath, {
        state: {
          vendorData: formData,
          uploadedInvoice: serializableInvoice,
          sourceRoute: 'vendorReview',
          fromVendorReview: true,
          timestamp: new Date().toISOString(),
          transitionId
        },
        replace: true // Use replace to prevent back-button issues
      });
      
      console.log(`Navigation to ${createBillPath} triggered via React Router`);
      
    } catch (error) {
      console.error("Error in handleContinue:", error);
      notification.showError("Failed to proceed. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  // Render the VendorReview component with required props
  return (
    <VendorReview
      formData={formData}
      uploadedInvoice={uploadedInvoice}
      onBack={handleBack}
      onContinue={handleContinue}
      isSubmitting={isSubmitting}
      sourceRoute={sourceRoute}
    />
  );
};

export default VendorReviewWrapper;