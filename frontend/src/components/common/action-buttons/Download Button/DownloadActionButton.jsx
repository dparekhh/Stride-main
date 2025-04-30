import React from 'react';
import { Download } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * DownloadActionButton Component
 * 
 * A reusable button component that shows a download icon and handles download actions.
 * 
 * Features:
 * - Download icon button
 * - Support for disabled state
 * - Tooltips for better UX
 * - Customizable styling through className prop
 */
const DownloadActionButton = ({
  onDownload,
  tooltipText = "Download",
  disabled = false,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <button
        className={`p-2 rounded-md hover:bg-gray-100 border border-gray-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={tooltipText}
        onClick={() => {
          if (!disabled && onDownload) {
            onDownload();
          }
        }}
        disabled={disabled}
        aria-label="Download"
      >
        <Download size={20} />
      </button>
    </div>
  );
};

DownloadActionButton.propTypes = {
  /** Function to call when the download button is clicked */
  onDownload: PropTypes.func.isRequired,
  
  /** Text to display in the tooltip */
  tooltipText: PropTypes.string,
  
  /** Whether the button is disabled */
  disabled: PropTypes.bool,
  
  /** Additional CSS classes to apply to the component */
  className: PropTypes.string
};

export default DownloadActionButton;