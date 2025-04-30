// src/pages/AccountingSetupAccount.jsx
import React, { useState, useEffect } from "react";
import { X, ChevronRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccounting } from "../contexts/AccountingContext";

const AccountingSetupAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { connectProvider } = useAccounting();
  
  // Get provider information from navigation state
  const providerId = location.state?.provider;
  const providerName = location.state?.providerName;
  
  // Form state
  const [accountType, setAccountType] = useState("new"); // "new" or "existing"
  const [accountName, setAccountName] = useState("");
  const [existingAccounts] = useState([
    { id: "acc1", name: "Main Business Account" },
    { id: "acc2", name: "Finance Department" },
    { id: "acc3", name: "Operations" }
  ]);
  const [selectedAccount, setSelectedAccount] = useState("");
  
  // Connection state
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionComplete, setConnectionComplete] = useState(false);
  
  // Validate form before enabling continue button
  const isFormValid = accountType === "new" 
    ? accountName.trim().length > 0 
    : selectedAccount !== "";
  
  // Effect to redirect if provider information is missing
  useEffect(() => {
    if (!providerId || !providerName) {
      console.log("Missing provider information, redirecting to connect page");
      navigate('/accounting/connect');
    }
  }, [providerId, providerName, navigate]);
  
  // Handle close button click
  const handleClose = () => {
    navigate('/accounting');
  };
  
  // Handle account connection
  const handleConnect = () => {
    if (!isFormValid) return;
    
    // Start connecting animation
    setIsConnecting(true);
    
    // Get the account name to be used
    const finalAccountName = accountType === "new" 
      ? accountName.trim() 
      : existingAccounts.find(acc => acc.id === selectedAccount)?.name;
    
    // Simulate connection process
    setTimeout(() => {
      // After successful connection, update context
      setConnectionComplete(true);
      
      // Update the accounting context with provider and account details
      connectProvider(providerId, providerName, finalAccountName);
      
      // Show success notification (already handled in the UI with connectionComplete state)
      
      // Redirect to Stride Card page after a brief delay
      setTimeout(() => {
        navigate('/accounting/stride-card', { 
          state: { 
            success: true, 
            message: `Successfully connected ${providerName}` // Simplified message format for cleaner notifications
          } 
        });
      }, 1500);
    }, 2000);
  };
  
  // Radio button change handler
  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    // Reset form values when switching account type
    if (type === "new") {
      setSelectedAccount("");
    } else {
      setAccountName("");
    }
  };
  
  return (
    <div className="min-h-full w-full flex flex-col md:flex-row">
      {/* Left side - Account setup form */}
      <div className="w-full md:w-1/2 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Connect with {providerName}</h1>
        
        <h2 className="text-xl font-medium mb-6 mt-8">
          Which {providerName} account will track your Stride balance?
        </h2>
        
        <p className="text-gray-600 mb-8">
          Select an asset account so that your outstanding Stride balance is reflected in your {providerName} account.
        </p>
        
        <div className="space-y-6 max-w-md">
          {/* New account option */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className={`flex items-start p-4 cursor-pointer ${
                accountType === "new" ? 'border-l-4 border-l-green-500' : 'border-gray-200'
              }`}
              onClick={() => handleAccountTypeChange("new")}
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="radio"
                  checked={accountType === "new"}
                  onChange={() => handleAccountTypeChange("new")}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
              </div>
              <div className="ml-3">
                <label className="font-medium text-gray-900">Create a new asset account in {providerName}</label>
              </div>
            </div>
            
            {/* Form field for new account */}
            {accountType === "new" && (
              <div className="p-4 pt-0 border-t">
                <div className="mt-4">
                  <label htmlFor="account-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Account name (required)
                  </label>
                  <input
                    type="text"
                    id="account-name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Stride card"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Existing account option */}
          <div className="border rounded-lg overflow-hidden">
            <div 
              className={`flex items-start p-4 cursor-pointer ${
                accountType === "existing" ? 'border-l-4 border-l-green-500' : 'border-gray-200'
              }`}
              onClick={() => handleAccountTypeChange("existing")}
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="radio"
                  checked={accountType === "existing"}
                  onChange={() => handleAccountTypeChange("existing")}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
              </div>
              <div className="ml-3">
                <label className="font-medium text-gray-900">Use an existing asset account in {providerName}</label>
              </div>
            </div>
            
            {/* Form field for existing account */}
            {accountType === "existing" && (
              <div className="p-4 pt-0 border-t">
                <div className="mt-4">
                  <label htmlFor="existing-account" className="block text-sm font-medium text-gray-700 mb-1">
                    {providerName} prepaid card account *
                  </label>
                  <select
                    id="existing-account"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 appearance-none"
                  >
                    <option value="">Stride Card</option>
                    {existingAccounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* Continue button */}
          <button
            onClick={handleConnect}
            disabled={!isFormValid || isConnecting || connectionComplete}
            className={`mt-6 w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-white font-medium 
              ${isFormValid && !isConnecting && !connectionComplete
                ? 'bg-[#FF6B00] hover:bg-[#FF5500]' 
                : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            {isConnecting ? (
              <>
                <span className="inline-block w-4 h-4 mr-2 bg-white rounded-full animate-pulse"></span>
                Connecting...
              </>
            ) : connectionComplete ? (
              <>
                <CheckCircle size={18} className="mr-2" />
                Connected!
              </>
            ) : (
              <>
                Continue
                <ChevronRight size={18} className="ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Right side - Animation */}
      <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 overflow-hidden relative">
        {/* Close button in top-right */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Connection status text */}
          <motion.div
            className="mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isConnecting ? (
              <h2 className="text-xl font-semibold text-blue-600 mb-2">
                Connecting to {providerName}
              </h2>
            ) : connectionComplete ? (
              <h2 className="text-xl font-semibold text-green-600 mb-2">
                Successfully connected to {providerName}!
              </h2>
            ) : (
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Connecting your {providerName} account
              </h2>
            )}
            
            <p className={`text-sm ${isConnecting ? 'text-blue-500' : connectionComplete ? 'text-green-500' : 'text-gray-500'}`}>
              {isConnecting 
                ? "Establishing connection and verifying account details..."
                : connectionComplete 
                  ? `Redirecting to Stride Card page...`
                  : "Complete the account information to continue"
              }
            </p>
          </motion.div>
          
          {/* Animation container */}
          <div className="relative w-80 h-80">
            {/* Glow effect */}
            <motion.div
              className={`absolute inset-0 rounded-full ${
                isConnecting 
                  ? 'bg-blue-400' 
                  : connectionComplete 
                    ? 'bg-green-400' 
                    : 'bg-orange-400'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1], 
                scale: connectionComplete ? [1, 1.1, 1] : [0.8, 1.1, 0.8],
              }}
              transition={{ 
                duration: isConnecting ? 2 : 5, 
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            
            {/* Stride logo */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: isConnecting ? [0, 360] : 0
              }}
              transition={{ 
                duration: 1.5,
                delay: 0.5,
                ease: "easeOut",
                rotate: {
                  duration: 20,
                  ease: "linear",
                  repeat: isConnecting ? Infinity : 0
                }
              }}
            >
              <img 
                src="/Stride-Logo.svg" 
                alt="Stride Logo" 
                className="w-32 h-32"
              />
            </motion.div>
            
            {/* Provider logo */}
            <motion.div
              className="absolute"
              style={{
                width: 48,
                height: 48,
                top: "50%",
                left: "50%",
                margin: "-24px 0 0 -24px",
                zIndex: 10
              }}
              initial={{ 
                scale: 0,
                opacity: 0
              }}
              animate={{ 
                scale: 1,
                opacity: 1,
                x: [0, 100, 0, -100, 0],
                y: [0, 0, 100, 0, -100, 0]
              }}
              transition={{ 
                scale: { duration: 0.5 },
                opacity: { duration: 0.5 },
                x: { duration: 20, repeat: Infinity },
                y: { duration: 20, repeat: Infinity }
              }}
            >
              {/* This would need to be dynamically set based on the provider */}
              <img 
                src={`/assets/accounting/${providerId.toLowerCase()}-logo.svg`} 
                alt={`${providerName} Logo`} 
                className="w-full h-full"
                onError={(e) => {
                  // Fallback if specific logo isn't found
                  e.target.src = "/assets/accounting/generic-accounting-logo.svg";
                }}
              />
            </motion.div>
            
            {/* Connection lines - show when connecting */}
            {isConnecting && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`line-${i}`}
                    className="absolute top-1/2 left-1/2 bg-blue-400 w-1 h-1 rounded-full"
                    initial={{ 
                      scale: 0,
                      opacity: 0,
                      rotate: i * 60
                    }}
                    animate={{ 
                      scale: [0, 5, 0],
                      opacity: [0, 0.8, 0],
                      x: [0, 100 * Math.cos(i * 60 * Math.PI / 180)],
                      y: [0, 100 * Math.sin(i * 60 * Math.PI / 180)]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "linear"
                    }}
                  />
                ))}
              </>
            )}
            
            {/* Success checkmark - show when complete */}
            {connectionComplete && (
              <motion.div
                className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -mt-8 -ml-8 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <CheckCircle size={40} className="text-green-500" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingSetupAccount;