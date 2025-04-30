// src/components/LoadingSpinner.jsx
import React from 'react';

/**
 * Loading spinner component that uses the primary brand color
 * @param {Object} props Component props
 * @param {string} props.size Size of the spinner (small, medium, large)
 * @param {string} props.className Additional CSS classes
 */
const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  // Determine size class based on the size prop
  const sizeClass = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  }[size] || 'w-8 h-8 border-3';

  return (
    <div className={`${className} flex justify-center items-center`}>
      <div 
        className={`${sizeClass} rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;