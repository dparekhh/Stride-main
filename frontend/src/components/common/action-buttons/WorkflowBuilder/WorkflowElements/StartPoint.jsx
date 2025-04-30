import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'lucide-react';

/**
 * StartPoint component - The trigger point of workflow
 * 
 * @param {Object} props - Component props
 * @param {string} props.triggerText - Main text for the trigger element
 * @param {string} props.triggerHighlight - Highlighted text in the trigger element
 * @returns {JSX.Element} The StartPoint component
 */
const StartPoint = ({ triggerText, triggerHighlight }) => {
  return (
    <div className="workflow-start flex items-center mb-2">
      <div className="rounded-full w-7 h-7 bg-gray-400 text-white flex items-center justify-center">
        <Loader size={14} className="text-white" />
      </div>
      <div className="workflow-start-text ml-2 text-lg font-semibold">
        <span>{triggerText} </span>
        <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded">{triggerHighlight}</span>
      </div>
    </div>
  );
};

StartPoint.propTypes = {
  triggerText: PropTypes.string.isRequired,
  triggerHighlight: PropTypes.string.isRequired
};

export default StartPoint;