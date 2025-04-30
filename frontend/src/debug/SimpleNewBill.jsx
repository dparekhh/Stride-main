import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

const SimpleNewBill = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  
  // Mock vendor data for testing
  const [vendorData] = useState({
    name: "Test Vendor",
    gstin: "TEST1234567890",
    email: "test@vendor.com",
    phone: "1234567890",
    address: "123 Test Street",
    city: "Test City",
    state: "Test State",
    zip: "12345"
  });
  
  // Mock invoice data for testing
  const [invoiceData] = useState({
    invoiceNumber: "INV-12345",
    invoiceDate: "2025-03-18",
    dueDate: "2025-04-18",
    amount: 1000.00,
    currency: "INR",
    items: [
      { description: "Test Item 1", quantity: 2, price: 500.00 }
    ]
  });
  
  const handleContinue = () => {
    console.log("SimpleNewBill - Continue button clicked");
    notification.showInfo("Proceeding to vendor review...");
    
    // Navigate to the vendor review page with vendor and invoice data
    navigate('/simple-vendor-review', {
      state: {
        formData: vendorData,
        uploadedInvoice: invoiceData,
        sourceRoute: "newBill"
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
          <h1 className="text-2xl font-bold">Simple New Bill (Debug Component)</h1>
          <button 
            onClick={handleBack} 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Back
          </button>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Invoice Number:</p>
              <p>{invoiceData.invoiceNumber}</p>
            </div>
            <div>
              <p className="font-medium">Amount:</p>
              <p>{invoiceData.currency} {invoiceData.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium">Invoice Date:</p>
              <p>{invoiceData.invoiceDate}</p>
            </div>
            <div>
              <p className="font-medium">Due Date:</p>
              <p>{invoiceData.dueDate}</p>
            </div>
          </div>
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
        
        <div className="flex justify-end">
          <button 
            onClick={handleContinue} 
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleNewBill;