// src/components/VendorInformationWrapper.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import VendorInformation from './VendorInformation';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Wrapper component for VendorInformation that handles data management and navigation
 * Responsible for retrieving vendor data from router state or session storage
 * and handling save/discard actions
 */
const VendorInformationWrapper = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const notification = useNotification();
  const [searchParams] = useSearchParams();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Get source route from URL query param if available
  const urlSourceRoute = searchParams.get('from');
  
  // Initialize vendor data state
  const [vendorData, setVendorData] = useState({
    formData: null,
    uploadedInvoice: null,
    sourceRoute: urlSourceRoute || 'newVendor'
  });
  
  // Load data from different sources on component mount
  useEffect(() => {
    console.log("==== VENDOR INFORMATION WRAPPER MOUNTED ====");
    
    // Default empty data structure with fallback values
    const defaultVendorData = {
      vendorName: "New Vendor",
      addressLine1: "",
      city: "",
      state: "",
      country: "India",
      pinCode: "",
      vendorOwner: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneCountry: "+91",
      phoneNumber: "",
      gstin: "",
      pan: ""
    };
    
    let finalData = {
      formData: defaultVendorData,
      uploadedInvoice: null,
      sourceRoute: urlSourceRoute || 'newVendor'
    };
    
    // Try to get data from different sources, in order of precedence
    
    // 1. Check React Router state first
    if (state && state.formData) {
      console.log("Data found in location state:", state);
      finalData = {
        formData: state.formData,
        uploadedInvoice: state.uploadedInvoice,
        sourceRoute: state.sourceRoute || urlSourceRoute || 'newVendor'
      };
    } 
    // 2. Then try session storage (for window.location redirects)
    else {
      try {
        const storedData = sessionStorage.getItem('vendorData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log("Data found in sessionStorage:", parsedData);
          finalData = {
            formData: parsedData.formData || defaultVendorData,
            uploadedInvoice: parsedData.uploadedInvoice,
            sourceRoute: parsedData.sourceRoute || urlSourceRoute || 'newVendor'
          };
          // Clear the session storage to prevent reusing old data
          sessionStorage.removeItem('vendorData');
        } else {
          console.log("No data found in sessionStorage");
        }
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
      }
    }
    
    console.log("Final data for VendorInformation:", finalData);
    setVendorData(finalData);
    setIsDataLoaded(true);
  }, [state, urlSourceRoute]);
  
  // Extract data for convenience
  const { formData, uploadedInvoice, sourceRoute } = vendorData;
  
  // Don't render until data is loaded
  if (!isDataLoaded) {
    return null;
  }
  
  // Handle save changes in VendorInformation
  const handleSaveChanges = (updatedFormData) => {
    try {
      console.log("Saving vendor changes:", updatedFormData);
      
      // Show success notification
      notification.showSuccess('Vendor information updated');
      
      // Navigate back to vendor review with updated data
      navigate('/vendor-review', { 
        state: { 
          formData: updatedFormData, 
          uploadedInvoice, 
          sourceRoute 
        } 
      });
    } catch (error) {
      console.error("Error saving vendor changes:", error);
      notification.showError(`Failed to save: ${error.message || 'Unknown error'}`);
    }
  };
  
  // Handle discard changes in VendorInformation
  const handleDiscardChanges = () => {
    try {
      console.log("Discarding changes, returning with original data");
      
      // Show info notification
      notification.showInfo('Changes discarded');
      
      // Navigate back to vendor review with original data
      navigate('/vendor-review', { 
        state: { 
          formData, 
          uploadedInvoice, 
          sourceRoute 
        } 
      });
    } catch (error) {
      console.error("Error discarding vendor changes:", error);
      notification.showError(`Failed to navigate: ${error.message || 'Unknown error'}`);
    }
  };

  // Return the VendorInformation component with all necessary props
  return (
    <VendorInformation
      initialData={formData}
      uploadedInvoice={uploadedInvoice}
      onSaveChanges={handleSaveChanges}
      onDiscardChanges={handleDiscardChanges}
    />
  );
};

export default VendorInformationWrapper;