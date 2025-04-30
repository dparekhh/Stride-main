import React from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';

/**
 * EndPoint component - The ending point of the workflow
 * 
 * @param {Object} props - Component props
 * @param {string} props.endPointText - Main text for the end element
 * @param {string} props.endPointHighlight - Highlighted text in the end element
 * @param {boolean} props.showEndPoint - Whether to show the end point
 * @returns {JSX.Element|null} The EndPoint component or null if hidden
 */
const EndPoint = ({ endPointText, endPointHighlight, showEndPoint }) => {
  if (!showEndPoint) {
    return null;
  }
  
  return (
    <div className="workflow-end flex items-center">
      <div className="rounded-full w-7 h-7 bg-green-500 text-white flex items-center justify-center">
        <Check size={16} />
      </div>
      <div className="workflow-end-text ml-2 text-lg font-semibold">
        <span>{endPointText} </span>
        <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded">{endPointHighlight}</span>
      </div>
    </div>
  );
};

EndPoint.propTypes = {
  endPointText: PropTypes.string.isRequired,
  endPointHighlight: PropTypes.string.isRequired,
  showEndPoint: PropTypes.bool.isRequired
};

export default EndPoint;