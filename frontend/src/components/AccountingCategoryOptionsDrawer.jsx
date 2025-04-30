import React, { useState, useEffect, useRef, useId } from 'react';
import { ArrowLeft, X, Search, Pencil, Upload, Eye, EyeOff } from 'lucide-react';
import { useDrawer, Z_INDEX_LEVELS } from '../contexts/DrawerContext';
import { useAccounting } from '../contexts/AccountingContext';
import AppDrawer from './common/AppDrawer';
import DrawerPortal from './common/DrawerPortal';

/**
 * Modal Component
 */
const AddOptionModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (name && id) {
      onAdd(name, id);
      setName('');
      setId('');
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/50" 
      style={{ zIndex: Z_INDEX_LEVELS.MODAL }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Add new option</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Create a new option and define what all cardholders see when coding transactions on Stride.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category name (required)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:border-black focus:ring-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Keep it short and descriptive"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:border-black focus:ring-0"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end p-4 bg-gray-50 border-t">
          <button
            className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 font-medium"
            onClick={handleAdd}
            disabled={!name || !id}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * AccountingCategoryOptionsDrawer Component
 * 
 * This component is a drawer that displays the options for an accounting category field.
 * It shows options that can be made visible or hidden, and allows renaming options.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Flag to control if the drawer is open or closed
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked
 * @param {string} [props.nameInStride] - The name of the field in Stride
 * @param {number} [props.zIndex] - The z-index level for the drawer
 */
const AccountingCategoryOptionsDrawer = ({ 
  isOpen, 
  onClose, 
  onBack, 
  nameInStride = "Category", 
  zIndex = Z_INDEX_LEVELS.LEVEL_3,
  initialTab = 'all'
}) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for add option modal
  const [showAddOptionModal, setShowAddOptionModal] = useState(false);
  
  // State for CSV upload
  const [csvFile, setCsvFile] = useState(null);
  
  // Get drawer context
  const { openDrawer, closeDrawer } = useDrawer();
  
  // Get accounting context data for Chart of Accounts
  const { 
    chartOfAccounts, 
    isLoadingAccounts,
    accountsError, 
    toggleAccountVisibility,
    showHiddenAccounts,
    toggleShowHiddenAccounts
  } = useAccounting();
  
  // Unique drawer ID
  const DRAWER_ID = `accounting-category-options-drawer-${useId()}`;
  
  // Register/unregister drawer when opened/closed
  useEffect(() => {
    if (isOpen) {
      openDrawer(DRAWER_ID, zIndex);
    }
    
    return () => {
      if (isOpen) {
        closeDrawer(DRAWER_ID);
      }
    };
  }, [isOpen, openDrawer, closeDrawer, DRAWER_ID, zIndex]);
  
  // Reset modal state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setShowAddOptionModal(false);
    }
  }, [isOpen]);
  
  // Filter options based on active tab and search term, then sort alphabetically by name
  const filteredOptions = chartOfAccounts
    .filter(account => {
      const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          account.code.includes(searchTerm);
      
      switch (activeTab) {
        case 'visible':
          return account.visible !== false && matchesSearch;
        case 'hidden':
          return account.visible === false && matchesSearch;
        case 'all':
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())); // Sort alphabetically by name
  
  // Function to handle "Make all visible" button
  const makeAllVisible = () => {
    // Make all currently filtered options visible
    filteredOptions.forEach(account => {
      if (account.visible === false) {
        toggleAccountVisibility(account.id);
      }
    });
  };
  
  // Function to handle "Make all hidden" button
  const makeAllHidden = () => {
    // Make all currently filtered options hidden
    filteredOptions.forEach(account => {
      if (account.visible !== false) {
        toggleAccountVisibility(account.id);
      }
    });
  };
  
  // Function to handle file upload for CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, we would use a CSV parser here
      // For this demo, we'll simulate adding new options
      const reader = new FileReader();
      reader.onload = (event) => {
        // Simulate parsing CSV and adding new options
        // This functionality would typically be implemented in AccountingContext
        alert("CSV import would integrate with the AccountingContext in a complete implementation");
      };
      reader.readAsText(file);
    }
  };
  
  // Function to handle adding a new option
  const handleAddOption = (name, id) => {
    // In a real implementation, this would add a new account via AccountingContext
    alert(`Adding a new account "${name}" (${id}) would integrate with the AccountingContext in a complete implementation`);
    setShowAddOptionModal(false);
  };

  // Create a hidden file input for CSV upload
  const fileInputRef = useRef(null);
  
  if (!isOpen) return null;
  
  return (
    <>
      <DrawerPortal>
        <AppDrawer
          isOpen={isOpen}
          onClose={onClose}
          onBack={onBack}
          id={DRAWER_ID}
          position="right"
          width="md:w-1/2"
          zIndex={zIndex}
          title={`${nameInStride} options`}
          description={`Update ${nameInStride} options using the table below or via CSV.`}
          usePortal={true}
          contentPadding="p-0"
          showBackButton={true}
          headerPrefix="Back"
        >
          <div className="flex flex-col h-full">
            {/* Tabs */}
            <div>
              <div className="flex space-x-6 px-6">
                <button
                  className={`py-4 font-medium text-sm ${
                    activeTab === 'all' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('all')}
                >
                  All
                </button>
                <button
                  className={`py-4 font-medium text-sm ${
                    activeTab === 'visible' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('visible')}
                >
                  Visible
                </button>
                <button
                  className={`py-4 font-medium text-sm ${
                    activeTab === 'hidden' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('hidden')}
                >
                  Hidden
                </button>
              </div>
            </div>
            
            {/* Search and action buttons */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="relative w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:border-black focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                {(activeTab === 'all' || activeTab === 'hidden') && (
                  <button
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium flex items-center space-x-1"
                    onClick={makeAllVisible}
                  >
                    <Eye size={16} className="mr-2" />
                    <span>Make all visible</span>
                  </button>
                )}
                {(activeTab === 'all' || activeTab === 'visible') && (
                  <button
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium flex items-center space-x-1"
                    onClick={makeAllHidden}
                  >
                    <EyeOff size={16} className="mr-2" />
                    <span>Make all hidden</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Options list */}
            <div className="flex-1 overflow-y-auto">
              {isLoadingAccounts ? (
                <div className="p-6 text-center text-gray-500">
                  Loading accounts...
                </div>
              ) : accountsError ? (
                <div className="p-6 text-center text-red-500">
                  Error loading accounts: {accountsError}
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No matching accounts found
                </div>
              ) : (
                filteredOptions.map((account) => (
                  <div 
                    key={account.id}
                    className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium flex items-center">
                        {account.name}
                        {account.visible === false && (
                          <EyeOff size={14} className="text-gray-400 ml-2" />
                        )}
                      </div>
                      <div className="text-gray-500 text-sm">{account.code}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Pencil size={16} />
                      </button>
                      <label className="flex items-center">
                        <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full">
                          <input
                            type="checkbox"
                            className="absolute w-5 h-5 opacity-0 z-10 cursor-pointer"
                            checked={account.visible !== false}
                            onChange={() => toggleAccountVisibility(account.id)}
                          />
                          <span
                            className={`absolute left-0 w-10 h-5 transition-all duration-200 ease-in-out rounded-full ${
                              account.visible !== false ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          ></span>
                          <span
                            className={`absolute left-0 w-5 h-5 border border-gray-200 transition-all duration-200 ease-in-out transform bg-white rounded-full ${
                              account.visible !== false ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          ></span>
                        </div>
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer buttons */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium flex items-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} className="mr-2" />
                Upload via CSV
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 font-medium"
                onClick={() => setShowAddOptionModal(true)}
              >
                Add new option
              </button>
            </div>
          </div>
        </AppDrawer>
      </DrawerPortal>
      
      {/* Add New Option Modal - Placed outside to ensure it's on top */}
      <AddOptionModal 
        isOpen={showAddOptionModal} 
        onClose={() => setShowAddOptionModal(false)} 
        onAdd={handleAddOption} 
      />
    </>
  );
};

export default AccountingCategoryOptionsDrawer;