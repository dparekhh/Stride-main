import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

const SimpleVendorReviewWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useNotification();
  
  // Get data from location state or create default values
  const { formData, uploadedInvoice, sourceRoute } = location.state || {};
  
  // Default vendorData if formData is missing or incomplete
  const defaultVendorData = {
    name: "Test Vendor",
    gstin: "TEST1234567890",
    email: "test@vendor.com",
    phone: "1234567890",
    address: "123 Test Street",
    city: "Test City",
    state: "Test State",
    zip: "12345"
  };
  
  // Create a complete vendor object using defaults for any missing properties
  const vendorData = {
    ...defaultVendorData,
    ...(formData || {})
  };
  
  console.log("SimpleVendorReviewWrapper - Vendor Data:", vendorData);
  console.log("SimpleVendorReviewWrapper - Source Route:", sourceRoute);
  
  const handleEdit = () => {
    console.log("SimpleVendorReviewWrapper - Edit button clicked");
    console.log("SimpleVendorReviewWrapper - Navigating to /vendor-information with:", vendorData);
    
    // Navigate to the vendor information page with the vendor data
    navigate('/vendor-information', {
      state: {
        formData: vendorData,
        uploadedInvoice: uploadedInvoice,
        sourceRoute: sourceRoute || 'newBill'
      }
    });
  };
  
  const handleContinue = () => {
    notification.showSuccess("Continue button clicked. In a real flow, this would proceed to the next step.");
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Simple Vendor Review (Debug Component)</h1>
          <button 
            onClick={handleBack} 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Back
          </button>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Vendor Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Name:</p>
              <p>{vendorData.name}</p>
            </div>
            <div>
              <p className="font-medium">GSTIN:</p>
              <p>{vendorData.gstin}</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p>{vendorData.email}</p>
            </div>
            <div>
              <p className="font-medium">Phone:</p>
              <p>{vendorData.phone}</p>
            </div>
            <div>
              <p className="font-medium">Address:</p>
              <p>{vendorData.address}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={handleEdit} 
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          
          <button 
            onClick={handleContinue} 
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {sourceRoute === 'newVendor' ? 'Save Vendor' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleVendorReviewWrapper;