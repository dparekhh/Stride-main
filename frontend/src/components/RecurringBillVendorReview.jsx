import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Mail, MapPin, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * RecurringBillVendorReview component that displays a file upload area
 * and a vendor review area as shown in image_1742728700729.png.
 */
const RecurringBillVendorReview = ({ onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Get vendor data and file from router state, or use defaults
  const vendorData = location.state?.vendorForm || {};
  const [uploadedFile, setUploadedFile] = useState(location.state?.uploadedFile || null);
  const autoApprove = location.state?.autoApprove || false;
  
  // State for the confirmation modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is a supported type (PDF, PNG, JPG)
    const validFileTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (validFileTypes.includes(file.type)) {
      setUploadedFile(file);
    } else {
      alert('Please upload a PDF, PNG, or JPG file.');
    }
  };
  
  // Handle file drop
  const handleFileDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Check if file is a supported type
      const validFileTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (validFileTypes.includes(file.type)) {
        setUploadedFile(file);
      } else {
        alert('Please upload a PDF, PNG, or JPG file.');
      }
    }
  };
  
  // Clear uploaded file
  const clearUploadedFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Navigate back
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };
  
  // Handle cancel confirmation
  const handleCancelConfirm = () => {
    // Navigate to the recurring-bill-vendor route
    // This matches the expected screen shown in the image
    navigate('/recurring-bill-vendor', { 
      state: { 
        resetForm: true 
      } 
    });
  };
  
  // Handle cancel dismiss
  const handleCancelDismiss = () => {
    setShowCancelModal(false);
  };
  
  // Handle create vendor
  const handleCreateVendor = () => {
    // In a real implementation, this would call an API to create the vendor
    console.log("Creating vendor with data:", vendorData);
    console.log("Auto approve setting:", autoApprove);
    
    // Navigate to the recurring bill page with the vendor data
    navigate('/recurring-bill', { 
      state: { 
        vendorData: vendorData,
        uploadedFile: uploadedFile,
        autoApprove: autoApprove 
      } 
    });
  };
  
  // Get display name for contact
  const getContactName = () => {
    if (vendorData.firstName || vendorData.lastName) {
      return `${vendorData.firstName || ''} ${vendorData.lastName || ''}`.trim();
    }
    return vendorData.name || 'Not specified';
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Cancel new vendor?</h3>
            <p className="text-gray-600 mb-6">
              If you cancel, all entered information will be lost. Are you sure you want to cancel?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDismiss}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left side - File upload area */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          {/* File upload area */}
          <div 
            className="flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg border-gray-300 p-8"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current.click()}
          >
            {uploadedFile ? (
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary-100 rounded-full mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {(uploadedFile.size / 1024).toFixed(0)} KB
                </p>
                <button 
                  className="mt-4 text-red-500 text-sm font-medium"
                  onClick={clearUploadedFile}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">Drop your invoice or click here to upload</p>
                <p className="text-gray-400 text-sm">PDF, PNG, or JPG files only</p>
              </>
            )}
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.png,.jpg,.jpeg"
            />
          </div>
        </div>
        
        {/* Right side - Vendor Review area */}
        <div className="w-full md:w-1/2 p-6 flex flex-col border-l border-gray-200 bg-gray-50">
          {/* Header with back button, title, and close button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={handleBack}
                className="mr-3 text-gray-600 hover:text-gray-900"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">Review New Vendor</h2>
            </div>
            <button 
              onClick={handleCancelClick}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Vendor Owner section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <h3 className="text-lg font-medium mb-3">Vendor Owner</h3>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <span className="text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{vendorData.owner ? vendorData.owner : 'Not specified'}</p>
                <p className="text-gray-500 text-sm">Executive • {vendorData.name || ''}</p>
              </div>
            </div>
          </div>
          
          {/* Vendor Contact section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-3">Vendor Contact</h3>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <span className="text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
              </div>
            </div>
            
            {/* Email */}
            {vendorData.email && (
              <div className="flex items-center mb-3">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-700">{vendorData.email}</span>
              </div>
            )}
            
            {/* Address */}
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1" />
              <div>
                {vendorData.phone && <p className="text-gray-700">{vendorData.phone}</p>}
                {getContactName() !== 'Not specified' && <p className="text-gray-700">{getContactName()}</p>}
                {(vendorData.state || vendorData.country) && (
                  <p className="text-gray-700">
                    {vendorData.state && vendorData.state !== 'Select' ? vendorData.state : 'Uttar Pradesh'}
                    {vendorData.country && vendorData.country !== 'Select' ? ', ' + vendorData.country : ', India'}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Bottom actions - fixed position at bottom */}
          <div className="fixed bottom-0 left-0 right-0 md:left-1/2 bg-white p-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={handleCreateVendor}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md"
            >
              Create Vendor
            </button>
          </div>
          {/* Add extra padding at the bottom to account for fixed footer */}
          <div className="pb-20"></div>
        </div>
      </div>
    </div>
  );
};

export default RecurringBillVendorReview;