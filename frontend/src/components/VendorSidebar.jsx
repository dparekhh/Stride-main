import React, { useState, useRef } from 'react';
import { X, Save, ChevronDown, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

const VendorSidebar = ({ isOpen, onClose }) => {
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const msmeFileInputRef = useRef(null);
  const itrFileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    gstin: '',
    pan: '',
    country: 'India',
    state: '',
    city: '',
    addressLine1: '',
    addressLine2: '',
    pinCode: '',
    category: '',
    notes: '',
    msmeFile: null,
    itrFile: null
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    }
  };

  // Trigger file input click
  const triggerFileInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name) {
      showError("Vendor name is required");
      return;
    }
    
    // Simulate successful submission for now
    showSuccess("Vendor created successfully!");
    onClose();
    
    // Navigate directly to the create bill page
    console.log("Navigating directly to create-bill page from VendorSidebar");
    navigate("/create-bill", { 
      state: { 
        vendorData: formData,
        uploadedInvoice: null,
        comingFromVendorCreation: true,
        timestamp: new Date().toISOString()
      } 
    });
    
    // Reset form
    setFormData({
      name: '',
      owner: '',
      email: '',
      phone: '',
      gstin: '',
      pan: '',
      country: 'India',
      state: '',
      city: '',
      addressLine1: '',
      addressLine2: '',
      pinCode: '',
      category: '',
      notes: '',
      msmeFile: null,
      itrFile: null
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay with blur effect */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-1/2 bg-white shadow-lg z-50 overflow-y-auto pb-20">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">New Vendor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Basic Information Section */}
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">Basic Information</h3>
                <button type="button" className="text-gray-500 flex items-center">
                  <ChevronDown size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Vendor Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter vendor name"
                    required
                  />
                </div>
                
                {/* Vendor Owner */}
                <div>
                  <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor Owner
                  </label>
                  <input
                    type="text"
                    id="owner"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter vendor owner"
                  />
                </div>
                
                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                
                {/* GSTIN & PAN */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gstin" className="block text-sm font-medium text-gray-700 mb-1">
                      GSTIN
                    </label>
                    <input
                      type="text"
                      id="gstin"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="GST Identification Number"
                    />
                  </div>
                  <div>
                    <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
                      PAN
                    </label>
                    <input
                      type="text"
                      id="pan"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Permanent Account Number"
                    />
                  </div>
                </div>
                
                {/* Upload MSME Certificate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload MSME Certificate
                  </label>
                  <input
                    type="file"
                    ref={msmeFileInputRef}
                    name="msmeFile"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <button
                    type="button"
                    onClick={() => triggerFileInput(msmeFileInputRef)}
                    className="w-full border border-dashed border-gray-300 rounded-md px-3 py-3 flex items-center justify-center focus:outline-none hover:bg-gray-50"
                  >
                    <Upload size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {formData.msmeFile ? formData.msmeFile.name : "Click to upload MSME Certificate"}
                    </span>
                  </button>
                </div>
                
                {/* Upload ITR */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload ITR
                  </label>
                  <input
                    type="file"
                    ref={itrFileInputRef}
                    name="itrFile"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <button
                    type="button"
                    onClick={() => triggerFileInput(itrFileInputRef)}
                    className="w-full border border-dashed border-gray-300 rounded-md px-3 py-3 flex items-center justify-center focus:outline-none hover:bg-gray-50"
                  >
                    <Upload size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {formData.itrFile ? formData.itrFile.name : "Click to upload ITR"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Address Section */}
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">Address</h3>
                <button type="button" className="text-gray-500 flex items-center">
                  <ChevronDown size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Country"
                  />
                </div>
                
                {/* State & City */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="City"
                    />
                  </div>
                </div>
                
                {/* Address Line 1 */}
                <div>
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Address Line 1"
                  />
                </div>
                
                {/* Address Line 2 */}
                <div>
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Address Line 2"
                  />
                </div>
                
                {/* PIN Code */}
                <div>
                  <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="PIN Code"
                  />
                </div>
              </div>
            </div>
            
            {/* Additional Details Section */}
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">Additional Details</h3>
                <button type="button" className="text-gray-500 flex items-center">
                  <ChevronDown size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select category</option>
                    <option value="IT">IT & Software</option>
                    <option value="Office">Office Supplies</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Legal">Legal Services</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Additional notes about this vendor"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </form>
        
        {/* Fixed Save Button at the bottom */}
        <div className="fixed bottom-0 right-0 w-1/2 bg-white border-t border-gray-200 p-4 flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
          >
            <Save size={16} className="mr-1" />
            Save Vendor
          </button>
        </div>
      </div>
    </>
  );
};

export default VendorSidebar;