// src/pages/AccountingConnect.jsx
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, CheckCircle, X, Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { accountingSoftwareList } from "../data/accountingSoftwareList";
import { useAccounting } from "../contexts/AccountingContext";

const AccountingConnect = () => {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionComplete, setConnectionComplete] = useState(false);

  // Provider logos for the orbit animation
  const orbitLogos = [
    "/assets/accounting/tallyprime-logo.svg",
    "/assets/accounting/quickbooks-logo.svg",
    "/assets/accounting/netsuite-logo.svg",
    "/assets/accounting/xero-logo.svg",
  ];

  const { connectProvider, isConnected, connectedProvider } = useAccounting();
  
  // Redirect to accounting dashboard once connected
  useEffect(() => {
    if (connectionComplete && isConnected) {
      // Use a timeout to show the success state briefly before redirecting
      const redirectTimer = setTimeout(() => {
        navigate('/accounting');
      }, 2000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [connectionComplete, isConnected, navigate]);

  const handleClose = () => {
    navigate('/accounting');
  };

  const handleProviderSelect = (providerId, providerName) => {
    console.log(`Selected provider: ${providerId}`);
    setSelectedProvider(providerId);
    setIsConnecting(true);
    
    // Simulate OAuth authorization flow with a brief delay
    setTimeout(() => {
      // After successful OAuth flow, redirect to account setup page
      setIsConnecting(false);
      
      // Navigate to the account setup page with provider info
      navigate('/accounting/setup-account', {
        state: { 
          provider: providerId,
          providerName: accountingSoftwareList.find(p => p.id === providerId)?.name
        }
      });
    }, 1500);
  };

  return (
    <div className="min-h-full w-full flex flex-col md:flex-row">
      {/* Left side - Fixed header and scrollable provider list */}
      <div className="w-full md:w-1/2 flex flex-col h-full">
        {/* Fixed header section */}
        <div className="p-8 pb-4 border-b border-gray-100">
          <div className="mb-2">
            <h1 className="text-2xl font-bold">Connect your Accounting software/ERP</h1>
          </div>
          <p className="text-gray-600">
            Integrations connect Stride with a Third-Party Service. By clicking an option below, you agree to the Integration Terms
          </p>
        </div>
        
        {/* Scrollable provider list */}
        <div className="p-8 pt-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            {accountingSoftwareList.map((provider) => (
              <div
                key={provider.id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedProvider === provider.id && isConnecting
                    ? 'border-blue-300 bg-blue-50'
                    : connectionComplete && selectedProvider === provider.id
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => 
                  !isConnecting && !connectionComplete && 
                  handleProviderSelect(provider.id, provider.name)
                }
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 flex-shrink-0 mr-4">
                    <img
                      src={provider.logo}
                      alt={`${provider.name} logo`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span className="font-medium">{provider.name}</span>
                    
                    {selectedProvider === provider.id && (
                      <div className="mt-1 text-sm">
                        {isConnecting ? (
                          <span className="text-blue-500 flex items-center">
                            <span className="inline-block w-3 h-3 mr-2 bg-blue-500 rounded-full animate-pulse"></span>
                            Connecting...
                          </span>
                        ) : connectionComplete ? (
                          <span className="text-green-500 flex items-center">
                            <CheckCircle size={16} className="mr-1" />
                            Connected successfully
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
                
                {!(selectedProvider === provider.id && (isConnecting || connectionComplete)) && (
                  <ChevronRight className="text-gray-400" />
                )}
              </div>
            ))}
            
            {/* "Use another accounting provider?" section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium mb-1">Use another accounting provider?</h2>
              <p className="text-gray-600 text-sm mb-4">Stride works with any software that supports CSV uploads</p>
              
              <CustomProviderDropdown 
                onSelectProvider={handleProviderSelect} 
                isConnecting={isConnecting} 
                connectionComplete={connectionComplete}
                navigate={navigate}
              />
            </div>
          </div>
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
          {selectedProvider && (
            <motion.div
              className="mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isConnecting && (
                <h2 className="text-xl font-semibold text-blue-600 mb-2">
                  Connecting to {accountingSoftwareList.find(p => p.id === selectedProvider)?.name}
                </h2>
              )}
              
              {connectionComplete && (
                <h2 className="text-xl font-semibold text-green-600 mb-2">
                  Successfully connected to {accountingSoftwareList.find(p => p.id === selectedProvider)?.name}!
                </h2>
              )}
              
              <p className={`text-sm ${isConnecting ? 'text-blue-500' : 'text-green-500'}`}>
                {isConnecting 
                  ? "Verifying credentials and establishing connection..."
                  : connectionComplete 
                    ? "Redirecting to your accounting dashboard..."
                    : ""}
              </p>
            </motion.div>
          )}
          
          {/* Orbit animation container */}
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
            
            {/* Selected provider logo if connecting */}
            {selectedProvider && (isConnecting || connectionComplete) && (
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
                  x: connectionComplete ? [0, 0] : [0, 50, 0, -50, 0],
                  y: connectionComplete ? [0, 0] : [0, 50, 0, -50, 0]
                }}
                transition={{ 
                  scale: { duration: 0.5 },
                  opacity: { duration: 0.5 },
                  x: { duration: 5, repeat: isConnecting ? Infinity : 0 },
                  y: { duration: 5, repeat: isConnecting ? Infinity : 0 }
                }}
              >
                <img 
                  src={accountingSoftwareList.find(p => p.id === selectedProvider)?.logo} 
                  alt="Selected Provider Logo" 
                  className={`w-full h-full ${connectionComplete ? 'scale-150' : ''}`}
                />
              </motion.div>
            )}
            
            {/* Orbiting logos - only show when not connecting */}
            {!selectedProvider && orbitLogos.map((logo, index) => (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  width: 40,
                  height: 40,
                  top: "50%",
                  left: "50%",
                  margin: "-20px 0 0 -20px",
                }}
                initial={{ 
                  x: 0, 
                  y: -140,
                  opacity: 0
                }}
                animate={{ 
                  rotate: [0, 360],
                  opacity: 1
                }}
                transition={{ 
                  rotate: {
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                    delay: index * 1.5
                  },
                  opacity: {
                    duration: 1,
                    delay: 1 + index * 0.3
                  }
                }}
              >
                <img 
                  src={logo} 
                  alt="Software Logo" 
                  className="w-full h-full"
                />
              </motion.div>
            ))}
            
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

// Custom Provider Dropdown Component
const CustomProviderDropdown = ({ onSelectProvider, isConnecting, connectionComplete, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customProviders, setCustomProviders] = useState([
    { id: 'vyapar', name: 'Vyapar' },
    { id: 'marg', name: 'Marg Books' },
    { id: 'profitbooks', name: 'ProfitBooks' },
    { id: 'ramcoerp', name: 'Ramco ERP' }
  ]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isCustomProviderConnecting, setIsCustomProviderConnecting] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;
    
    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredProviders.length - 1 ? prev + 1 : 0
      );
    }
    
    // Arrow up
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : filteredProviders.length - 1
      );
    }
    
    // Enter key
    if (e.key === 'Enter' && highlightedIndex >= 0) {
      const provider = filteredProviders[highlightedIndex];
      handleCustomProviderSelect(provider);
    }
    
    // Escape key
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);
  
  // Filter providers based on search term
  const filteredProviders = searchTerm 
    ? customProviders.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : customProviders;
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (!isConnecting && !connectionComplete && !isCustomProviderConnecting) {
      setIsOpen(prev => !prev);
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  };
  
  // Handle provider selection with navigation
  const handleCustomProviderSelect = (provider) => {
    console.log(`Selected custom provider: ${provider.id} - ${provider.name}`);
    setIsOpen(false);
    setIsCustomProviderConnecting(true);
    
    // Directly navigate to the custom provider setup page
    setTimeout(() => {
      setIsCustomProviderConnecting(false);
      
      console.log(`Navigating to custom provider setup: ${provider.id} - ${provider.name}`);
      // Navigate directly to the custom provider setup page with provider info
      navigate('/accounting/custom-provider-setup', {
        state: { 
          provider: provider.id,
          providerName: provider.name
        }
      });
    }, 1500);
  };
  
  // Handle adding a custom provider if no match is found
  const handleAddCustomProvider = () => {
    if (!searchTerm.trim()) return;
    
    const customProviderId = searchTerm.toLowerCase().replace(/\s+/g, '-');
    const newProvider = { 
      id: `custom-${customProviderId}`, 
      name: searchTerm.trim() 
    };
    
    setCustomProviders(prev => [...prev, newProvider]);
    handleCustomProviderSelect(newProvider);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
          isOpen 
            ? 'border-blue-300 bg-blue-50' 
            : 'border-gray-200 hover:bg-gray-50'
        }`}
        onClick={toggleDropdown}
        disabled={isConnecting || connectionComplete}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onKeyDown={handleKeyDown}
      >
        <span className="text-gray-600">
          {searchTerm || "Search for your provider"}
        </span>
        <ChevronDown 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          size={18} 
        />
      </button>
      
      {/* Dropdown menu - opens upwards */}
      {isOpen && (
        <div 
          className="absolute bottom-full left-0 right-0 mb-1 border border-gray-200 rounded-lg bg-white shadow-lg overflow-hidden z-20"
          style={{ maxHeight: '350px' }}
        >
          {/* Search input */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search for accounting provider"
              />
            </div>
          </div>
          
          {/* Provider list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredProviders.length > 0 ? (
              <ul className="py-1" role="listbox">
                {filteredProviders.map((provider, index) => (
                  <li 
                    key={provider.id}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
                      highlightedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleCustomProviderSelect(provider)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    role="option"
                    aria-selected={highlightedIndex === index}
                  >
                    <span className="font-medium">{provider.name}</span>
                    <ChevronRight className="text-gray-400" size={16} />
                  </li>
                ))}
              </ul>
            ) : (
              // No matches found - option to add custom provider
              <div className="p-4">
                <p className="text-gray-500 text-sm mb-2">No matching providers found.</p>
                <button
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  onClick={handleAddCustomProvider}
                >
                  Use "{searchTerm}" as a custom provider
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingConnect;