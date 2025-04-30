import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Search, EyeOff, Eye, Plus } from 'lucide-react';

/**
 * SearchableDropdown Component
 * 
 * A reusable dropdown component with search functionality.
 * 
 * @param {Object} props - Component props
 * @param {any} props.value - Currently selected value
 * @param {Function} props.onChange - Function called when selection changes
 * @param {Array} props.options - Array of items to display
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {string} props.searchPlaceholder - Placeholder for search input
 * @param {boolean} props.disabled - Whether the dropdown is disabled
 * @param {Function} props.formatOption - Optional function to format how options are displayed
 * @param {Function} props.keyExtractor - Optional function to get unique key for each option
 * @param {string} props.displayKey - The key to use for displaying option text (default: 'name')
 * @param {string} props.valueKey - The key to use for option values (default: 'id')
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - HTML id attribute
 * @param {boolean} props.showHiddenOptions - Whether to show hidden options
 * @param {Function} props.onToggleShowHidden - Function called when toggling hidden options visibility
 * @param {Function} props.onToggleVisibility - Function called when toggling option visibility
 * @param {boolean} props.supportsVisibility - Whether the dropdown supports visibility toggling
 * @param {boolean} props.showHiddenToggle - Whether to show the hidden toggle button
 * @param {Function} props.onAddRule - Function called when adding a rule for an option
 * @param {boolean} props.showAddRule - Whether to show add rule buttons
 * @param {Object} props.chevronStyle - Custom styling for the chevron icon
 * @param {string} props.chevronStyle.type - Type of chevron animation ('rotating', 'simple')
 * @param {number} props.chevronStyle.rotation - Rotation angle for the chevron
 * @param {string} props.chevronStyle.transition - CSS transition value for rotation animation
 * @param {boolean} props.showFooter - Whether to show the footer (clear selection button)
 * @param {Function} props.onFocus - Function called when dropdown gets focus
 * @param {Function} props.onBlur - Function called when dropdown loses focus
 * @param {boolean} props.renderOutsideParent - Whether to render the dropdown outside its parent container using a portal
 * @param {number} props.dropdownWidth - Width for the dropdown menu when rendered outside parent (default: 300)
 * @param {Function} props.renderFooter - Custom render function for the dropdown footer
 * @param {Function} props.renderOptionExtra - Custom render function to add extra elements to each option
 */
const SearchableDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  disabled = false,
  formatOption,
  keyExtractor,
  displayKey = 'name',
  valueKey = 'id',
  className = '',
  id,
  showHiddenOptions = false,
  onToggleShowHidden = () => {},
  onToggleVisibility = () => {},
  supportsVisibility = false,
  showHiddenToggle = false,
  onAddRule = () => {},
  showAddRule = false,
  chevronStyle = { type: 'simple' },
  showFooter = true,
  onFocus = () => {},
  onBlur = () => {},
  renderFooter = null,
  renderOptionExtra = null
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  
  // Find the selected option object based on value
  const selectedOption = options.find(option => {
    if (typeof option === 'string') {
      return option === value;
    }
    return value !== undefined && option[valueKey] === value;
  });
  
  // Get filtered options based on search term and visibility settings
  const getFilteredOptions = () => {
    return options.filter(option => {
      // Filter by visibility if the component supports it
      if (supportsVisibility && option.hasOwnProperty('visible')) {
        if (showHiddenOptions && option.visible !== false) {
          // When showing hidden options, only show hidden ones
          return false;
        }
        if (!showHiddenOptions && option.visible === false) {
          // When not showing hidden options, exclude hidden ones
          return false;
        }
      }
      
      // Check if search term matches
      if (searchTerm) {
        // If the option is a simple string
        if (typeof option === 'string') {
          return option.toLowerCase().includes(searchTerm.toLowerCase());
        }
        
        // If displayKey exists on the option
        if (option[displayKey]) {
          return option[displayKey].toString().toLowerCase().includes(searchTerm.toLowerCase());
        }
        
        return false;
      }
      
      // Include if no search term
      return true;
    });
  };
  
  // Get filtered options
  const filteredOptions = getFilteredOptions();
  
  // Handle option selection
  const handleSelect = (option) => {
    // Handle string options
    if (typeof option === 'string') {
      onChange(option);
    } else {
      onChange(option[valueKey]);
    }
    setIsDropdownOpen(false);
    setSearchTerm('');
  };
  
  // Handle click outside to close dropdown with delay to prevent immediate closure
  useEffect(() => {
    let clickTimeout;
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Add a delay to prevent immediate closing when clicked
        clickTimeout = setTimeout(() => {
          setIsDropdownOpen(false);
          setSearchTerm('');
        }, 150); // Small delay to prevent immediate closure
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (clickTimeout) clearTimeout(clickTimeout);
    };
  }, []);
  
  // Handle clear selection
  const handleClearSelection = () => {
    onChange(null);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };
  
  // Render the selected value or placeholder
  const renderValue = () => {
    if (selectedOption) {
      if (formatOption) {
        return formatOption(selectedOption);
      }
      
      return (
        <span className="text-gray-800">
          {typeof selectedOption === 'string' 
            ? selectedOption 
            : selectedOption[displayKey] || 'Unknown'
          }
        </span>
      );
    }
    
    return <span className="text-gray-500">{placeholder}</span>;
  };
  
  // Get a unique key for each option
  const getKey = (option, index) => {
    if (keyExtractor) {
      return keyExtractor(option);
    }
    
    if (typeof option === 'string') {
      return option;
    }
    
    return option[valueKey] || index;
  };
  
  // Render an option
  const renderOption = (option) => {
    // Use custom formatter if provided
    if (formatOption) {
      return formatOption(option);
    }
    
    if (typeof option === 'string') {
      return <div className="font-medium">{option}</div>;
    }
    
    // Add visibility indicator and add rule button if applicable
    if (supportsVisibility && option.hasOwnProperty('visible')) {
      return (
        <div className="relative group flex justify-between items-center w-full">
          <div className="font-medium">
            {option[displayKey] || 'Unknown'}
            {/* Display an icon to indicate if it's hidden, but don't make it toggleable */}
            {option.visible === false && <EyeOff size={14} className="text-gray-400 ml-2 inline-block" />}
          </div>
          
          {/* Create/Edit Rule button - only shows on hover */}
          {showAddRule && (
            <div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddRule(option[valueKey]);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-primary text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                aria-label={option.hasRule ? "Edit rule" : "Create rule"}
              >
                {option.hasRule ? "Edit rule" : "Create rule"}
              </button>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="font-medium">
        {option[displayKey] || 'Unknown'}
      </div>
    );
  };
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        className={`w-full px-3 py-2 text-left border ${disabled 
          ? 'bg-gray-100 cursor-not-allowed border-gray-300' 
          : 'border-gray-300 hover:border-gray-400'} rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black flex items-center justify-between`}
        onClick={() => {
          if (!disabled) {
            const newState = !isDropdownOpen;
            setIsDropdownOpen(newState);
            if (newState) {
              onFocus();
            } else {
              onBlur();
            }
          }
        }}
        onFocus={() => onFocus()}
        onBlur={() => onBlur()}
      >
        {renderValue()}
        <div className="text-gray-400">
          {chevronStyle.type === 'rotating' ? (
            <ChevronDown 
              size={18} 
              className="transition-transform" 
              style={{ 
                transform: `rotate(${chevronStyle.rotation || (isDropdownOpen ? 180 : 0)}deg)`,
                transition: chevronStyle.transition || 'transform 0.2s ease'
              }}
            />
          ) : (
            isDropdownOpen ? (
              <ChevronUp size={18} className="transition-transform" />
            ) : (
              <ChevronDown size={18} className="transition-transform" />
            )
          )}
        </div>
      </button>
      
      {isDropdownOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-[300px] min-w-full bg-white shadow-lg rounded-md border border-gray-200 flex flex-col">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-3 py-2 border-0 bg-gray-50 rounded-md text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={getKey(option, index)}
                  className="py-2 px-3 bg-gray-50 hover:bg-gray-100 cursor-pointer text-wrap break-words"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      {renderOption(option)}
                    </div>
                    {renderOptionExtra && renderOptionExtra(option)}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-center">
                {showHiddenOptions ? 
                  "No hidden options found" : 
                  "No options found"}
              </div>
            )}
          </div>
          
          {renderFooter ? (
            renderFooter()
          ) : showFooter && (
            <div className="p-2 border-t border-gray-100 sticky bottom-0 bg-white flex justify-between items-center">
              <button
                type="button"
                className="flex items-center text-gray-600 hover:text-gray-800"
                onClick={handleClearSelection}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear selection
              </button>
              
              {showHiddenToggle && (
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center text-gray-600 hover:text-gray-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleShowHidden();
                    }}
                    aria-label={showHiddenOptions ? 'Show visible options' : 'Show hidden options'}
                  >
                    {showHiddenOptions ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <div 
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-white border border-gray-200 rounded-md shadow-sm text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '8px',
                      padding: '6px 8px',
                      background: 'white',
                      border: '1px solid rgb(229 231 235)',
                      borderRadius: '6px',
                      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    {showHiddenOptions ? 'Show visible options' : 'Show hidden options'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;