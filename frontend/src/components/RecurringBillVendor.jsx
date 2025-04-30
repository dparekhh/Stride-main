import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, X, ChevronDown, Info, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * RecurringBillVendor component that displays a file upload area
 * and a vendor information form.
 */
const RecurringBillVendor = ({ onBack, uploadedFile, vendor, onContinue }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [uploadedFileState, setUploadedFileState] = useState(uploadedFile);
  const [isNewVendor, setIsNewVendor] = useState(!vendor?.id || vendor.id === Date.now());
  const [activeTab, setActiveTab] = useState('general'); // 'general' or 'accounting'
  const [autoApprove, setAutoApprove] = useState(false);
  const [checkboxClicked, setCheckboxClicked] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Check if we should reset the form based on location state
  useEffect(() => {
    // If we're coming back from the review page with resetForm flag, clear the form
    if (location.state?.resetForm) {
      setUploadedFileState(null);
      setVendorForm({
        name: '',
        email: '',
        phone: '',
        gstin: '',
        country: '',
        state: '',
        owner: '',
        firstName: '',
        lastName: '',
        accountingSoftware: '',
        defaultCategory: '',
        paymentTerms: ''
      });
      setAutoApprove(false);
      setCheckboxClicked(false);
    }
  }, [location.state]);
  
  // Form state
  const [vendorForm, setVendorForm] = useState({
    name: vendor?.name || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    gstin: vendor?.gstin || '',
    country: '',
    state: '',
    owner: '',
    firstName: '',
    lastName: '',
    // Accounting tab fields
    accountingSoftware: '',
    defaultCategory: '',
    paymentTerms: ''
  });
  
  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setVendorForm({
      ...vendorForm,
      [field]: value
    });
  };
  
  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is a supported type (PDF, PNG, JPG)
    const validFileTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (validFileTypes.includes(file.type)) {
      setUploadedFileState(file);
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
        setUploadedFileState(file);
      } else {
        alert('Please upload a PDF, PNG, or JPG file.');
      }
    }
  };
  
  // Clear uploaded file
  const clearUploadedFile = (e) => {
    e.stopPropagation();
    setUploadedFileState(null);
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
    navigate('/bill-pay/bills', { 
      state: { 
        openRecurringBillsDrawer: true 
      } 
    });
  };
  
  // Handle cancel dismiss
  const handleCancelDismiss = () => {
    setShowCancelModal(false);
  };
  
  // Handle click on continue button
  const handleContinue = () => {
    // If onContinue prop exists, call it with form data, otherwise navigate
    if (onContinue) {
      onContinue(vendorForm, uploadedFileState);
    } else {
      // Pass form data and file as state to the next page
      navigate('/recurring-bill-vendor-review', { 
        state: { 
          vendorForm: vendorForm,
          uploadedFile: uploadedFileState,
          autoApprove: autoApprove
        } 
      });
    }
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
          {/* File upload area that matches the design in image_1742726951322.png */}
          <div 
            className="flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg border-gray-300 p-8"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current.click()}
          >
            {uploadedFileState ? (
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary-100 rounded-full mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium">{uploadedFileState.name}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {(uploadedFileState.size / 1024).toFixed(0)} KB
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
        
        {/* Right side - New Vendor form */}
        <div className="w-full md:w-1/2 p-6 flex flex-col border-l border-gray-200">
          {/* Header with back button and title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={onBack}
                className="mr-2 text-gray-600 hover:text-gray-900"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">New vendor</h2>
            </div>
            <button 
              onClick={handleCloseClick}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button 
                className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'general' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                onClick={() => setActiveTab('general')}
              >
                <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 21V9" stroke="currentColor" strokeWidth="2" />
                </svg>
                General
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'accounting' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
                onClick={() => setActiveTab('accounting')}
              >
                <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 8H16" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 16H16" stroke="currentColor" strokeWidth="2" />
                </svg>
                Bill accounting
              </button>
            </div>
          </div>
          
          {/* Form content - General Tab */}
          {activeTab === 'general' && (
            <div className="mt-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Basic info</h3>
                
                {/* Vendor name - Moved directly below Basic info heading */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    value={vendorForm.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                  />
                </div>
                
                {/* Accounting Software info notification - Changed to light green */}
                <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-start">
                  <Info className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Creating a new vendor on {'{Accounting Software}'}</span>
                      <br />
                      We will create a new vendor for you and link it to your existing card merchant.
                    </p>
                  </div>
                </div>
                
                {/* Country and State selection - with "Select" defaults */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <div className="relative">
                      <select
                        className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                        value={vendorForm.country}
                        onChange={(e) => handleFieldChange('country', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="United States of America">United States of America</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="India">India</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <div className="relative">
                      <select
                        className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                        value={vendorForm.state}
                        onChange={(e) => handleFieldChange('state', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="American Samoa">American Samoa</option>
                        <option value="Alabama">Alabama</option>
                        <option value="Alaska">Alaska</option>
                        <option value="Arizona">Arizona</option>
                        <option value="California">California</option>
                        <option value="New York">New York</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Vendor Owner field - Added as requested */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor owner
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    value={vendorForm.owner}
                    onChange={(e) => handleFieldChange('owner', e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Stride requires a single employee to own each vendor to provide accountability for all spend.
                  </p>
                </div>
              </div>
              
              {/* Vendor contact section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Vendor contact</h3>
                
                {/* First name and Last name */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      value={vendorForm.firstName}
                      onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      value={vendorForm.lastName}
                      onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Email - removed required indication */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    value={vendorForm.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                </div>
                
                {/* Phone - with default code as IN (+91) */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <div className="relative">
                      <select
                        className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                        defaultValue="IN (+91)"
                      >
                        <option value="IN (+91)">IN (+91)</option>
                        <option value="US (+1)">US (+1)</option>
                        <option value="CA (+1)">CA (+1)</option>
                        <option value="UK (+44)">UK (+44)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      value={vendorForm.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Form content - Bill Accounting Tab */}
          {activeTab === 'accounting' && (
            <div className="mt-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Bill accounting information</h3>
                <p className="text-gray-600 mb-6">
                  Configure how bills from this vendor will be processed and categorized in your accounting system.
                </p>
                
                {/* Accounting software */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accounting software
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                      value={vendorForm.accountingSoftware}
                      onChange={(e) => handleFieldChange('accountingSoftware', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Tally">Tally</option>
                      <option value="QuickBooks">QuickBooks</option>
                      <option value="Xero">Xero</option>
                      <option value="Zoho Books">Zoho Books</option>
                      <option value="SAP">SAP</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Vendor information will be synchronized with your accounting software
                  </p>
                </div>
                
                {/* Default expense category */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default expense category
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                      value={vendorForm.defaultCategory}
                      onChange={(e) => handleFieldChange('defaultCategory', e.target.value)}
                    >
                      <option value="">Select a default category</option>
                      <option value="Rent">Rent</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Software">Software</option>
                      <option value="Professional Services">Professional Services</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Bills from this vendor will default to this category unless changed
                  </p>
                </div>
                
                {/* Payment terms */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment terms
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-2 pr-8 border border-gray-300 rounded-lg appearance-none focus:ring-primary focus:border-primary"
                      value={vendorForm.paymentTerms}
                      onChange={(e) => handleFieldChange('paymentTerms', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Due on Receipt">Due on Receipt</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Default payment terms for bills from this vendor
                  </p>
                </div>
                
                {/* Auto-approve bills */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Auto-approve bills</h3>
                  <div className="flex items-center">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="autoApprove" 
                        name="autoApprove"
                        checked={autoApprove}
                        onChange={() => {
                          setAutoApprove(!autoApprove);
                          setCheckboxClicked(true);
                        }}
                        className={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer ${autoApprove ? 'right-0 border-primary' : 'left-0 border-gray-300'}`}
                        style={{
                          top: 0,
                          transition: 'all 0.3s',
                          transform: autoApprove ? 'translateX(4px)' : 'translateX(0)',
                        }}
                      />
                      <label 
                        htmlFor="autoApprove" 
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${autoApprove ? 'bg-primary-light' : 'bg-gray-200'}`}
                      ></label>
                    </div>
                    <span className="text-gray-700 font-medium">{autoApprove ? 'On' : 'Off'}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Automatically approve bills from this vendor without manual review
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Bottom actions - updated button text to "Continue ->" */}
          <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
            >
              Discard changes
            </button>
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md flex items-center"
            >
              Continue <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringBillVendor;