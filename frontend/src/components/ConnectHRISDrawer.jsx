import React, { useState, useMemo } from 'react';
import { X, ArrowLeft, Search, UserPlus, Unlink } from 'lucide-react';
import AppDrawer from './common/AppDrawer';

/**
 * ConnectHRISDrawer component for HRIS integration
 * Allows users to connect to various HRIS providers to sync employee data
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked
 * @param {Function} props.onInvitePeople - Function called when user clicks Invite People button
 * @returns {React.ReactElement} ConnectHRISDrawer component
 */
const ConnectHRISDrawer = ({ isOpen, onClose, onBack, onInvitePeople }) => {
  const [connectedHRIS, setConnectedHRIS] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmUnlink, setShowConfirmUnlink] = useState(false);
  
  // List of HRIS providers (sorted alphabetically)
  const hrisProviders = [
    { id: 1, name: 'ADP' },
    { id: 2, name: 'Darwinbox' },
    { id: 3, name: 'Freshteam' },
    { id: 4, name: 'GreyHR' },
    { id: 5, name: 'Keka HR' },
    { id: 6, name: 'Razorpay' },
    { id: 7, name: 'Zing HR' },
    { id: 8, name: 'Zoho People' }
  ];
  
  // Filter and sort providers: connected first, then alphabetically
  const filteredProviders = useMemo(() => {
    return hrisProviders
      .filter(provider => 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        // First sort by connection status
        if (a.id === connectedHRIS && b.id !== connectedHRIS) return -1;
        if (a.id !== connectedHRIS && b.id === connectedHRIS) return 1;
        // Then sort alphabetically
        return a.name.localeCompare(b.name);
      });
  }, [hrisProviders, searchQuery, connectedHRIS]);
  
  // Handle HRIS connection
  const handleConnect = (providerId) => {
    setConnectedHRIS(providerId === connectedHRIS ? null : providerId);
    // In a real application, this would initiate the OAuth flow or API connection
  };
  
  // Handle inviting people from connected HRIS - passes control to parent component
  const handleInvitePeople = (providerId) => {
    // Find the provider object from the ID
    const provider = hrisProviders.find(p => p.id === providerId);
    
    // Call the parent component's handler if it exists
    if (onInvitePeople) {
      onInvitePeople(provider);
    }
  };
  
  // Handle unlinking HRIS
  const handleUnlink = () => {
    setShowConfirmUnlink(true);
  };

  // Confirm unlinking HRIS
  const confirmUnlink = () => {
    setConnectedHRIS(null);
    setShowConfirmUnlink(false);
  };

  // Cancel unlinking HRIS
  const cancelUnlink = () => {
    setShowConfirmUnlink(false);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Footer with Done button
  const footerContent = (
    <div className="flex justify-end">
      <button 
        onClick={onClose}
        disabled={!connectedHRIS}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          connectedHRIS 
            ? "bg-primary text-white hover:bg-primary-dark" 
            : "bg-gray-200 text-gray-600 cursor-not-allowed"
        }`}
      >
        Done
      </button>
    </div>
  );
  
  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}
      showBackButton={true}
      headerPrefix="Back"
      title="Connect your HRIS"
      description="Sync your employee data effortlessly—auto-update team members, roles, and access permissions in real time."
      footer={footerContent}
      width="md:w-1/2"
    >
      <div className="space-y-6">
        {/* Confirmation Dialog for Unlinking */}
        {showConfirmUnlink && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="bg-white rounded-lg p-6 max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-medium mb-4">Confirm Unlink HRIS</h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to unlink this HRIS provider? This will stop all synchronization of employee data.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelUnlink}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUnlink}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Unlink
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Column Headers */}
        <div className="grid grid-cols-2 pb-2 border-b border-gray-200">
          <div className="font-medium text-gray-700">Name of HRIS</div>
          <div className="font-medium text-gray-700">Sync</div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search HRIS providers..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
        
        {/* HRIS Providers List */}
        <div className="space-y-4">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="grid grid-cols-2 items-center py-2">
              {/* Provider Name and Logo */}
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="font-medium text-xs text-gray-600">
                    {provider.name.substring(0, 2)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{provider.name}</span>
                  
                  {/* Connection Status Indicator */}
                  {connectedHRIS === provider.id && (
                    <div className="ml-2 relative flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 pulse-animation"></div>
                      <span className="text-xs text-green-600 ml-2">Connected</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons (Sync or Invite People + Unlink) */}
              <div className="flex space-x-2">
                {connectedHRIS === provider.id ? (
                  <>
                    <button
                      onClick={() => handleInvitePeople(provider.id)}
                      className="px-4 py-2 rounded border border-primary bg-primary text-white hover:bg-primary-dark transition-colors flex items-center"
                    >
                      <UserPlus size={16} className="mr-2" />
                      Invite people
                    </button>
                    <button
                      onClick={handleUnlink}
                      className="px-4 py-2 rounded border border-orange-100 bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors flex items-center"
                    >
                      <Unlink size={16} className="mr-2" />
                      Unlink HRIS
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(provider.id)}
                    className="px-4 py-2 rounded border border-gray-200 shadow-sm hover:shadow transition-all"
                  >
                    Sync
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {filteredProviders.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No HRIS providers found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
      
      {/* CSS for the pulsing animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
      `}</style>
    </AppDrawer>
  );
};

export default ConnectHRISDrawer;