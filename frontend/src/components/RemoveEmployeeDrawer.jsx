import React, { useState } from 'react';
import { X } from 'lucide-react';

const RemoveEmployeeDrawer = ({ isOpen, onClose, onBack, employee, onRemove }) => {
  const [confirmText, setConfirmText] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  
  if (!isOpen) return null;
  
  const { name, email } = employee;
  
  const handleRemove = () => {
    if (confirmText === "REMOVE") {
      onRemove();
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-white shadow-xl transform transition-transform duration-300 translate-x-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <button 
            onClick={onBack} 
            className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
          >
            ← Back
          </button>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto h-full pb-24">
          <h2 className="text-2xl font-medium mb-1">Remove {name}</h2>
          <p className="text-gray-500 mb-6">{email}</p>
          
          {/* Warning about pending reimbursements */}
          <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">
                  {name} has 7 pending reimbursements
                </h3>
                <div className="mt-2 text-sm text-orange-700">
                  <p>
                    If {name} is removed from Stride, these reimbursements and any attached receipts will be deleted.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Reimbursements
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 1 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Step 1: Terminate or transfer {employee.cards || 1} card</h3>
            
            <div 
              className={`border rounded-md p-4 mb-2 cursor-pointer ${
                selectedOption === 'terminate' ? 'border-gray-400' : 'border-gray-200'
              }`}
              onClick={() => setSelectedOption('terminate')}
            >
              <div className="flex justify-between items-center">
                <span>Terminate all cards</span>
                <div className="h-5 w-5 border border-gray-300 rounded-full flex items-center justify-center">
                  {selectedOption === 'terminate' && (
                    <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-md p-4 mb-2 cursor-pointer ${
                selectedOption === 'transfer' ? 'border-gray-400' : 'border-gray-200'
              }`}
              onClick={() => setSelectedOption('transfer')}
            >
              <div className="flex justify-between items-center">
                <span>Transfer all cards to someone else</span>
                <div className="h-5 w-5 border border-gray-300 rounded-full flex items-center justify-center">
                  {selectedOption === 'transfer' && (
                    <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Step 2: Reassign vendor ownership</h3>
            <p className="text-gray-600 mb-4">
              Vendor ownership will automatically be assigned to the user's manager. If none is
              available, it will be assigned to the business owner.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Step 3: Confirm by typing "REMOVE"</h3>
            <p className="text-gray-600 mb-4">
              Removing {name} will suspend all their activity on Stride.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type "REMOVE" to remove {name} from Stride (required)
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex justify-between mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              onClick={handleRemove}
              disabled={confirmText !== "REMOVE" || !selectedOption}
              className={`px-4 py-2 rounded-md text-white ${
                confirmText === "REMOVE" && selectedOption
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Remove {name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveEmployeeDrawer;