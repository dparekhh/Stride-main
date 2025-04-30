// src/pages/NewBill.jsx
import React, { useState, useEffect } from "react";
import { X, Info, Search, FileText, Edit2, ArrowRight, Store, Check, CheckCircle } from "lucide-react";
import SharedInvoicePreview from "../components/SharedInvoicePreview.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useNotification } from "../contexts/NotificationContext";

const NewBill = ({
  showNewBill,
  setShowNewBill,
  uploadedInvoice,
  setUploadedInvoice,
  onCreateNewVendor,
  openVendorReview
}) => {
  // Access notification context
  const notification = useNotification();
  
  // Simplified state without backend integration
  const [vendorSearchTerm, setVendorSearchTerm] = useState('');
  const [activeStep, setActiveStep] = useState(1); // Track the current step (1: Vendor, 2: Details)
  const [hasShownNotification, setHasShownNotification] = useState(false);
  
  // Demo data for vendor matching
  const mockVendorName = "Ace Mobile Manufacturer Pvt Ltd";
  const mockVendorGSTIN = "27AABCU9603R1ZX";
  
  // State to track if a vendor already exists
  const [vendorExists, setVendorExists] = useState(false);
  const [existingVendorDetails, setExistingVendorDetails] = useState(null);
  
  // Debug on mount and when showNewBill changes
  useEffect(() => {
    console.log('NewBill component - showNewBill state:', showNewBill);
    console.log('Vendor data:', {
      vendorExists, 
      hasShownNotification,
      extractedData: uploadedInvoice?.extractedData || {}
    });
  }, [showNewBill, uploadedInvoice, vendorExists, hasShownNotification]);
  
  // Check if vendor exists when invoice is loaded
  useEffect(() => {
    if (!uploadedInvoice) return;
    
    const extractedData = uploadedInvoice.extractedData || {};
    
    // Get vendor existence from API response (if available)
    if (extractedData.vendor_exists !== undefined) {
      setVendorExists(extractedData.vendor_exists);
      
      // Set vendor details if exists
      if (extractedData.vendor_exists && extractedData.vendor_details) {
        setExistingVendorDetails(extractedData.vendor_details);
      } else {
        setExistingVendorDetails(null);
      }
      return;
    }
    
    // Fallback to mock implementation for testing if API data isn't available
    const extractedVendorName = extractedData.vendor_name || uploadedInvoice.vendorName;
    const extractedVendorGSTIN = extractedData.vendor_gstin || uploadedInvoice.vendorGSTIN;
    
    // For demo: Simulate vendor exists when vendor name is "Ace Mobile Manufacturer Pvt Ltd"
    if (extractedVendorName && (
        extractedVendorName.toLowerCase().includes("ace mobile") || 
        extractedVendorName === mockVendorName
      )) {
      setVendorExists(true);
      setExistingVendorDetails({
        id: "vendor-123",
        name: mockVendorName,
        gstin: mockVendorGSTIN,
        address: "123 Tech Park, Mumbai, Maharashtra, 400001",
        email: "accounts@acemobile.com",
        phone: "+91 98765 43210"
      });
      
      // Log for debugging
      console.log("Vendor exists (mock):", mockVendorName);
    } else {
      setVendorExists(false);
      setExistingVendorDetails(null);
      
      // Log for debugging
      console.log("No existing vendor found for:", extractedVendorName);
    }
  }, [uploadedInvoice]);
  
  // Debug logging for vendor information
  // No notifications shown here to avoid duplication
  useEffect(() => {
    // Get vendor name from extracted data, using the correct property name
    const extractedData = uploadedInvoice?.extractedData || {};
    const vendorName = extractedData.vendor_name || extractedData.vendorName || uploadedInvoice?.vendorName;

    // Log for debugging
    console.log("Vendor data:", { 
      vendorName, 
      vendorExists, 
      hasShownNotification,
      extractedData
    });
    
    // Always mark as shown to prevent any notification logic from running
    if (showNewBill && !hasShownNotification) {
      setHasShownNotification(true);
    }
  }, [showNewBill, uploadedInvoice, vendorExists, hasShownNotification]);

  // Get vendor initials for the avatar
  const getVendorInitials = (name) => {
    if (!name) return 'VN';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  // Handle proceeding to the next step
  const handleContinue = () => {
    console.log("==========================================");
    console.log("handleContinue called - navigating to Vendor Review page");
    console.log("Vendor details:", existingVendorDetails);
    console.log("Invoice data:", uploadedInvoice);
    
    try {
      // Always navigate to Vendor Review page when Continue button is clicked
      if (typeof openVendorReview === 'function') {
        console.log("Navigating to Vendor Review page");
        
        // If vendor exists, use those details
        if (vendorExists && existingVendorDetails) {
          openVendorReview(existingVendorDetails, uploadedInvoice);
        } else {
          // If no vendor exists yet, create placeholder data for review
          // This allows users to review and modify the data in the Vendor Review page
          const vendorData = {
            name: uploadedInvoice?.extractedData?.vendor_name || 
                  uploadedInvoice?.extractedData?.vendorName || 
                  uploadedInvoice?.vendorName || 
                  "New Vendor",
            gstin: uploadedInvoice?.extractedData?.vendor_gstin || 
                   uploadedInvoice?.extractedData?.vendorGSTIN || 
                   uploadedInvoice?.vendorGSTIN || 
                   "",
            address: uploadedInvoice?.extractedData?.vendor_address || 
                     uploadedInvoice?.extractedData?.vendorAddress || 
                     "",
            email: uploadedInvoice?.extractedData?.vendor_email || 
                   uploadedInvoice?.extractedData?.vendorEmail || 
                   "",
            phone: uploadedInvoice?.extractedData?.vendor_phone || 
                   uploadedInvoice?.extractedData?.vendorPhone || 
                   ""
          };
          
          openVendorReview(vendorData, uploadedInvoice);
        }
        
        // Hide this form after navigation
        setShowNewBill(false);
        return;
      } else {
        console.error("openVendorReview function is not available");
        notification.showError("Navigation error - openVendorReview function is not available");
        
        // If the navigation function is not available, just proceed to the next step
        setActiveStep(2);
      }
    } catch (error) {
      console.error("ERROR in handleContinue:", error);
      
      // Fallback to step 2 on error
      notification.showError("Navigation error - proceeding to next step instead");
      setActiveStep(2);
    }
  };

  // Handle vendor selection
  const handleSelectVendor = (vendor) => {
    setExistingVendorDetails(vendor);
    setVendorExists(true);
    notification.showSuccess(`Selected vendor: ${vendor.name}`);
  };

  // Debug when NewBill visibility changes
  useEffect(() => {
    console.log("NewBill visibility changed to:", showNewBill);
  }, [showNewBill]);
  
  // Don't render if not visible, but log this for debugging
  if (!showNewBill) {
    console.log("NewBill component not rendering because showNewBill is false");
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="flex h-screen">
          {/* Use the shared invoice preview component */}
          <SharedInvoicePreview uploadedInvoice={uploadedInvoice} />

          {/* Right side - Step-based Content */}
          <div className="w-1/2 p-6 overflow-auto">
            {/* Processing overlay when extracting document data */}
            {uploadedInvoice?.processing && (
              <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex flex-col items-center justify-center">
                <LoadingSpinner size="large" className="mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Processing your document</h3>
                <p className="text-gray-600 text-center max-w-md">
                  We're extracting information from your invoice. 
                  This will just take a moment...
                </p>
              </div>
            )}
            
            {/* Error state when processing fails */}
            {uploadedInvoice?.processingError && !uploadedInvoice?.processing && (
              <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <Info size={16} className="text-red-600 mr-2" />
                  <span className="font-medium">Processing error</span>
                </div>
                <p className="text-sm mt-1">
                  We couldn't automatically extract all data from your document. 
                  You can still continue by filling in the information manually.
                </p>
              </div>
            )}
            
            {/* Step 1: Vendor Information */}
            {activeStep === 1 && (
              <div>
                <div className="mb-8 relative pb-16">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">New Bill</h2>
                    <button
                      onClick={() => {
                        setShowNewBill(false);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <h3 className="text-lg font-medium mb-4">Who's it for?</h3>
                  
                  {/* Show different information based on if vendor exists or not */}
                  {vendorExists ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
                      <div className="flex items-center">
                        <CheckCircle size={16} className="text-green-600 mr-2" />
                        <span className="font-medium">We found an existing vendor matching this bill</span>
                      </div>
                      <p className="text-sm mt-1">
                        This bill appears to be from {existingVendorDetails?.name}, which is already in your system.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-md mb-4">
                      <div className="flex items-center">
                        <Info size={16} className="text-orange-600 mr-2" />
                        <span>We couldn't find an existing vendor that matches this bill</span>
                      </div>
                      <p className="text-sm mt-1">Create a new vendor if this is your first time paying them, or select another vendor if one already exists.</p>
                    </div>
                  )}
                  
                  {/* Show different content based on if vendor exists */}
                  {vendorExists ? (
                    <div className="mb-6">
                      <h4 className="text-base font-medium mb-2">Selected Vendor</h4>
                      <div className="flex items-center justify-between border border-green-300 bg-green-50 rounded-md p-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-full mr-3 border border-green-200">
                            <span className="text-sm font-medium">{getVendorInitials(existingVendorDetails?.name)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{existingVendorDetails?.name}</p>
                            <p className="text-xs text-gray-500">GSTIN: {existingVendorDetails?.gstin}</p>
                          </div>
                        </div>
                        <div>
                          <Check size={20} className="text-green-600" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Create new vendor from invoice section */}
                      <div className="mb-6">
                        <h4 className="text-base font-medium mb-2">Create new vendor from invoice</h4>
                        <div className="flex items-center justify-between border border-gray-300 rounded-md p-3">
                          <div className="flex items-center">
                            <Store size={20} className="text-gray-500 mr-2" />
                            <span className="text-gray-700">{uploadedInvoice?.extractedData?.vendor_name || uploadedInvoice?.extractedData?.vendorName || uploadedInvoice?.vendorName || "Vendor name from invoice"}</span>
                          </div>
                          <button 
                            className="px-3 py-1.5 border border-black bg-white text-black rounded-md text-sm font-medium hover:bg-gray-50"
                            onClick={() => {
                              console.log("Opening vendor creation form");
                              // Use the prop function to open the NewVendor page
                              if (onCreateNewVendor) {
                                onCreateNewVendor();
                              }
                            }}
                          >
                            Create new vendor
                          </button>
                        </div>
                      </div>
                      
                      {/* Select Another Vendor section */}
                      <div className="mb-6">
                        <h4 className="text-base font-medium mb-2">Select Another Vendor</h4>
                        
                        <div className="relative mb-3 flex items-center">
                          <div className="relative flex-grow">
                            <input
                              type="text"
                              placeholder="Search by vendor name or GSTIN"
                              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm"
                              value={vendorSearchTerm}
                              onChange={(e) => setVendorSearchTerm(e.target.value)}
                            />
                            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                          </div>
                          <button 
                            className="ml-2 w-6 h-6 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center"
                          >
                            <span className="text-xs">+</span>
                          </button>
                        </div>
                        
                        {/* Static vendor options for demo */}
                        <div className="border rounded-md p-3">
                          <div className="max-h-48 overflow-y-auto">
                            <div 
                              className="p-2 hover:bg-gray-50 rounded cursor-pointer flex items-center"
                              onClick={() => handleSelectVendor({
                                id: "vendor-123",
                                name: mockVendorName,
                                gstin: mockVendorGSTIN,
                                address: "123 Tech Park, Mumbai, Maharashtra, 400001",
                                email: "accounts@acemobile.com",
                                phone: "+91 98765 43210"
                              })}
                            >
                              <div className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded mr-2">
                                <span className="text-xs">{getVendorInitials(mockVendorName)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{mockVendorName}</p>
                                <p className="text-xs text-gray-500">GSTIN: {mockVendorGSTIN}</p>
                              </div>
                            </div>
                            <div 
                              className="p-2 hover:bg-gray-50 rounded cursor-pointer flex items-center"
                              onClick={() => handleSelectVendor({
                                id: "vendor-456",
                                name: "Reliance Trends",
                                gstin: "33AABCT3518Q1ZX",
                                address: "456 Retail Park, Chennai, Tamil Nadu, 600001",
                                email: "accounts@reliancetrends.com",
                                phone: "+91 98765 12345"
                              })}
                            >
                              <div className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded mr-2">
                                <span className="text-xs">RT</span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">Reliance Trends</p>
                                <p className="text-xs text-gray-500">GSTIN: 33AABCT3518Q1ZX</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Always show the continue button regardless of vendor selection */}
                  <div className="absolute bottom-0 right-0 mb-2 mr-2">
                    <button 
                      className="px-4 py-2 flex items-center rounded-md bg-primary hover:bg-primary-dark text-white font-medium shadow-sm"
                      onClick={handleContinue}
                    >
                      Continue
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Bill Details */}
            {activeStep === 2 && (
              <div>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">New Bill</h2>
                    <button
                      onClick={() => {
                        setShowNewBill(false);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <h3 className="text-lg font-medium mb-4">Bill Details</h3>
                  <p className="text-gray-500 mb-4">Please review and complete the bill information</p>
                  
                  {/* Vendor information (read-only) */}
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium">{getVendorInitials(existingVendorDetails?.name)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{existingVendorDetails?.name}</p>
                        <p className="text-xs text-gray-500">GSTIN: {existingVendorDetails?.gstin}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Form fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Invoice #123456"
                        defaultValue={uploadedInvoice?.extractedData?.invoice_number || uploadedInvoice?.extractedData?.invoiceNumber || "INV-2023-04562"}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                        <input 
                          type="date" 
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          defaultValue={uploadedInvoice?.extractedData?.invoice_date || uploadedInvoice?.extractedData?.date || "2023-03-15"}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input 
                          type="date" 
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          defaultValue={uploadedInvoice?.extractedData?.due_date || uploadedInvoice?.extractedData?.dueDate || "2023-04-14"}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2">₹</span>
                        <input 
                          type="number" 
                          className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2"
                          placeholder="0.00"
                          defaultValue={uploadedInvoice?.extractedData?.total_amount || uploadedInvoice?.extractedData?.amount || "24500"}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                        placeholder="Enter bill description"
                        defaultValue="Mobile phone purchase for marketing team"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {/* Save button */}
                <div className="mt-auto pt-4 border-t flex justify-between">
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={() => setActiveStep(1)}
                  >
                    Back
                  </button>
                  <button 
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md shadow-sm"
                    onClick={() => {
                      // Save the bill and close the form
                      // Show success notification
                      notification.showSuccess(
                        `Bill ${uploadedInvoice?.extractedData?.invoice_number || uploadedInvoice?.extractedData?.invoiceNumber || "INV-2023-04562"} successfully saved`, 
                        { autoClose: true }
                      );
                      setShowNewBill(false);
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewBill;