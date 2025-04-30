import React, { useState, useEffect } from 'react';
import { CreditCard, ChevronRight, Search, ShoppingCart, X } from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import { useNotification } from '../contexts/NotificationContext';
import PhysicalCardIcon from './icons/PhysicalCardIcon';

// Helper function to update class names in component
const updateFocusClasses = () => {
  // Find all inputs within the component
  const elements = document.querySelectorAll('#issue-card-form input, #issue-card-form select');
  
  // Update each element's focus classes
  elements.forEach(el => {
    el.classList.remove('focus:ring-primary', 'focus:border-primary');
    el.classList.add('focus:ring-black', 'focus:border-black');
  });
};

/**
 * Issue Card Drawer Component
 * Displays options for creating new cards and spend programs
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onSelectPhysicalCard - Function to call when physical card option is selected
 * @param {Function} props.onSelectVirtualCard - Function to call when virtual card option is selected
 */
const IssueCardDrawer = ({ isOpen, onClose, onSelectPhysicalCard, onSelectVirtualCard }) => {
  const { showInfo } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Update focus styles when the component is mounted
  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        updateFocusClasses();
      }, 100);
    }
  }, [isOpen]);
  
  return (
    <AppDrawer 
      isOpen={isOpen}
      onClose={onClose}
      title="What do you need?"
      description="Choose a card type or spend program"
      width="md:w-1/2"
    >
      <div className="space-y-6" id="issue-card-form">
        {/* New request section */}
        <div>
          <h3 className="text-base font-medium text-gray-700 mb-3">New request</h3>
          <div className="space-y-2">
            {/* Virtual card option */}
            <div 
              className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-black hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                onClose();
                onSelectVirtualCard();
              }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <CreditCard size={20} className="text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Virtual card</h4>
                  <p className="text-sm text-gray-500">Create a virtual card to spend with fine-tuned controls.</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            
            {/* Product or service option */}
            <div 
              className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-black hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                // Handle product/service click
                showInfo("Product/service clicked");
              }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <ShoppingCart size={20} className="text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Product or service</h4>
                  <p className="text-sm text-gray-500">Secure virtual cards for a single vendor (e.g. Heroku, Facebook Ads)</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            
            {/* Physical card option */}
            <div 
              className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-black hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                onClose();
                onSelectPhysicalCard();
              }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <PhysicalCardIcon size={20} className="text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Physical card</h4>
                  <p className="text-sm text-gray-500">Each employee can have one physical card to use across all their virtual cards.</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Spend programs section */}
        <div>
          <h3 className="text-base font-medium text-gray-700 mb-3">Spend programs</h3>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search spend programs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {/* Example spend program */}
            <div 
              className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-black hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                showInfo("Expense program clicked");
              }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Monthly Expense Account</h4>
                  <p className="text-sm text-gray-500">For regular department expenses</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            
            {/* Example spend program */}
            <div 
              className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-black hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                showInfo("Travel program clicked");
              }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <CreditCard size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Travel & Entertainment</h4>
                  <p className="text-sm text-gray-500">For business travel and client entertainment</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </AppDrawer>
  );
};

export default IssueCardDrawer;