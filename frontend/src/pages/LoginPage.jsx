import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Check if email is valid and complete to show password field
  useEffect(() => {
    if (email && validateEmail(email)) {
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }
    
    // Validate password is provided
    if (!password) {
      return;
    }
    
    // If valid, proceed with login
    console.log('Login with email:', email);
    
    // Mock authentication - in a real app, this would call an API
    // For now, we'll simulate successful login and redirect
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    
    // Redirect to the accounting dashboard as requested
    navigate('/accounting/dashboard');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!isValidEmail) {
      setIsValidEmail(true); // Reset validation when user starts typing again
    }
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // UPDATED POSITION: Moved content 25% to the right
  const contentStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: 'calc(25% + 20px)', // Added 25% padding from the left
  };

  // Form elements with increased width (10% wider)
  const formElementStyle = {
    width: '110%', // Increased from 100% to 110%
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

      {/* Content with updated positioning */}
      <div className="flex-grow flex items-center" style={contentStyle}>
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-left">
            <h2 className="text-3xl font-medium text-gray-900">
              Welcome to Stride
            </h2>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="email"
                  required
                  className={`w-full py-4 px-5 text-lg border border-gray-300 rounded-md focus:ring-1 focus:ring-[#FF5A1F] focus:border-[#FF5A1F] focus:outline-none ${!isValidEmail ? 'bg-red-50 border-red-300' : ''}`}
                  placeholder="Email address (required)"
                  value={email}
                  onChange={handleEmailChange}
                  style={formElementStyle}
                />
                
                {!isValidEmail && (
                  <p className="text-red-600 text-sm text-left ml-1 mt-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>
              
              {showPassword && (
                <div className="mt-4">
                  <input
                    type="password"
                    required
                    className="w-full py-4 px-5 text-lg border border-gray-300 rounded-md focus:ring-1 focus:ring-[#FF5A1F] focus:border-[#FF5A1F] focus:outline-none"
                    placeholder="Password (required)"
                    value={password}
                    onChange={handlePasswordChange}
                    style={formElementStyle}
                  />
                </div>
              )}
              
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={!showPassword || !password}
                  className={`w-full py-4 px-5 text-lg font-medium rounded-md transition-all duration-200 ${
                    (!showPassword || !password) 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#FF5A1F] hover:bg-[#E04A0F] text-white'
                  }`}
                  style={formElementStyle}
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-6">
            <p className="text-base text-center text-gray-500">
              Looking to get started with Stride for your business? <Link to="/signup" className="text-[#FF5A1F] hover:underline">Sign up →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;