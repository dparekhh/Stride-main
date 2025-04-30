import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

const BusinessInfoPage = () => {
  const notificationContext = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the state passed from the previous page (RegisterPage)
  const { userData } = location.state || {};
  
  const [formData, setFormData] = useState({
    legalBusinessName: '',
    businessWebsite: 'stridecard.com',
    streetAddress: '',
    floorOfficeNo: '',
    city: '',
    state: '',
    zipCode: '',
    companyType: '',
    dateIncorporated: '',
    panNumber: '',
    gstNumber: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = ['legalBusinessName', 'streetAddress', 'city', 'companyType', 'gstNumber'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Function to handle the "Save & continue" button
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would submit the data to a backend
      console.log('Business Information:', {
        ...formData,
        userData
      });
      
      // Navigate to the leaders info page
      navigate('/leaders-info', { 
        state: { 
          businessData: formData,
          userData
        } 
      });
    }
  };
  
  // Function to handle save and continue - always proceed to Leaders page regardless of validation
  const handleSaveAndContinue = () => {
    // Run validation just to update the error states visually
    validateForm();
    
    // Always navigate to the leaders info page without showing notification
    navigate('/leaders-info', { 
      state: { 
        businessData: formData,
        userData
      } 
    });
  };
  

  
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left sidebar */}
      <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Stride logo at top left */}
        <div className="p-4 mt-4 mb-8">
          <img src="/Stride-Logo.svg" alt="Stride Logo" className="h-7" />
        </div>
        
        {/* Navigation menu items */}
        <div className="flex-1">
          <div className="px-4 py-3 flex items-center bg-gray-100">
            <div className="h-5 w-5 mr-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-gray-900 font-medium">Business</span>
          </div>
          
          <div 
            className="px-4 py-3 flex items-center cursor-pointer hover:bg-gray-100"
            onClick={() => navigate('/leaders-info', { state: { businessData: formData, userData: location.state?.userData } })}
          >
            <div className="h-5 w-5 mr-3 flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-gray-500">Leaders</span>
          </div>
          
          <div 
            className="px-4 py-3 flex items-center cursor-pointer hover:bg-gray-100"
            onClick={() => {
              if (validateForm()) {
                navigate('/kyc', { 
                  state: { 
                    businessData: formData,
                    userData: location.state?.userData 
                  } 
                });
              }
            }}
          >
            <div className="h-5 w-5 mr-3 flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-gray-500">KYC</span>
          </div>
          
          <div className="px-4 py-3 flex items-center">
            <div className="h-5 w-5 mr-3 flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-500">Submit</span>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Fixed header */}
        <div className="bg-white py-6 px-8">
          <h1 className="text-3xl font-medium text-gray-900">Business Information</h1>
          <p className="text-gray-600 mt-1">We'll use this information to verify your business</p>
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-900 mb-5">General details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="legalBusinessName" className="block text-sm text-gray-600 mb-1">
                    Legal business name (required)
                  </label>
                  <input
                    type="text"
                    id="legalBusinessName"
                    name="legalBusinessName"
                    value={formData.legalBusinessName}
                    onChange={handleChange}
                    className={`w-2/3 border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none ${
                      errors.legalBusinessName ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.legalBusinessName && (
                    <p className="mt-1 text-xs text-red-500">{errors.legalBusinessName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="businessWebsite" className="block text-sm text-gray-600 mb-1">
                    Business website (if available)
                  </label>
                  <input
                    type="text"
                    id="businessWebsite"
                    name="businessWebsite"
                    value={formData.businessWebsite}
                    onChange={handleChange}
                    className="w-2/3 border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-900 mb-5">Company Address</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="streetAddress" className="block text-sm text-gray-600 mb-1">
                    Street address (required)
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className={`w-2/3 border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none ${
                      errors.streetAddress ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.streetAddress && (
                    <p className="mt-1 text-xs text-red-500">{errors.streetAddress}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="floorOfficeNo" className="block text-sm text-gray-600 mb-1">
                    Floor / Office No.
                  </label>
                  <input
                    type="text"
                    id="floorOfficeNo"
                    name="floorOfficeNo"
                    value={formData.floorOfficeNo}
                    onChange={handleChange}
                    className="w-2/3 border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm text-gray-600 mb-1">
                    City (Required)
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-2/3 border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none ${
                      errors.city ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                  )}
                </div>
                
                <div className="w-2/3">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="state" className="block text-sm text-gray-600 mb-1">
                        State
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none appearance-none bg-white"
                      >
                        <option value="">Select a state</option>
                        <option value="maharashtra">Maharashtra</option>
                        <option value="karnataka">Karnataka</option>
                        <option value="delhi">Delhi</option>
                        <option value="tamilnadu">Tamil Nadu</option>
                        <option value="telangana">Telangana</option>
                        {/* Add more Indian states as needed */}
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label htmlFor="zipCode" className="block text-sm text-gray-600 mb-1">
                        Zip code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none"
                        placeholder="e.g., 400001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-900 mb-5">Incorporation</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyType" className="block text-sm text-gray-600 mb-1">
                    Company type (required)
                  </label>
                  <input
                    type="text"
                    id="companyType"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    className={`w-2/3 border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none ${
                      errors.companyType ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.companyType && (
                    <p className="mt-1 text-xs text-red-500">{errors.companyType}</p>
                  )}
                </div>
                
                <div className="w-2/3">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="dateIncorporated" className="block text-sm text-gray-600 mb-1">
                        Date incorporated (required)
                      </label>
                      <select
                        id="dateIncorporated"
                        name="dateIncorporated"
                        value={formData.dateIncorporated}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none appearance-none bg-white"
                      >
                        <option value="">Select date</option>
                        <option value="2010">2010</option>
                        <option value="2011">2011</option>
                        <option value="2012">2012</option>
                        <option value="2013">2013</option>
                        <option value="2014">2014</option>
                        <option value="2015">2015</option>
                        <option value="2016">2016</option>
                        <option value="2017">2017</option>
                        <option value="2018">2018</option>
                        <option value="2019">2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </select>
                    </div>
                    
                    <div className="flex-1">
                      <label htmlFor="panNumber" className="block text-sm text-gray-600 mb-1">
                        PAN Number (required)
                      </label>
                      <input
                        type="text"
                        id="panNumber"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none"
                        placeholder="e.g., ABCDE1234F"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="gstNumber" className="block text-sm text-gray-600 mb-1">
                    GST Identification number (required)
                  </label>
                  <input
                    type="text"
                    id="gstNumber"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className={`w-2/3 border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none ${
                      errors.gstNumber ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., 29ABCDE1234F1Z5"
                  />
                  {errors.gstNumber && (
                    <p className="mt-1 text-xs text-red-500">{errors.gstNumber}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="button"
                onClick={handleSaveAndContinue}
                className="w-2/3 py-3 px-4 bg-[#FF5A1F] hover:bg-[#E84A0F] text-white rounded focus:outline-none transition-colors text-center font-medium"
              >
                Save & continue →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoPage;