import React, { useState, useId, useEffect } from 'react';
import { ArrowLeft, X, ChevronDown, Search, Plus, Trash2 } from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import { Z_INDEX_LEVELS } from '../contexts/DrawerContext';
import { toast } from 'react-toastify';

/**
 * StrideMerchantExpenseCodes Component
 * 
 * This component is a drawer that displays mapping between Stride merchant and Expense Codes
 * according to the design in image_1744023324749.png.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Flag to control if the drawer is open or closed
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked
 * @param {Function} props.onSave - Function to call when rules are saved
 */
const StrideMerchantExpenseCodes = ({ isOpen, onClose, onBack, onSave }) => {
  // Generate a unique ID for this drawer
  const generatedId = useId();
  const drawerId = `stride-merchant-expense-codes-drawer-${generatedId}`;
  
  // State for mapping rows with merchant and expense code selections
  const [mappingRows, setMappingRows] = useState([
    { id: 1, merchant: '', expenseCode: '', merchantDropdownOpen: false, expenseCodeDropdownOpen: false }
  ]);

  // State for merchant search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate if save button should be enabled - at least one row must be fully filled
  const canSave = mappingRows.some(row => row.merchant && row.expenseCode);
  
  // Merchant options with logo data to match the design in image_1744024145902.png
  const merchantOptions = [
    { id: 1, name: '1Password', logo: '1P', logoColor: 'bg-blue-500 text-white' },
    { id: 2, name: 'Airbnb', logo: 'Aa', logoColor: 'bg-pink-500 text-white' },
    { id: 3, name: 'Alloy', logo: 'A', logoColor: 'bg-black text-white' },
    { id: 4, name: 'Aloft', logo: 'Al', logoColor: 'bg-gray-100 text-gray-600' },
    { id: 5, name: 'Amazon', logo: 'A', logoColor: 'bg-yellow-500 text-white' },
    { id: 6, name: 'Amazon Web Services', logo: 'AWS', logoColor: 'bg-gray-200 text-gray-600' },
    { id: 7, name: 'Air India', logo: 'AI', logoColor: 'bg-blue-600 text-white' }
  ];
  
  // Filter merchants based on search query
  const getFilteredMerchants = () => {
    return searchQuery.trim() === '' 
      ? merchantOptions 
      : merchantOptions.filter(merchant => 
          merchant.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
  };
  
  // Dummy expense code options
  const expenseCodeOptions = [
    { id: 1, name: 'Office Supplies' },
    { id: 2, name: 'Travel' },
    { id: 3, name: 'Meals & Entertainment' },
    { id: 4, name: 'Software' },
    { id: 5, name: 'Hardware' },
    { id: 6, name: 'Professional Services' },
    { id: 7, name: 'Marketing' },
    { id: 8, name: 'Utilities' }
  ];

  // Check for completed rows and auto-add new row if needed
  useEffect(() => {
    const lastRowIndex = mappingRows.length - 1;
    const lastRow = mappingRows[lastRowIndex];
    
    // If the last row is complete, add a new empty row
    if (lastRow && lastRow.merchant && lastRow.expenseCode) {
      addMappingRow();
    }
  }, [mappingRows]);

  // Add a new empty mapping row
  const addMappingRow = () => {
    const newRowId = Math.max(...mappingRows.map(row => row.id), 0) + 1;
    setMappingRows([
      ...mappingRows, 
      { id: newRowId, merchant: '', expenseCode: '', merchantDropdownOpen: false, expenseCodeDropdownOpen: false }
    ]);
  };

  // Remove a mapping row
  const removeMappingRow = (rowId) => {
    if (mappingRows.length > 1) {
      setMappingRows(mappingRows.filter(row => row.id !== rowId));
    }
  };
  
  // Handle dropdown toggling for a specific row
  const toggleMerchantDropdown = (rowId) => {
    setMappingRows(mappingRows.map(row => {
      if (row.id === rowId) {
        return { ...row, merchantDropdownOpen: !row.merchantDropdownOpen };
      }
      // Close other dropdowns
      return { ...row, merchantDropdownOpen: false };
    }));
  };

  const toggleExpenseCodeDropdown = (rowId) => {
    setMappingRows(mappingRows.map(row => {
      if (row.id === rowId) {
        return { ...row, expenseCodeDropdownOpen: !row.expenseCodeDropdownOpen };
      }
      // Close other dropdowns
      return { ...row, expenseCodeDropdownOpen: false };
    }));
  };

  // Handle merchant selection for a specific row
  const handleMerchantSelect = (rowId, merchant) => {
    setMappingRows(mappingRows.map(row => {
      if (row.id === rowId) {
        return { ...row, merchant: merchant.name, merchantDropdownOpen: false };
      }
      return row;
    }));
  };

  // Handle expense code selection for a specific row
  const handleExpenseCodeSelect = (rowId, expenseCode) => {
    setMappingRows(mappingRows.map(row => {
      if (row.id === rowId) {
        return { ...row, expenseCode, expenseCodeDropdownOpen: false };
      }
      return row;
    }));
  };
  
  // Handle save action
  const handleSave = () => {
    // Count valid mappings (rows where both merchant and expense code are selected)
    const validMappings = mappingRows.filter(row => row.merchant && row.expenseCode);
    const mappingsCount = validMappings.length;
    
    // Show success notification
    toast.success("Rule updates applied", {
      position: "top-right",
      autoClose: 3000
    });
    
    // Call the onSave callback function if provided
    if (onSave) {
      onSave({
        type: 'merchant',
        mappingsCount,
        mappings: validMappings
      });
    }
    
    // Close the drawer
    onBack();
  };
  
  // Handle cancel action
  const handleCancel = () => {
    // Just close the drawer without saving
    onBack();
  };
  
  // Check if both merchant and expense code are selected in a row
  const isRowComplete = (row) => {
    return Boolean(row.merchant && row.expenseCode);
  };
  
  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}
      title="Stride merchant → Expense Codes"
      showBackButton={true}
      headerPrefix="Back"
      contentPadding="p-0" // Remove default padding to customize sections
      zIndex={Z_INDEX_LEVELS.LEVEL_2}
      width="md:w-1/2"
      id={drawerId}
    >
      <div className="p-6 pb-24"> {/* Add padding at bottom for the fixed footer */}
        {/* Table header */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="font-medium text-gray-500">Stride merchant</div>
          <div className="font-medium text-gray-500">Expense Codes</div>
        </div>
        
        {/* Mapping rows */}
        {mappingRows.map((row, index) => (
          <div key={row.id} className="grid grid-cols-2 gap-8 mt-2 relative pr-8">
            {/* Merchant selector */}
            <div className="relative">
              <div 
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none cursor-pointer"
                onClick={() => toggleMerchantDropdown(row.id)}
              >
                <span className={row.merchant ? 'text-gray-800' : 'text-gray-500'}>
                  {row.merchant || 'Search or select merchant...'}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
              
              {row.merchantDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {/* Search input with icon */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Search size={15} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 p-2 border-b border-gray-200 focus:outline-none text-sm"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Merchant options list with checkboxes and logos */}
                  <div className="py-1">
                    {getFilteredMerchants().map((merchant) => (
                      <div
                        key={merchant.id}
                        className={`flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                          row.merchant === merchant.name ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => handleMerchantSelect(row.id, merchant)}
                      >
                        <input
                          type="checkbox"
                          className="mr-3 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          checked={row.merchant === merchant.name}
                          readOnly
                        />
                        <div className={`${merchant.logoColor} rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium mr-3`}>
                          {merchant.logo}
                        </div>
                        <span className="text-gray-700">{merchant.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Expense Code selector */}
            <div className="relative">
              <div
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none cursor-pointer"
                onClick={() => toggleExpenseCodeDropdown(row.id)}
              >
                <span className={row.expenseCode ? 'text-gray-800' : 'text-gray-500'}>
                  {row.expenseCode || 'Choose one'}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
              
              {row.expenseCodeDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {expenseCodeOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                        row.expenseCode === option.name ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleExpenseCodeSelect(row.id, option.name)}
                    >
                      {option.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Delete button - only show if not the only row */}
            {mappingRows.length > 1 && (
              <button 
                className="absolute right-0 top-2 text-gray-400 hover:text-red-500"
                onClick={() => removeMappingRow(row.id)}
                aria-label="Remove mapping"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        
        {/* Add another mapping button */}
        <button
          className="mt-4 flex items-center text-[#FF6B00] hover:text-[#e06000]"
          onClick={addMappingRow}
        >
          <Plus size={16} className="mr-1" />
          <span>Add another mapping</span>
        </button>
        
        {/* Action buttons */}
        <div className="fixed bottom-0 left-0 w-full p-4 border-t border-gray-200 bg-white flex justify-between">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`px-4 py-2 rounded-md ${
              canSave
                ? 'bg-[#FF6B00] text-white hover:bg-[#e06000]'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save rule(s)
          </button>
        </div>
      </div>
    </AppDrawer>
  );
};

export default StrideMerchantExpenseCodes;