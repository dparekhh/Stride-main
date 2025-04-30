import React from 'react';
import { ArrowLeft, Mail, MapPin } from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import PhysicalCardIcon from './icons/PhysicalCardIcon';

/**
 * ConfirmAddressDrawer Component
 * Displays a form for confirming a mailing address for a physical card
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when going back
 * @param {string} props.cardholderName - The name of the cardholder
 * @param {Object} props.address - The address information to confirm
 */
const ConfirmAddressDrawer = ({ isOpen, onClose, onBack, cardholderName, address }) => {
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  // Custom back button for header actions
  const headerActions = (
    <button 
      onClick={onBack}
      className="text-gray-500 hover:text-gray-700 flex items-center"
      aria-label="Back"
    >
      <ArrowLeft size={16} className="mr-1" />
      <span>Back</span>
    </button>
  );
  
  // Submit button for footer
  const footerContent = (
    <div className="flex justify-between w-full">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="confirm-address-form"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Issue Physical Card
      </button>
    </div>
  );

  // Formatted address string
  const formattedAddress = address ? 
    `${address.street}${address.unit ? `, ${address.unit}` : ''}, ${address.city}, ${address.state} ${address.zipCode}` : 
    '';

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm mailing address"
      description="Please verify the mailing address for the physical card."
      headerActions={headerActions}
      footer={footerContent}
      width="md:w-1/2"
    >
      <div className="space-y-6">
        <form id="confirm-address-form" onSubmit={handleSubmit}>
          {/* Additional information - moved to top */}
          <div className="mb-6">
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-orange-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-orange-800">Important Information</h3>
                  <div className="mt-2 text-sm text-orange-700">
                    <p>
                      Once you confirm the address, a physical card will be issued and sent to the provided address. 
                      {cardholderName && ` ${cardholderName} will`} receive a notification when the card is shipped and can track its delivery status.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card details summary */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Card Details</h3>
            
            <div className="flex items-start mb-3">
              <div className="flex-shrink-0 mr-3">
                <PhysicalCardIcon width={24} height={24} className="text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Physical Card</p>
                <p className="text-sm text-gray-600">Will be shipped within 5-7 business days</p>
              </div>
            </div>
            
            <div className="flex items-start mb-3">
              <div className="flex-shrink-0 mr-3">
                <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs">
                  {cardholderName ? cardholderName.substring(0, 2).toUpperCase() : 'U'}
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-800">{cardholderName || 'Unknown User'}</p>
                <p className="text-sm text-gray-600">Cardholder</p>
              </div>
            </div>
          </div>

          {/* Mailing address confirmation section */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-800 mb-3">Mailing Address</h3>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <MapPin size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Delivery Address</p>
                  <p className="text-sm text-gray-600">{formattedAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppDrawer>
  );
};

export default ConfirmAddressDrawer;