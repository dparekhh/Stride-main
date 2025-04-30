import React, { useState, useRef } from 'react';
import { ArrowLeft, Search, X, Upload, User, Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecurringBillVendor from './RecurringBillVendor';

const NewRecurringBill = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showRecurringBillVendor, setShowRecurringBillVendor] = useState(false);
  
  // Mock vendors for demo
  const vendors = [
    { id: 1, name: 'GTI Properties', email: 'accounts@gtiproperties.com' },
    { id: 2, name: 'Stride Software', email: 'billing@stridesoftware.com' }
  ];
  
  const [filteredVendors, setFilteredVendors] = useState(vendors);
  
  if (!isOpen) return null;
  
  // If showing the RecurringBillVendor page, render that instead
  if (showRecurringBillVendor) {
    return (
      <RecurringBillVendor
        onBack={() => setShowRecurringBillVendor(false)}
        uploadedFile={uploadedFile}
        vendor={selectedVendor}
      />
    );
  }
  
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
  
  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowVendorDropdown(value.length > 0);
    
    // Filter vendors based on search term
    if (value) {
      const filtered = vendors.filter(vendor => 
        vendor.name.toLowerCase().includes(value.toLowerCase()) ||
        vendor.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredVendors(filtered);
    } else {
      setFilteredVendors(vendors);
    }
  };
  
  // Clear uploaded file
  const clearUploadedFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle vendor selection
  const handleVendorSelect = (vendor) => {
    setSearchTerm(vendor.name);
    setSelectedVendor(vendor);
    setShowVendorDropdown(false);
  };
  
  // Handle new vendor creation
  const handleCreateNewVendor = () => {
    // Create a new vendor object with the search term as the name
    const newVendor = { 
      id: Date.now(), // Temporary ID for the new vendor
      name: searchTerm,
      email: ''
    };
    setSelectedVendor(newVendor);
    setShowVendorDropdown(false);
  };
  
  // Handle recurring bill button click
  const handleRecurringBillClick = () => {
    if (selectedVendor) {
      setShowRecurringBillVendor(true);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Main content - two columns */}
      <div className="flex flex-col md:flex-row h-full">
        {/* Left column - File upload */}
        <div className="w-full md:w-1/2 border-r border-gray-200 p-6 flex flex-col">
          {/* File upload area */}
          <div 
            className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg ${uploadedFile ? 'border-primary bg-primary-50' : 'border-gray-300'} p-8`}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    clearUploadedFile();
                  }}
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
        
        {/* Right column - Vendor selection */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          {/* Header with back button and title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={onClose}
                className="mr-4 p-1 rounded-full hover:bg-gray-100"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold">New recurring bill</h1>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          
          <h2 className="text-lg font-medium mb-4">Who's it for?</h2>
          
          {/* Search input with dropdown */}
          <div className="relative mb-4">
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Search or create a new vendor"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowVendorDropdown(true)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-2.5"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedVendor(null);
                    setShowVendorDropdown(false);
                  }}
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
            
            {/* Vendor dropdown */}
            {showVendorDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                {filteredVendors.length > 0 ? (
                  <ul className="max-h-60 overflow-auto py-1">
                    {filteredVendors.map(vendor => (
                      <li 
                        key={vendor.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleVendorSelect(vendor)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 text-primary rounded-full flex items-center justify-center mr-3">
                            <span className="font-medium text-xs">
                              {vendor.name.split(' ').map(word => word[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{vendor.name}</p>
                            <p className="text-gray-500 text-sm">{vendor.email}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4">
                    <div 
                      className="flex items-center py-2 px-3 text-primary hover:bg-primary-50 rounded cursor-pointer"
                      onClick={handleCreateNewVendor}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      <span>Create "{searchTerm}" as a new vendor</span>
                    </div>
                    <p className="text-gray-500 text-sm px-3 py-2">No vendors found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Selected vendor information (when a vendor is selected) */}
          {selectedVendor && (
            <div className="p-4 border border-gray-200 rounded-lg mt-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 text-primary rounded-full flex items-center justify-center mr-4">
                  <span className="font-medium text-sm">
                    {selectedVendor.name.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{selectedVendor.name}</p>
                  {selectedVendor.email && <p className="text-gray-500 text-sm">{selectedVendor.email}</p>}
                </div>
              </div>
            </div>
          )}
          
          {/* Bottom action button - positioned at the bottom right */}
          <div className="mt-auto flex justify-end">
            <button
              onClick={handleRecurringBillClick}
              className={`bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md ${!selectedVendor ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selectedVendor}
            >
              New Recurring Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRecurringBill;