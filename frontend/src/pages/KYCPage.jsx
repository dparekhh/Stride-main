import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const KYCPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the state passed from the previous page (LeadersInfoPage)
  const { leaderData, businessData, userData } = location.state || {};
  
  const handleSubmit = () => {
    // Navigate to the LogInRedirect page instead of Accounting Dashboard
    navigate('/login-redirect');
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
          
          <div 
            className="px-4 py-3 flex items-center cursor-pointer hover:bg-gray-100"
            onClick={() => navigate('/leaders-info', { state: location.state })}
          >
            <div className="h-5 w-5 mr-3 flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-gray-500">Leaders</span>
          </div>
          
          <div className="px-4 py-3 flex items-center bg-gray-100">
            <div className="h-5 w-5 mr-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-gray-900 font-medium">KYC</span>
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
      <div className="flex-1 flex flex-col p-8">
        <button 
          onClick={() => navigate('/leaders-info', { state: location.state })}
          className="text-gray-400 hover:text-gray-600 mb-4 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <div className="mb-4">
          <h1 className="text-3xl font-normal text-gray-900">Complete User KYC</h1>
          <p className="text-gray-600 mt-2">Complete User and Company KYC</p>
        </div>
        
        {/* KYC Completion Section */}
        <div className="w-full border border-gray-300 p-4 flex items-center justify-between rounded-sm mb-8">
          <div>Complete KYC</div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        {/* Success Section */}
        <div className="w-full border border-dashed border-gray-300 p-4 flex items-center justify-center rounded-sm mb-32">
          Success
        </div>
        
        {/* Vertical Dashed Line Connecting Sections */}
        <div className="flex justify-center">
          <div className="border-l border-dashed border-gray-300 h-32"></div>
        </div>
        
        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#FF5A1F] text-white py-3 rounded-sm font-medium mt-4"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default KYCPage;