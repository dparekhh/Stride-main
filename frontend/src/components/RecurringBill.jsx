import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, ChevronDown, ChevronRight, Edit } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * RecurringBill component for creating a new recurring bill.
 * This page is shown after vendor creation.
 */
const RecurringBill = ({ onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Get vendor data and file from router state, or use defaults
  const vendorData = location.state?.vendorData || {};
  const [uploadedFile, setUploadedFile] = useState(location.state?.uploadedFile || null);
  const autoApprove = location.state?.autoApprove || false;
  
  // Form state
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    description: '',
    accountingDepartment: '',
    lineItems: [
      { amount: '', description: '', category: '', class: '', job: '' }
    ],
    schedule: '',
    endsAfter: '',
    customFrequency: '',
    reviewers: []
  });
  
  // State for modals
  const [showCustomScheduleModal, setShowCustomScheduleModal] = useState(false);
  const [showCustomEndDateModal, setShowCustomEndDateModal] = useState(false);
  
  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Handle line item changes
  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...formData.lineItems];
    updatedLineItems[index] = { 
      ...updatedLineItems[index], 
      [field]: value 
    };
    
    setFormData({
      ...formData,
      lineItems: updatedLineItems
    });
  };
  
  // Add a new line item
  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [
        ...formData.lineItems,
        { amount: '', description: '', category: '', class: '', job: '' }
      ]
    });
  };
  
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
  
  // Handle submit - navigate to review page
  const handleSubmit = () => {
    console.log("Submitting recurring bill form:", formData);
    console.log("With vendor:", vendorData);
    console.log("With file:", uploadedFile);
    
    // Navigate to the review page with all the form data
    navigate('/recurring-bill-review', {
      state: {
        vendorData,
        uploadedFile,
        billData: formData
      }
    });
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left side - File upload area */}
        <div className="w-full md:w-1/2 p-6 flex flex-col overflow-auto pb-20">
          {/* File upload area that matches the design in image_1742726951322.png */}
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
        
        {/* Right side - New Recurring Bill form */}
        <div className="w-full md:w-1/2 flex flex-col border-l border-gray-200 overflow-hidden">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 pb-24">
              {/* Header with title and close button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">New recurring bill</h2>
                <button 
                  onClick={handleCloseClick}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Form content */}
              <div className="space-y-6">
                {/* Who's it for? section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Who's it for?</h3>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-800">{vendorData.name || 'Vendor'}</div>
                        <button className="ml-2 text-gray-400 hover:text-gray-600">
                          <Edit size={16} />
                        </button>
                      </div>
                      <div className="flex items-center">
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                          </svg>
                        </button>
                        <button className="ml-2 text-gray-400 hover:text-gray-600">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-sm text-gray-500 mb-1">
                        Vendor contact *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          value={vendorData.email || ''}
                          placeholder="email@test.org"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="text-gray-400"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="mr-2 text-gray-400"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      No previous payments to this vendor.
                    </div>
                  </div>
                </div>
                
                {/* What for? section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">What for?</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Invoice #
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        value={formData.invoiceNumber}
                        onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                        placeholder="Invoice #"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Invoice numbers for subsequent recurring bills will be automatically created with a suffix (-02, -03, etc.)
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        value={formData.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Bill accounting section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Bill accounting</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <select
                        className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                        value={formData.accountingDepartment}
                        onChange={(e) => handleFieldChange('accountingDepartment', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Finance">Finance</option>
                        <option value="IT">IT</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                        <option value="HR">HR</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Line items section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-700">Line items</h3>
                    <button
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Change currency
                    </button>
                  </div>
                  
                  {/* Line item expanded view */}
                  <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
                    <div className="flex justify-between p-3 bg-white border-b border-gray-200">
                      <div className="text-gray-500 text-sm">Amount</div>
                      <div className="text-gray-500 text-sm flex items-center">
                        <span className="mr-2">Expense</span>
                        <span>|</span>
                        <span className="ml-2">Item</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-medium">₹0.00</div>
                        <div className="text-gray-700">{'{accounting software} Description'}</div>
                      </div>
                      <div className="text-gray-500 mb-4">Item description</div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">{'{accounting software} Class'}</div>
                          <div className="relative">
                            <select
                              className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                            >
                              <option value="">Select class</option>
                              <option value="Class A">Class A</option>
                              <option value="Class B">Class B</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1">{'{accounting software} Job'}</div>
                          <div className="relative">
                            <select
                              className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                            >
                              <option value="">Select job</option>
                              <option value="Job A">Job A</option>
                              <option value="Job B">Job B</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-1">{'{accounting software} Department'}</div>
                        <div className="relative">
                          <select
                            className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                          >
                            <option value="">Select department</option>
                            <option value="Department A">Department A</option>
                            <option value="Department B">Department B</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">{'{accounting software} Billing'}</div>
                        <div className="relative">
                          <select
                            className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                          >
                            <option value="">Select billing</option>
                            <option value="Billing A">Billing A</option>
                            <option value="Billing B">Billing B</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex justify-between">
                        <div className="text-gray-700">Invoice total</div>
                        <div className="font-medium">₹0.00</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    className="text-primary hover:text-primary-dark text-sm font-medium mt-2"
                    onClick={addLineItem}
                  >
                    + Add line
                  </button>
                </div>
                
                {/* When should these payments arrive? section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">When should these payments arrive?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <select
                        className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                        value={formData.schedule}
                        onChange={(e) => {
                          handleFieldChange('schedule', e.target.value);
                          if (e.target.value === 'Custom') {
                            setShowCustomScheduleModal(true);
                          }
                        }}
                      >
                        <option value="">Schedule (required)</option>
                        <option value="Monthly on 1st">Monthly on 1st</option>
                        <option value="Monthly on 15th">Monthly on 15th</option>
                        <option value="Monthly on 30th">Monthly on 30th</option>
                        <option value="Custom">Custom</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <select
                        className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                        value={formData.endsAfter}
                        onChange={(e) => {
                          handleFieldChange('endsAfter', e.target.value);
                          if (e.target.value === 'Custom') {
                            setShowCustomEndDateModal(true);
                          }
                        }}
                      >
                        <option value="">Ends after (required)</option>
                        <option value="1 year">1 year</option>
                        <option value="2 years">2 years</option>
                        <option value="Never">Never</option>
                        <option value="Custom">Custom</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Send for review to section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Send for review to</h3>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    {/* Approval Sequence - First Approver */}
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-gray-600 font-medium">1</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-600">Require: <span className="text-gray-800 font-medium">Amy Adrion</span></div>
                      </div>
                    </div>
                    
                    {/* Approval Sequence - Second Approver */}
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-gray-600 font-medium">2</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-600">Require: <span className="text-gray-800 font-medium">Amit (Finance Director)</span></div>
                      </div>
                    </div>
                    
                    {/* Approval Sequence - Third Approver with Options */}
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-gray-600 font-medium">3</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-600">
                          Require: <span className="text-gray-800 font-medium">David Watson, Jan Levinston, or Calvin Lee</span>
                          <button className="ml-2 text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 16v-4"></path>
                              <path d="M12 8h.01"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Approve Button */}
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-800 font-medium">Approve bill</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fixed bottom actions bar */}
          <div className="border-t border-gray-200 p-4 bg-white flex justify-between">
            <button
              onClick={handleCloseClick}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
            >
              Discard changes
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md flex items-center"
            >
              Continue <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Cancel new recurring bill?</h3>
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

export default RecurringBill;