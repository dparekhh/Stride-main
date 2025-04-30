import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showShakeAnimation, setShowShakeAnimation] = useState(false);
  
  // Create refs for each input
  const inputRefs = useRef([]);
  
  // Get email from location state or localStorage
  useEffect(() => {
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem('userEmail');
    const emailToUse = emailFromState || emailFromStorage || '';
    console.log('Email Verification Page - Email from state:', emailFromState);
    console.log('Email Verification Page - Email from storage:', emailFromStorage);
    console.log('Email Verification Page - Using email:', emailToUse);
    setEmail(emailToUse);
  }, [location.state]);
  
  // Setup countdown timer for resend button
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timer, canResend]);
  
  // Handle input change
  const handleInputChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    // Create a new verification code array
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);
    
    // Clear any existing error
    if (error) setError('');
    
    // Move to the next input if current one is filled
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    
    // Auto-submit if all fields are filled
    if (index === 5 && value && newVerificationCode.every(digit => digit)) {
      handleVerify();
    }
  };

  // Handle input keydown
  const handleKeyDown = (index, e) => {
    // If backspace and current input is empty, move to previous input
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newVerificationCode = pastedData.split('');
      setVerificationCode(newVerificationCode);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  // Reset verification code and focus first input
  const resetVerificationCode = () => {
    setVerificationCode(['', '', '', '', '', '']);
    // Set focus to first input box after a brief delay to ensure DOM is updated
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 10);
  };

  // Show error with shake animation
  const showError = (message) => {
    setError(message);
    setShowShakeAnimation(true);
    
    // Reset shake animation state after it completes
    setTimeout(() => {
      setShowShakeAnimation(false);
      resetVerificationCode();
    }, 500);
  };

  // Handle verification
  const handleVerify = () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setIsSubmitting(true);
    
    // Mock verification process - in a real implementation, this would
    // call your backend API to verify the code
    setTimeout(() => {
      console.log('Verifying email with code:', code);
      
      // For demo purposes, let's simulate a success/failure scenario
      // In a real implementation, this would check against the backend
      if (code === '123456') { // Success case - correct code
        localStorage.setItem('emailVerified', 'true');
        setIsSubmitting(false);
        
        // Show verification success animation
        setIsVerified(true);
        
        // Navigate to next step in the signup flow after animation
        setTimeout(() => {
          navigate('/company-size', { state: { email } });
        }, 2500); // Increased to 2.5 seconds as requested
      } else { // Failure case - incorrect code
        setIsSubmitting(false);
        showError('Incorrect verification code');
      }
    }, 1000);
  };
  
  // Handle resend code
  const handleResendCode = () => {
    if (!canResend) return;
    
    // Reset the timer and disable resend button
    setTimer(30);
    setCanResend(false);
    
    // Mock resend process
    console.log('Resending verification code to:', email);
    
    // In a real implementation, this would call your backend API
    // to request a new verification code
  };
  
  // Framer Motion variants for the success animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.2,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  // Shake animation variants
  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
      transition: { duration: 0.5 }
    }
  };
  
  // Circle with checkmark animation
  const CircleCheckAnimation = () => (
    <motion.div 
      className="relative w-20 h-20 mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: 0.3 
      }}
    >
      <div className="absolute inset-0 bg-[#10B981] rounded-full flex items-center justify-center">
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </motion.svg>
      </div>
    </motion.div>
  );
  
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
        <AnimatePresence mode="wait">
          {!isVerified ? (
            <motion.div 
              key="verification-form"
              className="max-w-lg w-full space-y-8 text-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Verify your email
                </h1>
                <p className="text-gray-500 text-lg max-w-lg mx-auto mt-4">
                  We've sent a 6-digit code to <span className="font-medium text-gray-900">{email}</span>. 
                  Enter the code below to verify your email address.
                </p>
              </div>
              
              <div className="mt-12">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerify();
                  }}
                  className="max-w-lg mx-auto"
                >
                  <motion.div 
                    className="flex items-center justify-center space-x-3"
                    animate={showShakeAnimation ? "shake" : "idle"}
                    variants={shakeVariants}
                  >
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        className={`w-12 h-14 text-center border rounded-md focus:ring-1 focus:outline-none text-lg ${
                          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FF5A1F] focus:border-[#FF5A1F]'
                        }`}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : null}
                        autoFocus={index === 0}
                      />
                    ))}
                  </motion.div>
                  
                  {error && (
                    <p className="text-red-600 text-sm mt-2">{error}</p>
                  )}
                  
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting || verificationCode.some(digit => !digit)}
                      className={`w-full bg-[#FF5A1F] hover:bg-[#E04A0F] text-white py-4 px-6 rounded-md font-medium transition-all duration-200 text-lg ${
                        (isSubmitting || verificationCode.some(digit => !digit)) 
                          ? 'opacity-70 cursor-not-allowed' 
                          : ''
                      }`}
                    >
                      {isSubmitting ? 'Verifying...' : 'Verify Email'}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="mt-6 text-base text-gray-500">
                Didn't receive a code?{' '}
                <button 
                  onClick={handleResendCode}
                  disabled={!canResend}
                  className={`text-[#FF5A1F] hover:underline focus:outline-none ${!canResend ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {canResend ? 'Resend code' : `Resend code in ${timer}s`}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success-animation"
              className="max-w-lg w-full space-y-10 text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-3xl font-bold text-gray-900"
                variants={itemVariants}
              >
                Email Verified Successfully!
              </motion.h1>
              
              <CircleCheckAnimation />
              
              <motion.p 
                className="text-gray-500 text-lg"
                variants={itemVariants}
              >
                Redirecting to setup...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmailVerificationPage;