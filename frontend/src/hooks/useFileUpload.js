import { useCallback, useState } from 'react';
import axios from 'axios';

/**
 * Custom hook for handling file uploads and data extraction
 * 
 * @param {Function} setUploadedInvoice - Function to set the uploaded invoice state
 * @param {Object} notificationContext - Context for displaying notifications
 * @returns {Object} Object containing handleFileUpload function and loading state
 */
export const useFileUpload = (setUploadedInvoice, notificationContext) => {
  const [loading, setLoading] = useState(false);
  // Keep track of notification ID to close it later
  const [processingNotificationId, setProcessingNotificationId] = useState(null);

  const handleFileUpload = useCallback(async (file) => {
    console.log("handleFileUpload called with file:", file?.name);
    if (!file) {
      console.error("No file provided to handleFileUpload");
      return;
    }

    // File type validation
    const acceptedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const fileType = file.type.toLowerCase();
    if (!acceptedFileTypes.includes(fileType)) {
      notificationContext.showError(`Unsupported file type: ${fileType}. Please use PDF, JPEG, or PNG.`);
      return;
    }

    // Create preview URL
    const fileURL = URL.createObjectURL(file);
    
    setLoading(true);
    
    try {
      console.log("Preparing file upload...");
      
      // Create a data structure with initial file data
      // This shows the preview immediately while data extraction happens in the background
      setUploadedInvoice({
        file: file,
        preview: fileURL,
        name: file.name,
        extractedData: null, // Will be populated after processing
        processing: true
      });
      
      // Clear any previous notifications that might be hanging around
      if (processingNotificationId) {
        notificationContext.closeNotification(processingNotificationId);
      }
      
      // Create FormData with the correct parameter name
      const formData = new FormData();
      formData.append('invoice', file);  // This must match what the backend expects
      
      console.log("Sending file to API...");
      
      // Show the upload success notification - just one simple message
      // This is the only place we want to show a notification about the upload
      const notificationId = notificationContext.showSuccess("File successfully uploaded!");
      setProcessingNotificationId(notificationId);
      
      // Send to the OCR processing endpoint
      const response = await axios.post('/api/ocr/upload-invoice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 60 second timeout for document processing
      });
      
      console.log("API Response received:", response.status);
      
      // Ensure we got a successful response
      if (response.status !== 200) {
        throw new Error(`API returned status code ${response.status}`);
      }
      
      // API returns standardized data structure
      const responseData = response.data;
      
      if (!responseData.success) {
        throw new Error(responseData.message || "API returned an error");
      }
      
      console.log("Processing extracted data...");
      
      // Extract the main data from the response
      const extractedData = responseData.data?.extracted_data || {};
      
      // Get vendor information from the response
      const vendorExists = responseData.data?.vendor_exists || false;
      const vendorDetails = responseData.data?.vendor_details || null;
      
      // Map API response to the format expected by the UI
      const mappedData = {
        invoice_number: extractedData.invoice_number || '',
        invoice_date: extractedData.invoice_date || '',
        due_date: extractedData.due_date || '',
        total_amount: extractedData.total_amount || 0,
        tax_amount: extractedData.tax_amount || 0,
        vendor_name: extractedData.vendor_name || '',
        vendor_gstin: extractedData.vendor_gstin || '',
        line_items: extractedData.line_items || [],
        // Add vendor identification information
        vendor_exists: vendorExists,
        vendor_details: vendorDetails
      };

      // Update the invoice with extracted data
      setUploadedInvoice(prevState => ({
        ...prevState,
        extractedData: mappedData,
        processing: false
      }));
      
      // Note: We no longer use setShowNewBill for navigation
      // Instead, we let App.jsx handle all navigation via the React Router
      // The fileUploaded event will trigger handleFileUploaded in App.jsx
      // which will handle navigation to the /new-bill route
      console.log("File processing complete - App.jsx will handle navigation to /new-bill route");
      
      // Dispatch navigation event for App.jsx to handle
      window.dispatchEvent(new CustomEvent('fileProcessingComplete', { 
        detail: { success: true, source: 'useFileUpload-success' }
      }));
    } 
    catch (error) {
      console.error("Error processing file:", error);
      
      // Handle specific error cases
      if (error.response) {
        // The request was made and the server responded with an error status
        console.error("Server error response:", error.response.data);
        notificationContext.showError(`Server error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        notificationContext.showError("No response from server. Please check your connection.");
      } else {
        // Something else happened while setting up the request
        notificationContext.showError(`Error: ${error.message}`);
      }
      
      // Still show the preview but mark that processing failed
      setUploadedInvoice(prevState => ({
        ...prevState,
        processing: false,
        processingError: true
      }));
      
      // Note: We no longer use setShowNewBill for navigation
      // Instead, we let App.jsx handle all navigation via the React Router
      // The fileUploaded event will trigger handleFileUploaded in App.jsx
      // which will handle navigation to the /new-bill route even on error
      console.log("File processing failed - App.jsx will handle navigation to /new-bill route");
      
      // Dispatch navigation event for App.jsx to handle
      window.dispatchEvent(new CustomEvent('fileProcessingComplete', { 
        detail: { success: false, error: error.message, source: 'useFileUpload-error' }
      }));
    } 
    finally {
      setLoading(false);
    }
  }, [setUploadedInvoice, notificationContext]);

  return { handleFileUpload, loading };
};