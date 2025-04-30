import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * A reusable confirmation modal for deletion operations with blur background and centered positioning
 * 
 * @param {Object} props Component props
 * @param {boolean} props.isOpen Whether the modal is visible
 * @param {Function} props.onClose Function to call when canceling
 * @param {Function} props.onConfirm Function to call when confirming deletion
 * @param {string} props.title Modal title
 * @param {string} props.message Confirmation message text
 * @param {React.ReactNode} props.children Optional content to display in the modal body
 */
const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Confirmation", 
  message = "Are you sure you want to delete this item?",
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Modal header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button 
                type="button" 
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Modal body */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600">{message}</p>
            {children}
          </div>
          
          {/* Modal footer with separation line */}
          <div className="px-6 py-3 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-white text-black border border-black rounded hover:bg-gray-100"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  children: PropTypes.node
};

export default DeleteConfirmationModal;