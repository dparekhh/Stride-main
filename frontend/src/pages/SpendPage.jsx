import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SpendPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the state passed from the previous page (CompanySizePage)
  const { email, companySize } = location.state || {};
  
  // Define spend ranges based on the image
  const spendRanges = [
    "Under ₹ 10,00,000/mo",
    "₹20,00,000 - ₹50,00,000/mo",
    "₹50,00,000 - ₹1,00,00,000/mo",
    "Over ₹1,00,00,000/mo"
  ];
  
  const handleSpendSelection = (spend) => {
    // In a real app, this would submit the data to a backend
    console.log('Spend range selected:', spend);
    console.log('User email:', email);
    console.log('Company size:', companySize);
    
    // Navigate to the registration page with all collected information
    navigate('/register', { state: { email, companySize, spend } });
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo in top-left corner with "Stride" text */}
      <div className="p-6">
        <div className="flex items-center">
          <img src="/Stride-Logo.jpg" alt="Stride Logo" className="h-10 mr-2" />
          <span className="font-['Times_New_Roman'] font-bold tracking-widest text-[25.5px] text-[#FF5A1F]">Stride</span>
        </div>
      </div>
      
      {/* Progress bar - 2 of 2 steps (completed) */}
      <div className="w-full px-4">
        <div className="h-2 bg-gray-200 rounded-full max-w-4xl mx-auto">
          <div className="h-full bg-[#FF5A1F] rounded-full w-full"></div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center max-w-xl mx-auto w-full px-4">
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">Is Stride right for your business?</p>
          <h1 className="text-4xl font-bold text-gray-800">What's your current monthly business card spend?</h1>
          <p className="text-gray-600 mt-4">Don't worry if you don't use cards yet—just estimate your monthly spend.</p>
        </div>
        
        <div className="w-full space-y-4">
          {spendRanges.map((spend) => (
            <button
              key={spend}
              onClick={() => handleSpendSelection(spend)}
              className="w-full py-4 px-6 text-left bg-white border border-gray-300 rounded-md hover:border-[#FF5A1F] hover:shadow transition-all text-gray-700 font-medium"
            >
              {spend}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendPage;