import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const CompanySizePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSize, setSelectedSize] = useState('');
  
  // Get email from state passed by the SignUpPage
  const email = location.state?.email || '';
  
  const companySizes = [
    '1-10 Employees',
    '11-50 Employees',
    '51-100 Employees',
    '101-250 Employees',
    '251+ Employees'
  ];
  
  const handleSizeSelection = (size) => {
    setSelectedSize(size);
    
    // Store the company size selection
    localStorage.setItem('companySize', size);
    
    // In a real app, this would submit the data to a backend
    console.log('Company size selected:', size);
    console.log('User email:', email);
    
    // Navigate to the SpendPage with email and company size
    navigate('/spend', { state: { email, companySize: size } });
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo in top-left corner with "Stride" text */}
      <div className="p-6">
        <div className="flex items-center">
          <img src="/Stride-Logo.svg" alt="Stride Logo" className="h-10 mr-2" />
          <span className="font-['Times_New_Roman'] font-bold tracking-widest text-[25.5px] text-[#FF5A1F]">Stride</span>
        </div>
      </div>
      
      {/* Progress bar - 1 of 2 steps */}
      <div className="w-full px-4">
        <div className="h-2 bg-gray-200 rounded-full max-w-4xl mx-auto">
          <div className="h-full bg-[#FF5A1F] rounded-full w-1/2"></div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center max-w-xl mx-auto w-full px-4">
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">Is Stride right for your business?</p>
          <h1 className="text-4xl font-bold text-gray-800">How big is your company?</h1>
        </div>
        
        <div className="w-full space-y-4">
          {companySizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeSelection(size)}
              className="w-full py-4 px-6 text-left bg-white border border-gray-300 rounded-md hover:border-[#FF5A1F] hover:shadow transition-all text-gray-700 font-medium"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanySizePage;