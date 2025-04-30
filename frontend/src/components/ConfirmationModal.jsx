import React from "react";

/**
 * ConfirmationModal component for showing confirmation dialogs
 * 
 * @param {boolean} show - Whether to show the modal
 * @param {function} onClose - Function to call when the modal is closed
 * @param {function} onConfirm - Function to call when the action is confirmed
 * @param {string} message - The message to display in the modal
 * @param {string} title - The title of the modal (optional)
 * @param {string} confirmText - Text for the confirm button (defaults to "Yes")
 * @param {string} cancelText - Text for the cancel button (defaults to "No")
 */
const ConfirmationModal = ({ 
  show,
  onClose,
  onConfirm,
  message,
  title = "Confirm Action",
  confirmText = "Yes",
  cancelText = "No"
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4">
        {title && <h3 className="text-lg font-medium mb-3">{title}</h3>}
        <p className="text-gray-700 mb-5">{message}</p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;