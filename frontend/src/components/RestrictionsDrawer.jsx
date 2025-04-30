import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, HelpCircle, ChevronDown } from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import SearchableDropdown from './common/SearchableDropdown';

/**
 * Restrictions Drawer Component
 * Displays a form for configuring spend restrictions on categories and merchants
 * Updated to match exact UI design specifications with tooltip implementation
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked
 * @param {Object} props.initialData - Initial data for the form
 * @param {Function} props.onSave - Function to call when form is saved with new data
 */
const RestrictionsDrawer = ({ 
  isOpen, 
  onClose, 
  onBack, 
  initialData = {}, 
  onSave 
}) => {
  // Form state
  const [categoryControlType, setCategoryControlType] = useState(initialData.categoryControlType || 'None');
  const [merchantControlType, setMerchantControlType] = useState(initialData.merchantControlType || 'None');
  const [selectedMerchants, setSelectedMerchants] = useState(initialData.selectedMerchants || []);
  const [selectedCategories, setSelectedCategories] = useState(initialData.selectedCategories || []);
  
  // State for tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  // Custom dropdown component with enhanced styling to match the design
  const CustomDropdown = ({ label, value, onChange, options, className }) => (
    <div className={`relative ${className || ''}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-3 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 transition-colors"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown size={18} className="text-gray-500" />
        </div>
      </div>
    </div>
  );

  // Function to handle form reset
  const handleCancel = () => {
    // Reset form to initial data
    setCategoryControlType(initialData.categoryControlType || 'None');
    setMerchantControlType(initialData.merchantControlType || 'None');
    setSelectedMerchants(initialData.selectedMerchants || []);
    setSelectedCategories(initialData.selectedCategories || []);
    onClose();
  };

  // Function to handle form submission
  const handleSave = () => {
    const updatedData = {
      categoryControlType,
      merchantControlType,
      selectedMerchants,
      selectedCategories
    };
    
    // Call the onSave callback with the updated data
    if (onSave) {
      onSave(updatedData);
    }
    
    onClose();
  };

  // Remove merchant from selected merchants
  const handleRemoveMerchant = (merchant) => {
    setSelectedMerchants(selectedMerchants.filter(m => m !== merchant));
  };
  
  // Remove category from selected categories
  const handleRemoveCategory = (category) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };
  
  // Handle category selection
  const handleCategorySelection = (category) => {
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Define category options for selection dropdown
  const categoryOptions = [
    { value: 'Travel', label: 'Travel' },
    { value: 'Food & Dining', label: 'Food & Dining' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Office Supplies', label: 'Office Supplies' },
    { value: 'Software & Services', label: 'Software & Services' },
  ];

  // Custom back button for header actions
  const headerActions = (
    <button 
      onClick={onBack || onClose}
      className="text-gray-500 hover:text-gray-700 flex items-center"
      aria-label="Back"
    >
      <ArrowLeft size={16} className="mr-1" />
      <span>Back</span>
    </button>
  );
  
  // Generate tooltip content based on current restrictions
  const getTooltipContent = () => {
    let content = [];
    
    // Check for category restrictions
    if (categoryControlType !== 'None' && selectedCategories.length > 0) {
      const categoryAction = categoryControlType === 'Allowed categories' ? 'allowed in' : 'blocked from';
      content.push(`Transactions are ${categoryAction} the following categories: ${selectedCategories.join(', ')}`);
    }
    
    // Check for merchant restrictions
    if (merchantControlType !== 'None' && selectedMerchants.length > 0) {
      const merchantAction = merchantControlType === 'Allowed merchants' ? 'allowed only with' : 'blocked from';
      content.push(`Transactions are ${merchantAction} the following merchants: ${selectedMerchants.join(', ')}`);
    }
    
    // Default message if no restrictions
    if (content.length === 0) {
      return "This card has no spending restrictions";
    }
    
    return content.join('\n');
  };
  
  // Tooltip component
  const Tooltip = ({ content, show }) => {
    if (!show) return null;
    
    return (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-100 rounded shadow-md text-xs text-gray-700 z-50">
        {content}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-100"></div>
      </div>
    );
  };
  
  // Footer content with Cancel and Save buttons
  const footerContent = (
    <div className="flex justify-between w-full">
      <button
        type="button"
        onClick={handleCancel}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
      >
        Cancel
      </button>
      <div className="flex items-center">
        <div 
          className="mr-4 text-gray-600 flex items-center relative"
          ref={tooltipRef}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <span className="mr-1 text-sm">What can this card spend on?</span>
          <HelpCircle size={16} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
          <Tooltip content={getTooltipContent()} show={showTooltip} />
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          Save changes
        </button>
      </div>
    </div>
  );

  // Define control type options for the dropdowns with clearer labels
  const categoryControlOptions = [
    { value: 'None', label: 'None' },
    { value: 'Allowed categories', label: 'Allowed categories' },
    { value: 'Blocked categories', label: 'Blocked categories' }
  ];

  const merchantControlOptions = [
    { value: 'None', label: 'None' },
    { value: 'Allowed merchants', label: 'Allowed merchants' },
    { value: 'Blocked merchants', label: 'Blocked merchants' }
  ];
  
  // Get help text for category control type
  const getCategoryControlHelperText = (type) => {
    switch (type) {
      case 'Allowed categories':
        return 'Allow transactions from merchants in these categories.';
      case 'Blocked categories':
        return 'Block transactions from merchants in these categories.';
      default:
        return '';
    }
  };
  
  // Get help text for merchant control type
  const getMerchantControlHelperText = (type) => {
    switch (type) {
      case 'Allowed merchants':
        return 'Allow transactions only from selected merchants.';
      case 'Blocked merchants':
        return 'Block transactions from selected merchants.';
      default:
        return '';
    }
  };
  
  // Get selection helper text
  const getCategorySelectionHelperText = (type) => {
    switch (type) {
      case 'Allowed categories':
        return 'Block all other categories.';
      case 'Blocked categories':
        return 'Allow all other categories.';
      default:
        return '';
    }
  };
  
  const getMerchantSelectionHelperText = (type) => {
    switch (type) {
      case 'Allowed merchants':
        return 'Block all other merchants. Disable category restrictions.';
      case 'Blocked merchants':
        return 'Allow all other merchants. Disable category restrictions.';
      default:
        return '';
    }
  };

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Restrictions"
      description="Restrict spending to specific categories and merchants."
      headerActions={headerActions}
      footer={footerContent}
      width="md:w-1/2"
    >
      <div className="space-y-8">
        {/* Category restrictions section */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">Category restrictions</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <CustomDropdown
                label="Control type"
                value={categoryControlType}
                onChange={setCategoryControlType}
                options={categoryControlOptions}
              />
              {/* Helper text for control type - always show for better UX */}
              <p className="text-xs text-gray-500 mt-1">
                {getCategoryControlHelperText(categoryControlType)}
              </p>
            </div>
            
            {/* Categories selection - only show when not "None" */}
            {categoryControlType !== 'None' && (
              <div className="space-y-1 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <SearchableDropdown
                  value=""
                  onChange={(value) => {
                    if (value) {
                      handleCategorySelection(value);
                    }
                  }}
                  options={categoryOptions}
                  placeholder="Select categories"
                  searchPlaceholder="Search categories..."
                  displayKey="label"
                  valueKey="value"
                  id="category-dropdown"
                />
                
                {/* Selected categories with improved styling */}
                <div className="mt-2">
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map((category) => (
                      <div key={category} className="inline-flex items-center bg-gray-100 rounded px-2 py-1 text-sm mr-2 mb-2">
                        {category}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveCategory(category)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                          aria-label={`Remove ${category}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No categories selected</p>
                  )}
                </div>
                
                {/* Helper text with consistent display */}
                <p className="text-xs text-gray-500 mt-1">
                  {getCategorySelectionHelperText(categoryControlType)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Merchant restrictions section */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-4">Merchant restrictions</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <CustomDropdown
                label="Control type"
                value={merchantControlType}
                onChange={setMerchantControlType}
                options={merchantControlOptions}
              />
              {/* Helper text for control type - always show */}
              <p className="text-xs text-gray-500 mt-1">
                {getMerchantControlHelperText(merchantControlType)}
              </p>
            </div>

            {/* Merchant selection - only show when not "None" */}
            {merchantControlType !== 'None' && (
              <div className="space-y-1 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merchants
                </label>
                <SearchableDropdown
                  value=""
                  onChange={(value) => {
                    if (value && !selectedMerchants.includes(value)) {
                      setSelectedMerchants([...selectedMerchants, value]);
                    }
                  }}
                  options={[
                    { value: 'Figma', label: 'Figma' },
                    { value: 'Adobe', label: 'Adobe' },
                    { value: 'Amazon', label: 'Amazon' },
                    { value: 'Microsoft', label: 'Microsoft' },
                    { value: 'Google', label: 'Google' }
                  ]}
                  placeholder="Select merchants"
                  searchPlaceholder="Search merchants..."
                  displayKey="label"
                  valueKey="value"
                  id="merchant-dropdown"
                />
                
                {/* Selected merchants with improved styling */}
                <div className="mt-2">
                  {selectedMerchants.length > 0 ? (
                    selectedMerchants.map((merchant) => (
                      <div key={merchant} className="inline-flex items-center bg-gray-100 rounded px-2 py-1 text-sm mr-2 mb-2">
                        {merchant}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMerchant(merchant)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                          aria-label={`Remove ${merchant}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No merchants selected</p>
                  )}
                </div>
                
                {/* Helper text with consistent display */}
                <p className="text-xs text-gray-500 mt-1">
                  {getMerchantSelectionHelperText(merchantControlType)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppDrawer>
  );
};

export default RestrictionsDrawer;