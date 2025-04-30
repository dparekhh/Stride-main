import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }
    
    // If valid, proceed with signup
    console.log('Sign up with email:', email);
    
    // Store email in localStorage
    localStorage.setItem('userEmail', email);
    
    // Log the current navigation action for debugging
    console.log('SignUpPage - Navigating to /email-verification with email:', email);
    
    // Navigate to email verification page with email in state
    // Use replace: true to ensure this replaces the current history entry
    navigate('/email-verification', { 
      state: { email },
      replace: true
    });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!isValidEmail) {
      setIsValidEmail(true); // Reset validation when user starts typing again
    }
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

      {/* Centered content */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-lg w-full space-y-8 text-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">
              Get started for free.
            </h1>
            <p className="text-gray-500 text-lg max-w-lg mx-auto mt-4">
              Automated accounting and real-time expense analysis – beautifully reimagined by experts to save you time and money.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="flex items-center">
                <input
                  type="email"
                  required
                  className={`flex-grow py-4 px-6 border border-gray-300 rounded-l-md focus:ring-1 focus:ring-[#FF5A1F] focus:border-[#FF5A1F] focus:outline-none text-lg ${!isValidEmail ? 'bg-red-50 border-red-300' : ''}`}
                  placeholder="What's your work email?"
                  value={email}
                  onChange={handleEmailChange}
                />
                <button
                  type="submit"
                  className="bg-[#FF5A1F] hover:bg-[#E04A0F] text-white py-4 px-6 rounded-r-md font-medium transition-all duration-200 whitespace-nowrap text-lg"
                >
                  Get started for free
                </button>
              </div>
              
              {!isValidEmail && (
                <p className="text-red-600 text-sm text-left ml-1 mt-1">
                  Please enter a valid email address
                </p>
              )}
            </form>
          </div>
          
          <div className="mt-6 text-base text-gray-500">
            Already have an account? <Link to="/login" className="text-[#FF5A1F] hover:underline">Login ›</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;