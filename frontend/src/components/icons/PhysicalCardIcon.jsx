import React from 'react';

/**
 * PhysicalCardIcon Component
 * An SVG icon representing a physical credit card
 */
const PhysicalCardIcon = ({ width = 24, height = 24, className = '' }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="7" y1="15" x2="12" y2="15" />
      <line x1="7" y1="18" x2="9" y2="18" />
      <rect x="17" y="15" width="2" height="2" rx="1" />
    </svg>
  );
};

export default PhysicalCardIcon;