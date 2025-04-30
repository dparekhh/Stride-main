// src/pages/CustomProviderSetup.jsx
import React, { useEffect, useState } from "react";
import { ChevronRight, X, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ImportChartOfAccountsDrawer from "../components/ImportChartOfAccountsDrawer";
import ImportVendorAccounting from "../components/ImportVendorAccounting";
import CreateNewFieldDrawer from "../components/CreateNewFieldDrawer";

const CustomProviderSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for chart of accounts drawer
  const [isImportChartDrawerOpen, setIsImportChartDrawerOpen] = useState(false);
  // State to track if chart of accounts was successfully imported
  const [chartOfAccountsImported, setChartOfAccountsImported] = useState(false);
  
  // State for vendor import drawer
  const [isImportVendorDrawerOpen, setIsImportVendorDrawerOpen] = useState(false);
  // State to track if vendors were successfully imported
  const [vendorsImported, setVendorsImported] = useState(false);
  
  // State for create new field drawer
  const [isCreateFieldDrawerOpen, setIsCreateFieldDrawerOpen] = useState(false);
  // State to track additional fields that have been added
  const [additionalFields, setAdditionalFields] = useState([]);
  
  // Get provider information from navigation state
  const providerName = location.state?.providerName;
  
  // Effect to redirect if provider information is missing
  useEffect(() => {
    if (!providerName) {
      console.log("Missing provider information, redirecting to connect page");
      navigate('/accounting/connect');
    }
  }, [providerName, navigate]);
  
  // Handle close button click
  const handleClose = () => {
    navigate('/accounting/connect');
  };
  
  // Handle disconnect button click
  const handleDisconnect = () => {
    navigate('/accounting/connect');
  };
  
  // Handle opening the import chart of accounts drawer
  const handleOpenImportChartDrawer = () => {
    setIsImportChartDrawerOpen(true);
  };
  
  // Handle successful import of chart of accounts
  const handleChartOfAccountsImported = () => {
    setChartOfAccountsImported(true);
    setIsImportChartDrawerOpen(false);
  };
  
  // Handle opening the import vendor drawer
  const handleOpenImportVendorDrawer = () => {
    setIsImportVendorDrawerOpen(true);
  };
  
  // Handle successful import of vendors
  const handleVendorsImported = () => {
    setVendorsImported(true);
    setIsImportVendorDrawerOpen(false);
  };
  
  // Handle opening the create new field drawer
  const handleOpenCreateFieldDrawer = () => {
    setIsCreateFieldDrawerOpen(true);
  };
  
  // Handle successful field creation
  const handleFieldCreated = (fieldData, saveAndAddAnother = false) => {
    console.log('Field created:', fieldData);
    
    // Add the new field to the list of additional fields
    setAdditionalFields(prevFields => [...prevFields, fieldData]);
    
    // If saveAndAddAnother is true, keep the drawer open for adding another field
    if (!saveAndAddAnother) {
      setIsCreateFieldDrawerOpen(false);
    }
  };
  
  // Handle removing an additional field
  const handleRemoveField = (index) => {
    setAdditionalFields(prevFields => prevFields.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="min-h-full w-full flex flex-col md:flex-row">
        {/* Left side - Content */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">{providerName} fields</h1>
          
          <p className="text-gray-600 mb-8">
            Set up in minutes and export your Stride transaction data for any accounting
            provider that supports CSV uploads, giving you complete control over which
            accounts from your general ledger to use.
          </p>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">1 required step</h2>
            
            <div 
              className="border rounded-lg p-4 flex items-center justify-between mb-4 hover:bg-gray-50 cursor-pointer"
              onClick={handleOpenImportChartDrawer}
            >
              <div>
                <p className="font-medium">Import Chart of Accounts</p>
              </div>
              {chartOfAccountsImported ? (
                <Check className="text-green-500" />
              ) : (
                <ChevronRight className="text-gray-400" />
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-2">Optional steps</h2>
            <p className="text-gray-500 text-sm mb-4">You can set these later in accounting settings.</p>
            
            <div 
              className="border rounded-lg p-4 flex items-center justify-between mb-4 hover:bg-gray-50 cursor-pointer"
              onClick={handleOpenImportVendorDrawer}
            >
              <div>
                <p className="font-medium">Import vendors</p>
              </div>
              {vendorsImported ? (
                <Check className="text-green-500" />
              ) : (
                <ChevronRight className="text-gray-400" />
              )}
            </div>
            
            <div 
              className="border rounded-lg p-4 flex items-center justify-between mb-4 hover:bg-gray-50 cursor-pointer"
              onClick={handleOpenCreateFieldDrawer}
            >
              <div>
                <p className="font-medium">Import additional fields</p>
              </div>
              {additionalFields.length > 0 ? (
                <Check className="text-green-500" />
              ) : (
                <ChevronRight className="text-gray-400" />
              )}
            </div>
            
            {/* Display added fields */}
            {additionalFields.length > 0 && (
              <div className="border rounded-lg overflow-hidden mt-2 mb-4">
                {additionalFields.map((field, index) => (
                  <div key={index} className="p-4 border-b last:border-b-0 flex justify-between items-center">
                    <span className="text-gray-700">Accounting {field.name}</span>
                    <button
                      onClick={() => handleRemoveField(index)}
                      className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {chartOfAccountsImported ? (
            <button
              onClick={() => navigate('/accounting/stride-card')}
              className="px-6 py-3 border border-orange-500 bg-orange-500 text-white rounded-md hover:bg-orange-600 mt-4 font-medium shadow-sm"
            >
              Start coding expenses
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 border border-red-200 rounded-md text-red-500 hover:bg-red-50 mt-4"
            >
              Disconnect to select another integration
            </button>
          )}
        </div>
        
        {/* Right side - Empty space with same background color */}
        <div className="w-full md:w-1/2 bg-white-50 relative">
          {/* Close button in top-right */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 z-10"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Import Chart of Accounts Drawer */}
      <ImportChartOfAccountsDrawer 
        isOpen={isImportChartDrawerOpen} 
        onClose={() => setIsImportChartDrawerOpen(false)}
        onImport={handleChartOfAccountsImported}
      />
      
      {/* Create New Field Drawer */}
      <CreateNewFieldDrawer
        isOpen={isCreateFieldDrawerOpen}
        onClose={() => setIsCreateFieldDrawerOpen(false)}
        onSave={handleFieldCreated}
      />
      
      {/* Import Vendor Drawer */}
      <ImportVendorAccounting
        isOpen={isImportVendorDrawerOpen}
        onClose={() => setIsImportVendorDrawerOpen(false)}
        onImport={handleVendorsImported}
      />
    </>
  );
};

export default CustomProviderSetup;