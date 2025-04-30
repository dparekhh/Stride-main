// Handle continue/create button in VendorReview
const handleContinue = async () => {
  console.log("======= HANDLE CONTINUE BUTTON CLICKED =======");
  console.log("Button clicked in VendorReviewWrapper with sourceRoute:", sourceRoute);
  console.log("Current form data:", formData);
  console.log("Current uploaded invoice:", uploadedInvoice);
  
  setIsSubmitting(true);
  
  try {
    // Log source route for debugging
    console.log(`⚠️ Current sourceRoute: ${sourceRoute}`);
    console.log(`⚠️ Source route in state: ${location?.state?.sourceRoute}`);
    
    // Always navigate to create-bill regardless of sourceRoute
    console.log("✅ Continuing to create bill with vendor:", formData);
    
    // Show success notification for vendor flow
    notification.showSuccess('Continuing with vendor details');
    
    // Remove any test mode values from session storage that might be causing issues
    sessionStorage.removeItem('existing_vendor_test_mode');
    sessionStorage.removeItem('vendor_test_mode');
    
    // Use sessionStorage for consistent behavior with all navigation paths
    try {
      // Store the complete formData object
      sessionStorage.setItem('pendingVendorData', JSON.stringify(formData));
      
      // Enhanced invoice data handling for forward navigation
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
          
          console.log("Preparing serializable invoice data:", Object.keys(serializableInvoice));
          
          // Store the serializable portion
          sessionStorage.setItem('pendingInvoiceData', JSON.stringify(serializableInvoice));
            
          console.log("Successfully stored serializable invoice data");
        } catch (invoiceError) {
          console.error("Error serializing invoice data:", invoiceError);
          // Store a simplified reference with minimal necessary data
          const minimalInvoiceData = {
            preview: uploadedInvoice.preview || uploadedInvoice.fileUrl || uploadedInvoice.image || null,
            fileUrl: uploadedInvoice.fileUrl || null,
            invoiceNumber: uploadedInvoice.invoiceNumber || 
              (uploadedInvoice.extractedData ? uploadedInvoice.extractedData.invoice_number : null)
          };
          sessionStorage.setItem('pendingInvoiceData', JSON.stringify(minimalInvoiceData));
          console.log("Stored minimal invoice reference");
        }
      }
      
      // Set consistent source route
      sessionStorage.setItem('pendingSourceRoute', 'existingVendor');
      
      console.log("Vendor data stored in sessionStorage:", formData);
      console.log("Redirecting to CreateBill...");
      
      // First, clear any potentially conflicting sessionStorage values
      sessionStorage.removeItem('showNewBill');
      sessionStorage.removeItem('showVendorReview');
      
      // Set a direct flag that we want to force navigation
      sessionStorage.setItem('forceNavigateToCreateBill', 'true');
      
      // Force navigation to create-bill path
      console.log("Navigating to /create-bill with state:", {
        vendorData: formData, 
        uploadedInvoice,
        sourceRoute: 'existingVendor'
      });
      
      // Add a slight delay to ensure storage operations complete
      setTimeout(() => {
        navigate("/create-bill", {
          state: {
            vendorData: formData,
            uploadedInvoice,
            sourceRoute: 'existingVendor'
          },
          replace: true // Force replace instead of push to avoid history conflicts
        });
        
        // Log navigation attempt for debugging
        console.log("Navigation to /create-bill triggered at:", new Date().toISOString());
      }, 100);
    } catch (storageError) {
      console.error("Error storing vendor data in sessionStorage:", storageError);
      
      // Fallback to direct navigation if sessionStorage fails
      console.log("Fallback: Navigating to /create-bill with state:", {
        vendorData: formData,
        uploadedInvoice,
        sourceRoute: "existingVendor"
      });
      
      navigate("/create-bill", { 
        state: { 
          vendorData: formData,
          uploadedInvoice,
          sourceRoute: "existingVendor" // Track that we came from Review Existing Vendor
        } 
      });
    }
  } catch (error) {
    console.error("Error in handleContinue:", error);
    notification.showError(`Error: ${error.message || 'An unexpected error occurred'}`);
    setIsSubmitting(false);
  }
};