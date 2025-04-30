import React, { useState } from 'react';
import { X, Upload, ChevronRight, Edit, ArrowLeft, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * RecurringBillReview component - Final review page for recurring bill
 */
const RecurringBillReview = ({ onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Get bill data and file from router state, or use defaults
  const billData = location.state?.billData || {};
  const vendorData = location.state?.vendorData || {};
  const uploadedFile = location.state?.uploadedFile || null;
  
  // Show cancel confirmation modal
  const handleCloseClick = () => {
    setShowCancelModal(true);
  };
  
  // Handle cancel confirmation
  const handleCancelConfirm = () => {
    // Navigate back to bills page
    if (onBack) {
      onBack();
    } else {
      navigate('/bill-pay/bills', { 
        state: { 
          openRecurringBillsDrawer: true 
        } 
      });
    }
  };
  
  // Handle cancel dismiss
  const handleCancelDismiss = () => {
    setShowCancelModal(false);
  };
  
  // Handle edit button - go back to recurring bill form
  const handleEdit = () => {
    navigate('/recurring-bill', { 
      state: { 
        vendorData,
        uploadedFile,
        billData
      } 
    });
  };
  
  // Handle create button - finalize the recurring bill
  const handleCreate = () => {
    console.log("Creating recurring bill:", {
      vendor: vendorData,
      bill: billData,
      file: uploadedFile,
    });
    
    // Navigate back to bills page with state to open recurring bills drawer
    navigate('/bill-pay/bills', { 
      state: { 
        openRecurringBillsDrawer: true,
        createdRecurringBill: true
      } 
    });
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left side - File preview area */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg border-gray-300 p-8">
            {uploadedFile ? (
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary-100 rounded-full mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {(uploadedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">No file uploaded</p>
                <p className="text-gray-400 text-sm">PDF, PNG, or JPG files only</p>
              </>
            )}
          </div>
        </div>
        
        {/* Right side - Review content */}
        <div className="w-full md:w-1/2 p-6 flex flex-col border-l border-gray-200 overflow-y-auto">
          {/* Header with title and close button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Review recurring bill</h2>
            <button 
              onClick={handleCloseClick}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Review content */}
          <div className="space-y-6 flex-grow">
            {/* Vendor section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between mb-3">
                <div className="font-medium text-gray-800">Vendor</div>
                <button 
                  onClick={handleEdit}
                  className="text-primary font-medium text-sm flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mr-1"
                  >
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Name</div>
                  <div className="font-medium">{vendorData.name || 'Not specified'}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Contact</div>
                  <div>{vendorData.email || 'No contact information'}</div>
                </div>
              </div>
            </div>
            
            {/* Bill details section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between mb-3">
                <div className="font-medium text-gray-800">Bill Details</div>
                <button 
                  onClick={handleEdit}
                  className="text-primary font-medium text-sm flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mr-1"
                  >
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Invoice #</div>
                  <div>{billData.invoiceNumber || 'Not specified'}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Description</div>
                  <div>{billData.description || 'No description'}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Schedule</div>
                  <div>{billData.schedule || 'Not specified'}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Ends after</div>
                  <div>{billData.endsAfter || 'Not specified'}</div>
                </div>
              </div>
            </div>
            
            {/* Accounting section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between mb-3">
                <div className="font-medium text-gray-800">Accounting</div>
                <button 
                  onClick={handleEdit}
                  className="text-primary font-medium text-sm flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mr-1"
                  >
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Department</div>
                  <div>{billData.accountingDepartment || 'Not specified'}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Line items</div>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <div className="flex justify-between">
                      <div className="text-gray-700">Invoice total</div>
                      <div className="font-medium">₹{billData.lineItems?.[0]?.amount || '0.00'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Approval section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between mb-3">
                <div className="font-medium text-gray-800">Approval</div>
                <button 
                  onClick={handleEdit}
                  className="text-primary font-medium text-sm flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="mr-1"
                  >
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-gray-600 text-sm">1</span>
                  </div>
                  <div className="text-sm">Amy Adrion</div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-gray-600 text-sm">2</span>
                  </div>
                  <div className="text-sm">Amit (Finance Director)</div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-gray-600 text-sm">3</span>
                  </div>
                  <div className="text-sm">David Watson, Jan Levinston, or Calvin Lee</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add extra padding at the bottom to account for fixed footer */}
          <div className="pb-20"></div>
          
          {/* Bottom actions - fixed position at bottom */}
          <div className="fixed bottom-0 left-0 right-0 md:left-1/2 bg-white p-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={handleEdit}
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
              Edit bill
            </button>
            
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md"
            >
              Create bill
            </button>
          </div>
        </div>
      </div>
      
      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Cancel recurring bill?</h3>
            <p className="text-gray-600 mb-6">
              This will discard all information you've entered. Are you sure you want to cancel?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDismiss}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringBillReview;