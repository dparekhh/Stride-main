// src/pages/BillReview.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ArrowRight, CheckCircle, Calendar } from "lucide-react";
import SharedInvoicePreview from "../components/SharedInvoicePreview.jsx";

/**
 * Bill Review page component
 * 
 * This component provides a final review screen for bill details before creation
 * It shows the document preview on the left and bill details on the right
 * This version is completely independent and uses no external data dependencies
 */
const BillReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug logging for navigation
  useEffect(() => {
    console.log("BillReview component mounted");
    console.log("Current location path:", location.pathname);
    console.log("BillReview location state:", location.state);
    
    document.body.setAttribute('data-review-displayed', 'true');
    
    return () => {
      console.log("BillReview component unmounting");
      document.body.removeAttribute('data-review-displayed');
    };
  }, [location]);
  
  // Use invoice data from state or fall back to sample data
  const invoiceData = location.state?.uploadedInvoice || {
    imageUrl: '/static/sample_invoice.jpg',
    fileName: 'sample_invoice.jpg',
    fileSize: '156KB',
    uploadDate: new Date().toISOString()
  };
  
  // Handle back button with improved logging
  const handleBack = () => {
    console.log("Back button clicked in BillReview");
    navigate(-1);
  };
  
  // Handle bill creation with improved logging
  const handleCreateBill = () => {
    console.log("Create Bill button clicked - NO BACKEND DEPENDENCY");
    // Add helpful debug logs
    console.log("BillReview - Create Bill button clicked with route history:", window.history);
    console.log("BillReview - Current location:", window.location.pathname);
    console.log("BillReview - Successfully completing workflow");
    
    // Show a success message and return to bills page
    // This is a pure frontend implementation with no backend calls
    navigate("/bill-pay/bills");
  };
  
  // Format currency for display
  const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Use bill data from state or fall back to sample data
  const billData = location.state?.billData || {
    vendorName: "Ace Mobile Manufacturer Pvt Ltd",
    amount: 24500,
    lineItems: [
      { description: "iPhone 15 Pro Max 256GB", quantity: 2, unitPrice: 9000 },
      { description: "AppleCare+ Service Plan", quantity: 2, unitPrice: 1500 },
      { description: "Wireless Charger - Premium", quantity: 3, unitPrice: 1500 }
    ]
  };
  
  // Use the passed bill data or fallback sample data
  const effectiveBillData = billData;
  
  // Format vendor name and total amount for display
  const vendorName = effectiveBillData.vendorName || "Vendor";
  const totalAmount = effectiveBillData.amount || 0;
  
  // Use provided line items or sample data
  const lineItems = effectiveBillData.lineItems || [];
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="flex h-screen">
        {/* Left side - Invoice preview - use passed data or fallback */}
        <SharedInvoicePreview uploadedInvoice={invoiceData} />
        
        {/* Right side - Bill review */}
        <div className="w-1/2 flex flex-col h-full overflow-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold">One last look...</h2>
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Main content */}
          <div className="p-6 flex-grow">
            {/* Pay amount to vendor */}
            <div className="mb-8">
              <p className="text-xl font-medium">
                <span className="text-gray-400">Pay </span>
                <span className="text-black">{formatCurrency(totalAmount)}</span>
                <span className="text-gray-400"> to </span>
                <span className="text-black">{vendorName}</span>
              </p>
            </div>
            
            {/* Line items review */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Line Item Review</h3>
              <div className="border border-gray-200 rounded-lg overflow-y-auto max-h-64">
                {lineItems.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {lineItems.map((item, index) => (
                      <div key={index} className="p-4">
                        <div className="font-medium">Line Item {index + 1}</div>
                        <div className="text-gray-700">{item.description}</div>
                        <div className="flex justify-between mt-2 text-sm text-gray-500">
                          <span>Quantity: {item.quantity}</span>
                          <span>Rate: {formatCurrency(item.unitPrice)}</span>
                          <span>Total: {formatCurrency(item.quantity * item.unitPrice)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No line items found
                  </div>
                )}
              </div>
            </div>
            
            {/* What happens next box */}
            <div className="mb-8 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium flex items-center gap-2 mb-2">
                <span>What happens next?</span>
              </h3>
              <p className="text-gray-600 text-sm">
                If you have scheduled a payment, we will send you timely reminders so you do not miss it
              </p>
            </div>
            
            {/* Approval information */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Sent for review to</h3>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="bg-blue-100 rounded-full p-2">
                  <CheckCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Finance Team</p>
                  <p className="text-sm text-gray-500">Will be notified via email</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer with action buttons */}
          <div className="p-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            
            <button
              onClick={handleCreateBill}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-md flex items-center gap-2"
            >
              Create Bill
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillReview;