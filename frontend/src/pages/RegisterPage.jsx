import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the state passed from the previous page (SpendPage)
  const { email, companySize, spend } = location.state || {};
  
  // Form state
  const [formData, setFormData] = useState({
    email: email || '',
    firstName: '',
    lastName: '',
    password: '',
    interests: {
      corporateCards: false,
      accountsPayable: false,
      procurement: false,
      treasury: false
    }
  });
  
  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // Form validation
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
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      interests: {
        ...formData.interests,
        [name]: checked
      }
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would submit the data to a backend
      console.log('Registration data:', {
        ...formData,
        companySize,
        spend
      });
      
      // Navigate to the business info page with user data
      navigate('/business-info', { 
        state: { 
          userData: {
            ...formData,
            companySize,
            spend
          }
        } 
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo centered at top */}
      <div className="flex justify-center mt-8 mb-6">
        <div className="flex items-center">
          <img src="/Stride-Logo.svg" alt="Stride Logo" className="h-10 mr-2" />
          <span className="font-['Times_New_Roman'] font-bold tracking-widest text-[25.5px] text-[#FF5A1F]">Stride</span>
        </div>
      </div>
      
      <div className="w-full max-w-2xl mx-auto px-6">
        <h1 className="text-[40px] font-medium text-center text-gray-800 mb-1">
          Claim your account
        </h1>
        
        <p className="text-center text-gray-600 mb-8">
          Complete your application in as little as 10 minutes.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Work email address
            </p>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="w-full border-b border-gray-300 py-2 focus:border-gray-400 focus:outline-none bg-gray-50 text-gray-700 text-[16px]"
                readOnly
                disabled
              />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                First name (required)
              </p>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full border-b border-gray-300 py-2 focus:border-[#FF5A1F] focus:outline-none ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                placeholder=""
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Last name (required)
              </p>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full border-b border-gray-300 py-2 focus:border-[#FF5A1F] focus:outline-none ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                placeholder=""
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-1">
              Choose a password (required)
            </p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border-b border-gray-300 py-2 focus:border-[#FF5A1F] focus:outline-none ${
                  errors.password ? 'border-red-500' : ''
                }`}
                placeholder=""
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-2">
              Products you're interested in
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="corporateCards"
                  name="corporateCards"
                  checked={formData.interests.corporateCards}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[#FF5A1F] focus:ring-[#FF5A1F] focus:ring-offset-0 focus:ring-opacity-100 border-gray-300 rounded"
                />
                <label htmlFor="corporateCards" className="ml-2 block text-sm text-gray-700">
                  Corporate Cards and Expense Management
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="accountsPayable"
                  name="accountsPayable"
                  checked={formData.interests.accountsPayable}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[#FF5A1F] focus:ring-[#FF5A1F] focus:ring-offset-0 focus:ring-opacity-100 border-gray-300 rounded"
                />
                <label htmlFor="accountsPayable" className="ml-2 block text-sm text-gray-700">
                  Accounts Payable
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="procurement"
                  name="procurement"
                  checked={formData.interests.procurement}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[#FF5A1F] focus:ring-[#FF5A1F] focus:ring-offset-0 focus:ring-opacity-100 border-gray-300 rounded"
                />
                <label htmlFor="procurement" className="ml-2 block text-sm text-gray-700">
                  Procurement
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="treasury"
                  name="treasury"
                  checked={formData.interests.treasury}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[#FF5A1F] focus:ring-[#FF5A1F] focus:ring-offset-0 focus:ring-opacity-100 border-gray-300 rounded"
                />
                <label htmlFor="treasury" className="ml-2 block text-sm text-gray-700">
                  Treasury
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Don't worry. This is not a commitment to any product.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 mt-8 rounded bg-[#FF5A1F] hover:bg-[#E84A0F] text-white focus:outline-none transition-colors text-center font-medium"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;