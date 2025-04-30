import React, { useState } from 'react';
import BalanceProgressBar from './BalanceProgressBar';

/**
 * Example component to demonstrate the BalanceProgressBar in a practical scenario
 */
const BalanceProgressBarExample = () => {
  // Sample balance data
  const [balanceData, setBalanceData] = useState({
    currentBalance: 1539072.87,
    totalBalance: 2000000,
    pendingBalance: 203097,
    availableCashback: 7695.36,
    pendingCashback: 1015.49
  });

  // Sample action handlers
  const handleAddFunds = () => {
    // In a real application, this would open a modal or navigate to a funds page
    console.log('Add funds action triggered');
    
    // For demo purposes, show a modal-like dialog
    document.getElementById('add-funds-modal').classList.remove('hidden');
  };

  const handleCloseModal = () => {
    document.getElementById('add-funds-modal').classList.add('hidden');
  };

  const handleAddFundsSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('fund-amount').value);
    
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    // In a real application, this would make an API call
    // For demo, update the balance data directly
    setBalanceData(prev => ({
      ...prev,
      totalBalance: prev.totalBalance + amount
    }));
    
    handleCloseModal();
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Expenses Dashboard</h2>
          </div>
          
          {/* The BalanceProgressBar component being demonstrated */}
          <BalanceProgressBar
            currentBalance={balanceData.currentBalance}
            totalBalance={balanceData.totalBalance}
            pendingBalance={balanceData.pendingBalance}
            availableCashback={balanceData.availableCashback}
            pendingCashback={balanceData.pendingCashback}
            onAddFunds={handleAddFunds}
          />
          
          {/* Rest of the dashboard (simplified for demonstration) */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cloud Services Inc.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IT Services</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹24,599</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-14</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Office Supplies Ltd</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Office Expenses</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹8,750</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-12</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Travel Agency</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Travel & Entertainment</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹32,845</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for adding funds (would be a proper modal component in a real app) */}
      <div id="add-funds-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-bold mb-4">Add Funds to Account</h3>
          <form onSubmit={handleAddFundsSubmit}>
            <div className="mb-4">
              <label htmlFor="fund-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                id="fund-amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter amount"
                min="1"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Funds
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BalanceProgressBarExample;