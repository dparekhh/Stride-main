import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import AddLeaderDrawer from '../components/AddLeaderDrawer';

const LeadersInfoPage = () => {
  const notificationContext = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the state passed from the previous page (BusinessInfoPage)
  const { businessData, userData } = location.state || {};
  
  const [isAddLeaderDrawerOpen, setIsAddLeaderDrawerOpen] = useState(false);
  const [leadersData, setLeadersData] = useState([]);
  
  const [formData, setFormData] = useState({
    controllingOfficerName: '',
    streetAddress: '',
    floorOfficeNo: '',
    city: '',
    state: '',
    zipCode: '',
    companyType: '',
    dateIncorporated: '',
    panNumber: ''
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
  
  // Function to handle opening the Add Leader drawer
  const handleOpenAddLeaderDrawer = () => {
    setIsAddLeaderDrawerOpen(true);
  };
  
  // Function to handle closing the Add Leader drawer
  const handleCloseAddLeaderDrawer = () => {
    setIsAddLeaderDrawerOpen(false);
  };
  
  // Function to handle saving leader data from the drawer
  const handleSaveLeaderData = (leaderData) => {
    // Update the controlling officer name in the form
    setFormData({
      ...formData,
      controllingOfficerName: `${leaderData.firstName} ${leaderData.lastName}, ${leaderData.title}`
    });
    
    // Add the leader data to the leaders array
    setLeadersData([...leadersData, leaderData]);
    
    // Clear any errors
    if (errors.controllingOfficerName) {
      setErrors({
        ...errors,
        controllingOfficerName: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = ['controllingOfficerName', 'streetAddress', 'city'];
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
      console.log('Leaders Information:', {
        ...formData,
        businessData,
        userData
      });
      
      // Navigate to the next page (e.g., KYV)
      navigate('/kyv', { 
        state: { 
          leaderData: formData,
          businessData,
          userData
        } 
      });
    }
  };
  
  // Function to handle save and continue - always proceed to KYC page regardless of validation
  const handleSaveAndContinue = () => {
    // Run validation just to update the error states visually
    validateForm();
    
    // Always navigate to the KYC page without showing notification
    navigate('/kyc', { 
      state: { 
        leaderData: formData,
        businessData: location.state?.businessData,
        userData: location.state?.userData
      } 
    });
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex flex-1">
        {/* Left sidebar */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Stride logo at top left */}
          <div className="p-4 mt-4 mb-8">
            <img src="/Stride-Logo.svg" alt="Stride Logo" className="h-7" />
          </div>
          
          {/* Navigation menu items */}
          <div className="flex-1">
            <div 
              className="px-4 py-3 flex items-center cursor-pointer hover:bg-gray-100"
              onClick={() => navigate('/business-info', { state: location.state })}
            >
              <div className="h-5 w-5 mr-3 flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-gray-500">Business</span>
            </div>
            
            <div className="px-4 py-3 flex items-center bg-gray-100">
              <div className="h-5 w-5 mr-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-gray-900 font-medium">Leaders</span>
            </div>
            
            <div 
              className="px-4 py-3 flex items-center cursor-pointer hover:bg-gray-100"
              onClick={() => navigate('/kyc', { state: { leaderData: formData, businessData: location.state?.businessData, userData: location.state?.userData } })}
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
            <button 
              onClick={() => navigate('/business-info', { state: location.state })}
              className="text-gray-400 hover:text-gray-600 mb-2 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            <h1 className="text-3xl font-medium text-gray-900">Leaders Information</h1>
            <p className="text-gray-600 mt-1">Tell us about the controlling officer of your business</p>
          </div>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-900 mb-5">Controlling officer</h2>
                <p className="text-gray-600 mb-5">Anyone responsible for controlling, managing, or leading the business finance (CEO, CFO, COO, President, VP, Treasurer, or similar roles)</p>
                
                <div className="space-y-4">
                  <div>
                    {formData.controllingOfficerName ? (
                      <div className="flex items-center">
                        <div className="w-2/3 border border-gray-300 p-3 rounded-md bg-gray-50 text-gray-800">
                          {formData.controllingOfficerName}
                        </div>
                        <button
                          type="button"
                          onClick={handleOpenAddLeaderDrawer}
                          className="ml-2 text-gray-600 hover:text-gray-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenAddLeaderDrawer}
                        className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add controlling officer
                      </button>
                    )}
                    {errors.controllingOfficerName && (
                      <p className="mt-1 text-xs text-red-500">{errors.controllingOfficerName}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-900 mb-5">Company Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      className={`w-2/3 border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none ${
                        errors.streetAddress ? 'border-red-500' : ''
                      }`}
                      placeholder="Street address (required)"
                    />
                    {errors.streetAddress && (
                      <p className="mt-1 text-xs text-red-500">{errors.streetAddress}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      id="floorOfficeNo"
                      name="floorOfficeNo"
                      value={formData.floorOfficeNo}
                      onChange={handleChange}
                      className="w-2/3 border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none"
                      placeholder="Floor / Office No."
                    />
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-2/3 border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none ${
                        errors.city ? 'border-red-500' : ''
                      }`}
                      placeholder="City (Required)"
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                    )}
                  </div>
                  
                  <div className="w-2/3">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none appearance-none bg-white"
                        >
                          <option value="">State</option>
                          <option value="maharashtra">Maharashtra</option>
                          <option value="karnataka">Karnataka</option>
                          <option value="delhi">Delhi</option>
                          <option value="tamilnadu">Tamil Nadu</option>
                          <option value="telangana">Telangana</option>
                          {/* Add more Indian states as needed */}
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <select
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none appearance-none bg-white"
                        >
                          <option value="">Zip code</option>
                          <option value="400001">400001</option>
                          <option value="400002">400002</option>
                          <option value="400003">400003</option>
                          {/* Add more zip codes as needed */}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-900 mb-5">Incorporation</h2>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      id="companyType"
                      name="companyType"
                      value={formData.companyType}
                      onChange={handleChange}
                      className="w-2/3 border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none"
                      placeholder="Company type (required)"
                    />
                  </div>
                  
                  <div className="w-2/3">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <select
                          id="dateIncorporated"
                          name="dateIncorporated"
                          value={formData.dateIncorporated}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none appearance-none bg-white"
                        >
                          <option value="">Date incorporated (required)</option>
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
                        <input
                          type="text"
                          id="panNumber"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:outline-none"
                          placeholder="PAN Number (required)"
                        />
                      </div>
                    </div>
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
      
      {/* Add Leader Drawer component */}
      <AddLeaderDrawer 
        isOpen={isAddLeaderDrawerOpen}
        onClose={handleCloseAddLeaderDrawer}
        onSave={handleSaveLeaderData}
      />
    </div>
  );
};

export default LeadersInfoPage;