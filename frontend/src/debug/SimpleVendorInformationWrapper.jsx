import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

const SimpleVendorInformationWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useNotification();
  
  // Default form data if none provided
  const defaultFormData = {
    name: "Test Vendor",
    gstin: "TEST1234567890",
    email: "test@vendor.com",
    phone: "1234567890",
    address: "123 Test Street",
    city: "Test City",
    state: "Test State",
    zip: "12345"
  };
  
  // Get data from location state or use defaults
  const { 
    formData: initialData = defaultFormData, 
    uploadedInvoice, 
    sourceRoute = 'newBill' 
  } = location.state || {};
  
  console.log("SimpleVendorInformationWrapper - Initial Data:", initialData);
  console.log("SimpleVendorInformationWrapper - Source Route:", sourceRoute);
  
  // Create state for form data
  const [formData, setFormData] = useState({...initialData});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveChanges = () => {
    notification.showSuccess("Vendor information saved successfully!");
    
    // Navigate back to vendor review with updated data
    navigate('/vendor-review', {
      state: {
        formData: formData,
        uploadedInvoice: uploadedInvoice,
        sourceRoute: sourceRoute
      }
    });
  };
  
  const handleDiscardChanges = () => {
    notification.showInfo("Changes discarded");
    
    // Navigate back to vendor review with original data
    navigate('/vendor-review', {
      state: {
        formData: initialData,
        uploadedInvoice: uploadedInvoice,
        sourceRoute: sourceRoute
      }
    });
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Simple Vendor Information (Debug Component)</h1>
          <button 
            onClick={handleBack} 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Back
          </button>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Edit Vendor Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Vendor Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">GSTIN</label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={handleDiscardChanges} 
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Discard Changes
          </button>
          
          <button 
            onClick={handleSaveChanges} 
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleVendorInformationWrapper;