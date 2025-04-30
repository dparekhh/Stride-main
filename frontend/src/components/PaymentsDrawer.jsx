import React from 'react';
import { Plus, Info, ArrowRight, Building } from 'lucide-react';
import AppDrawer from './common/AppDrawer';

/**
 * Payments drawer component for making card payments
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Array} props.paymentHistory - Array of payment history items
 * @param {number} props.currentBalance - Current balance
 * @param {number} props.pendingBalance - Pending balance
 * @param {number} props.availableCashback - Available cashback
 * @param {number} props.pendingCashback - Pending cashback
 * @returns {React.ReactElement} Payments drawer component
 */
const PaymentsDrawer = ({ 
  isOpen, 
  onClose, 
  paymentHistory = [],
  currentBalance = 0,
  pendingBalance = 0,
  availableCashback = 0,
  pendingCashback = 0
}) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Payments"
      description="Manage your card payments and view payment history"
    >
      {/* Current Balance Section */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <p className="text-gray-500 mr-2">Utilized limit</p>
          <Info size={16} className="text-gray-400" />
        </div>
        <p className="text-2xl font-semibold mb-1">{formatCurrency(currentBalance)}</p>
        <p className="text-sm text-gray-500 mb-4">Pending: {formatCurrency(pendingBalance)}</p>
        
        {/* Add Funds Button */}
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium flex items-center justify-center">
          Add funds
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
      
      {/* Cashback Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-gray-500 mb-2">Available cashback</p>
          <p className="text-xl font-semibold">{formatCurrency(availableCashback)}</p>
          <button className="mt-3 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium">
            Redeem cashback
          </button>
        </div>
        <div>
          <p className="text-gray-500 mb-2">Pending cashback</p>
          <p className="text-xl font-semibold">{formatCurrency(pendingCashback)}</p>
          <div className="mt-3 h-9"></div> {/* Empty space to align with button in the first column */}
        </div>
      </div>
      
      {/* Payment methods section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
        
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Primary current account</p>
              <p className="text-sm text-gray-500">HDFC Bank ****9752</p>
            </div>
            <div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
            </div>
          </div>
        </div>
        
        <button className="text-black font-medium flex items-center">
          <Plus size={16} className="mr-1" />
          Add payment method
        </button>
      </div>
      
      {/* Transaction History Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Transaction history</h3>
        </div>
        
        {paymentHistory.length === 0 ? (
          <div className="text-gray-500 p-4 border border-gray-200 rounded-lg text-center">
            No transaction history available.
          </div>
        ) : (
          <div className="space-y-4">
            {paymentHistory.map(payment => (
              <div key={payment.id} className="border-b pb-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {payment.type === 'Cashback redeemed' ? (
                      <div className="bg-orange-100 p-2 rounded-full mr-3">
                        <ArrowRight size={16} className="text-orange-600" />
                      </div>
                    ) : (
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Building size={16} className="text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{payment.type}</p>
                      <p className="text-sm text-gray-500">{payment.date}</p>
                      {payment.account && <p className="text-sm text-gray-500">{payment.account.replace("Checking", "Current")}</p>}
                    </div>
                  </div>
                  <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppDrawer>
  );
};

export default PaymentsDrawer;