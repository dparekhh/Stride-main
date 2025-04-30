import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatIndianCurrency } from '../../utils/helpers';

/**
 * CurrencyInput component
 * 
 * A specialized input component for amount/currency values with a currency symbol
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Change handler function 
 * @param {string} props.currency - Currency symbol to display
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 */
const CurrencyInput = ({
  value,
  onChange,
  currency = '₹',
  placeholder = 'Enter amount',
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);
    
    // Format the value with two decimal places when losing focus
    if (value) {
      try {
        // Parse the value to a number and format with 2 decimal places
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          const formattedValue = numValue.toFixed(2);
          onChange(formattedValue);
        }
      } catch (e) {
        console.error("Error formatting value:", e);
      }
    }
  };
  
  // Handle input change
  const handleChange = (e) => {
    // Allow only numeric input and decimal point
    const value = e.target.value;
    // Remove any non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = sanitizedValue.split('.');
    const formattedValue = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : sanitizedValue;
      
    onChange(formattedValue);
  };
  
  // Use the imported formatIndianCurrency function from helpers.jsx
  // This function properly formats Indian currency with the ₹ symbol
  
  return (
    <div className={`amount-input-wrapper ${className}`}>
      <div className="relative">
        {/* Currency symbol on the left */}
        <span className="currency-symbol absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 pointer-events-none">
          {currency}
        </span>
        
        <input
          type="text"
          value={isFocused ? value : (value ? formatIndianCurrency(parseFloat(value)) : '')}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="amount-input w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

CurrencyInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  currency: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default CurrencyInput;