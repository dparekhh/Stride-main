// src/components/SharedInvoicePreview.jsx
import React, { useState, useEffect } from "react";
import { FileText, FileImage, File } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner.jsx";

/**
 * Shared invoice preview component used across all billing flows
 * to maintain consistent UI and behavior for document previews
 * 
 * Enhanced to handle multiple invoice data formats across different components
 * in the navigation chain: BillManager → NewBill → VendorReview → CreateBill
 */
const SharedInvoicePreview = ({ uploadedInvoice }) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [previewError, setPreviewError] = useState(false);
  const [invoiceIdentifier, setInvoiceIdentifier] = useState(null);

  // Debug the invoice data structure on mount and when it changes
  useEffect(() => {
    console.log("========== SHARED INVOICE PREVIEW COMPONENT ==========");
    console.log("SharedInvoicePreview - Received invoice data:", !!uploadedInvoice);
    
    if (uploadedInvoice) {
      console.log("SharedInvoicePreview - Invoice data type:", typeof uploadedInvoice);
      
      // Extract an identifier for debugging purposes
      let identifier = null;
      try {
        // Try to get invoice number from different possible locations
        if (uploadedInvoice.extractedData && uploadedInvoice.extractedData.invoice_number) {
          identifier = uploadedInvoice.extractedData.invoice_number;
        } else if (uploadedInvoice.invoice_number) {
          identifier = uploadedInvoice.invoice_number;
        } else if (uploadedInvoice.invoiceNumber) {
          identifier = uploadedInvoice.invoiceNumber;
        } else if (uploadedInvoice.id) {
          identifier = `ID: ${uploadedInvoice.id}`;
        } else if (uploadedInvoice.file && uploadedInvoice.file.name) {
          identifier = uploadedInvoice.file.name;
        } else if (uploadedInvoice.fileName) {
          identifier = uploadedInvoice.fileName;
        } else if (uploadedInvoice.name) {
          identifier = uploadedInvoice.name;
        } else {
          identifier = "Unknown invoice";
        }
        setInvoiceIdentifier(identifier);
        console.log("SharedInvoicePreview - Identified invoice:", identifier);
      } catch (error) {
        console.error("Error extracting invoice identifier:", error);
      }
      
      // Analyze the data structure
      if (typeof uploadedInvoice === 'object') {
        console.log("SharedInvoicePreview - Invoice data structure keys:", Object.keys(uploadedInvoice));
        
        // Log common expected fields
        const extractedData = uploadedInvoice.extractedData || uploadedInvoice;
        console.log("SharedInvoicePreview - Top level properties:", {
          hasPreview: !!uploadedInvoice.preview,
          hasFile: !!uploadedInvoice.file,
          hasFileUrl: !!uploadedInvoice.fileUrl,
          hasExtractedData: !!uploadedInvoice.extractedData,
          hasImage: !!uploadedInvoice.image,
          hasBlob: !!uploadedInvoice.blob,
          hasUrl: !!uploadedInvoice.url
        });
        
        if (uploadedInvoice.extractedData) {
          console.log("SharedInvoicePreview - extractedData properties:", {
            keys: Object.keys(uploadedInvoice.extractedData),
            hasFileUrl: !!uploadedInvoice.extractedData.fileUrl,
            hasImage: !!uploadedInvoice.extractedData.image,
            hasPreview: !!uploadedInvoice.extractedData.preview,
            hasUrl: !!uploadedInvoice.extractedData.url,
            hasImageUrl: !!uploadedInvoice.extractedData.imageUrl
          });
        }
      }
      
      // Determine the best preview URL to use
      let url = null;
      
      // Try different common paths for preview URL - expanded to handle more variants
      if (uploadedInvoice.preview) {
        url = uploadedInvoice.preview;
        console.log("SharedInvoicePreview - Using preview property");
      } else if (uploadedInvoice.fileUrl) {
        url = uploadedInvoice.fileUrl;
        console.log("SharedInvoicePreview - Using fileUrl property");
      } else if (uploadedInvoice.image) {
        url = uploadedInvoice.image;
        console.log("SharedInvoicePreview - Using image property");
      } else if (uploadedInvoice.blob) {
        url = URL.createObjectURL(uploadedInvoice.blob);
        console.log("SharedInvoicePreview - Created URL from blob");
      } else if (uploadedInvoice.url) {
        url = uploadedInvoice.url;
        console.log("SharedInvoicePreview - Using url property");
      } else if (uploadedInvoice.file && uploadedInvoice.file instanceof File) {
        // If we have a File object but no preview, create one
        url = URL.createObjectURL(uploadedInvoice.file);
        console.log("SharedInvoicePreview - Created URL from File object");
      } else if (uploadedInvoice.extractedData) {
        // Try extractedData fields with expanded options
        const extractedData = uploadedInvoice.extractedData;
        if (extractedData.fileUrl) {
          url = extractedData.fileUrl;
          console.log("SharedInvoicePreview - Using extractedData.fileUrl property");
        } else if (extractedData.image) {
          url = extractedData.image;
          console.log("SharedInvoicePreview - Using extractedData.image property");
        } else if (extractedData.preview) {
          url = extractedData.preview;
          console.log("SharedInvoicePreview - Using extractedData.preview property");
        } else if (extractedData.url) {
          url = extractedData.url;
          console.log("SharedInvoicePreview - Using extractedData.url property");
        } else if (extractedData.imageUrl) {
          url = extractedData.imageUrl;
          console.log("SharedInvoicePreview - Using extractedData.imageUrl property");
        }
      }
      
      // Set the preview URL
      setPreviewUrl(url);
      console.log("SharedInvoicePreview - Final preview URL:", url);
      
      // Determine file type for rendering
      let type = "unknown";
      
      if (uploadedInvoice.file && uploadedInvoice.file.type) {
        type = uploadedInvoice.file.type;
        console.log("SharedInvoicePreview - Using file.type:", type);
      } else if (url) {
        // Try to guess from URL extension
        if (url.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
          type = "image";
          console.log("SharedInvoicePreview - Detected image type from URL");
        } else if (url.match(/\.(pdf)$/i)) {
          type = "application/pdf";
          console.log("SharedInvoicePreview - Detected PDF type from URL");
        }
      }
      
      setFileType(type);
      console.log("SharedInvoicePreview - Final file type:", type);
    }
  }, [uploadedInvoice]);

  // Handler for when images or PDFs start loading
  const handleLoadStart = () => {
    console.log("SharedInvoicePreview - Document load started");
    setLoading(true);
    setPreviewError(false);
  };
  
  // Handler for when images or PDFs finish loading
  const handleLoadComplete = () => {
    console.log("SharedInvoicePreview - Document load completed");
    setLoading(false);
  };
  
  // Handler for load errors
  const handleLoadError = () => {
    console.error("SharedInvoicePreview - Error loading document");
    setLoading(false);
    setPreviewError(true);
  };

  return (
    <div className="w-1/2 p-6 border-r overflow-auto bg-gray-50">
      <h3 className="text-lg font-medium mb-4">Invoice Preview</h3>
      
      {uploadedInvoice && (previewUrl || uploadedInvoice.preview) ? (
        <div className="h-full flex flex-col">
          {/* Main Invoice Preview Container - styled to match reference image */}
          <div className="flex-grow relative mb-4">
            <div className="w-full h-full bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
              {/* Document display with proper padding and styling */}
              <div className="w-full h-full min-h-[70vh] relative">
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                    <div className="text-center">
                      <LoadingSpinner size="large" className="mb-3" />
                      <p className="text-gray-600">Loading document...</p>
                    </div>
                  </div>
                )}
                
                {previewError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <div className="text-center p-6">
                      <FileText size={60} className="mx-auto text-red-200 mb-3" />
                      <p className="text-red-600 font-medium">Unable to load document</p>
                      <p className="text-gray-500 text-sm mt-1">The document preview could not be loaded</p>
                    </div>
                  </div>
                )}
                
                {/* Image preview */}
                {(fileType === 'image' || (fileType && fileType.includes('image'))) && (
                  <img 
                    src={previewUrl || uploadedInvoice.preview} 
                    alt="Invoice" 
                    className="w-full h-full object-contain p-4"
                    onLoadStart={handleLoadStart}
                    onLoad={handleLoadComplete}
                    onError={handleLoadError}
                  />
                )}
                
                {/* PDF preview */}
                {(fileType === 'application/pdf' || (fileType && fileType.includes('pdf'))) && (
                  <iframe 
                    src={previewUrl || uploadedInvoice.preview} 
                    className="w-full h-full border-0" 
                    title="Invoice Document"
                    onLoad={handleLoadComplete}
                    onError={handleLoadError}
                  />
                )}
                
                {/* Default document icon for unknown types or when no preview URL is determined yet */}
                {(!fileType || fileType === 'unknown' || (!previewUrl && !uploadedInvoice.preview)) && !previewError && !loading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-6">
                      {fileType && fileType.includes('image') ? (
                        <FileImage size={60} className="mx-auto text-gray-300 mb-3" />
                      ) : fileType && fileType.includes('pdf') ? (
                        <File size={60} className="mx-auto text-gray-300 mb-3" />
                      ) : (
                        <FileText size={60} className="mx-auto text-gray-300 mb-3" />
                      )}
                      <p className="text-gray-700 font-medium">
                        {uploadedInvoice.file ? uploadedInvoice.file.name : 
                          (uploadedInvoice.fileName || uploadedInvoice.name || invoiceIdentifier || 'Document')}
                      </p>
                      {invoiceIdentifier && (
                        <p className="text-blue-600 text-sm mt-1">Invoice: {invoiceIdentifier}</p>
                      )}
                      <p className="text-gray-500 text-sm mt-1">Document</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Tab buttons at the bottom */}
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50 flex-1 text-center">
              Invoice
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 flex-1 text-center">
              Documents
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-md p-8 bg-white shadow-sm flex flex-col items-center justify-center min-h-[70vh]">
          <FileText size={60} className="text-gray-300 mb-4" />
          <div className="text-center">
            <p className="font-medium text-gray-700">No Invoice Document</p>
            <p className="text-sm text-gray-500 mt-1">Upload an invoice to preview it here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedInvoicePreview;