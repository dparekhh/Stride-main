import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddLeaderDrawer = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    useMyInfo: false,
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    hasAadhaar: '',
    dateOfBirth: '',
    aadhaarLastFour: '',
    streetAddress: '',
    floorSuiteOffice: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Drawer content - exactly 50% width */}
      <div 
        className="relative w-full md:w-1/2 bg-white shadow-xl transition-transform transform flex flex-col"
        style={{
          animation: 'slideInFromRight 0.3s ease-out forwards',
          height: '100vh'
        }}
      >
        {/* Header (non-scrollable) with cross button at top right */}
        <div className="px-6 py-6 border-b border-gray-200 relative">
          {/* Close button absolutely positioned at top right */}
          <button
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
          
          <div>
            <h2 className="text-2xl font-bold">Add leader</h2>
            <p className="text-gray-600 mt-1">Provide information about any one member of the executive team, like a CFO, Managing Director, or President</p>
          </div>
        </div>
        
        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            {/* Use my information checkbox */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="useMyInfo"
                  checked={formData.useMyInfo}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Use my information, I am a member of the executive team</span>
              </label>
            </div>
            
            {/* General details section */}
            <div className="mb-6">
              <h3 className="text-base font-medium mb-4">General details</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none"
                    placeholder="First name (required)"
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none"
                    placeholder="Last name (required)"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none appearance-none bg-white"
                >
                  <option value="">Title (required)</option>
                  <option value="CEO">CEO</option>
                  <option value="CFO">CFO</option>
                  <option value="COO">COO</option>
                  <option value="President">President</option>
                  <option value="Managing Director">Managing Director</option>
                  <option value="Director">Director</option>
                  <option value="VP">VP</option>
                </select>
              </div>
              
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="Email (required)"
                />
              </div>
              
              <div className="mb-4">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="Phone number (required)"
                />
              </div>
            </div>
            
            {/* Identification section */}
            <div className="mb-6">
              <h3 className="text-base font-medium mb-4">Identification</h3>
              
              <div className="mb-4">
                <input
                  type="text"
                  name="hasAadhaar"
                  value={formData.hasAadhaar}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="Does this individual have a Aadhaar card?"
                />
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="Date of Birth"
                />
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  name="aadhaarLastFour"
                  value={formData.aadhaarLastFour}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="Last four digits of Aadhaar card"
                />
              </div>
            </div>
            
            {/* Personal address section */}
            <div className="mb-6">
              <h3 className="text-base font-medium mb-4">Personal address</h3>
              <p className="text-sm text-gray-600 mb-4">Provide a physical U.S. address. We are unable to verify PO box addresses.</p>
              
              <div className="mb-4">
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="Street address (required)"
                />
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  name="floorSuiteOffice"
                  value={formData.floorSuiteOffice}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="Floor / Suite / Office #"
                />
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="City (required)"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none appearance-none bg-white"
                >
                  <option value="">State (required)</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="delhi">Delhi</option>
                  <option value="tamilnadu">Tamil Nadu</option>
                  <option value="telangana">Telangana</option>
                </select>
                
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  placeholder="Zip code (required)"
                />
              </div>
            </div>
          </form>
        </div>
        
        {/* Fixed footer with buttons */}
        <div className="border-t border-gray-200 p-6 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#FF5A1F] hover:bg-[#E84A0F] text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AddLeaderDrawer;