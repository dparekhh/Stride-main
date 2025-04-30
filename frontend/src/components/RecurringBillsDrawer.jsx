import React, { useState } from 'react';
import { X, Plus, Calendar, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewRecurringBill from './NewRecurringBill';

const RecurringBillsDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showNewRecurringBill, setShowNewRecurringBill] = useState(false);
  
  const handleRecurringBillClick = (id) => {
    onClose(); // Close the drawer
    navigate(`/recurring-bill-series/${id}`); // Navigate to the recurring bill series page
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-30 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Drawer content */}
      <div 
        className="relative w-full md:w-1/2 bg-white shadow-xl transition-transform transform"
        style={{
          animation: 'slideInFromRight 0.3s ease-out forwards',
        }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close drawer"
        >
          <X size={20} />
        </button>
        
        <div className="h-full flex flex-col">
          {/* Drawer header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Recurring Bills</h2>
            <p className="text-gray-600 mt-1">Create and manage automatic bill creation and payments</p>
          </div>
          
          {/* Drawer content */}
          <div className="flex-grow overflow-y-auto px-6 py-6">
            {/* Active section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Active</h3>
              
              {/* Recurring bill card - styled to match the image provided */}
              <div 
                className="bg-white rounded-lg p-4 mb-4 hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
                onClick={() => handleRecurringBillClick('gti-properties')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center mr-3">
                      <span className="font-medium text-xs">GT</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">GTI Properties</h4>
                      <p className="text-gray-600 text-sm">₹22,000.00 monthly on the 1st</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex">
                      <button 
                        className="p-1 text-gray-400 hover:text-gray-700 rounded"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the card click handler from firing
                          handleRecurringBillClick('gti-properties');
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom action button */}
          <div className="border-t border-gray-200 p-6">
            <button
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-md flex items-center justify-center"
              onClick={() => setShowNewRecurringBill(true)}
            >
              <Plus size={16} className="mr-2" />
              New Recurring Bill
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
      
      {/* New Recurring Bill full-screen component */}
      {showNewRecurringBill && (
        <NewRecurringBill 
          isOpen={showNewRecurringBill} 
          onClose={() => setShowNewRecurringBill(false)} 
        />
      )}
    </div>
  );
};

export default RecurringBillsDrawer;