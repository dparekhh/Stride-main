import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, X } from 'lucide-react';

/**
 * DeleteConfirmation component - Dialog for confirming deletion of conditions
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {string} props.mainConditionText - Text of the main condition
 * @param {Array} props.childConditionsText - Text of child conditions being deleted
 * @param {boolean} props.isMainCondition - Whether deleting a main condition
 * @param {Function} props.onClose - Callback for close action
 * @param {Function} props.onConfirm - Callback for confirm action
 * @returns {JSX.Element|null} The DeleteConfirmation component or null if closed
 */
const DeleteConfirmation = ({
  isOpen,
  mainConditionText,
  childConditionsText = [],
  isMainCondition = false,
  onClose,
  onConfirm
}) => {
  // Don't render if not open
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <AlertTriangle size={20} className="text-red-500 mr-2" />
            <h3 className="text-xl font-bold">Confirm Delete</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            {isMainCondition
              ? 'Are you sure you want to delete this condition and all its associated rules?'
              : 'Are you sure you want to delete this item?'}
          </p>
          
          {isMainCondition && (
            <>
              <p className="font-semibold">Parent condition:</p>
              <p className="ml-2 text-gray-700">{mainConditionText}</p>
              
              {childConditionsText.length > 0 && (
                <>
                  <p className="font-semibold mt-2">Condition to delete:</p>
                  {childConditionsText.map((text, index) => (
                    <p key={index} className="ml-2 text-gray-700">{text}</p>
                  ))}
                </>
              )}
            </>
          )}
          
          {!isMainCondition && (
            <>
              <p className="font-semibold">Item to delete:</p>
              <p className="ml-2 text-gray-700">{mainConditionText}</p>
            </>
          )}
          
          {isMainCondition && (
            <p className="mt-4 text-red-600 text-sm font-medium">
              This action cannot be undone.
            </p>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-black rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mainConditionText: PropTypes.string,
  childConditionsText: PropTypes.arrayOf(PropTypes.string),
  isMainCondition: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default DeleteConfirmation;