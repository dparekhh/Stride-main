import React from 'react';
import BalanceProgressBar from './BalanceProgressBar';

/**
 * This is a simple test component to demonstrate the BalanceProgressBar
 * in isolation. This is not meant to be used in production.
 */
const BalanceProgressBarTest = () => {
  // Sample data
  const defaultData = {
    currentBalance: 1539072.87,
    totalBalance: 2000000,
    pendingBalance: 203097,
    availableCashback: 7695.36
  };

  // Handler for add funds click
  const handleAddFunds = () => {
    console.log('Add funds clicked');
    alert('Add funds action triggered!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">BalanceProgressBar Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Default Usage</h2>
        <div className="border border-gray-200 rounded-md">
          <BalanceProgressBar
            currentBalance={defaultData.currentBalance}
            totalBalance={defaultData.totalBalance}
            pendingBalance={defaultData.pendingBalance}
            availableCashback={defaultData.availableCashback}
          />
          <p className="px-6 pb-4 text-gray-500">↑ Default balance progress bar without add funds callback</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">With Add Funds Callback</h2>
        <div className="border border-gray-200 rounded-md">
          <BalanceProgressBar
            currentBalance={defaultData.currentBalance}
            totalBalance={defaultData.totalBalance}
            pendingBalance={defaultData.pendingBalance}
            availableCashback={defaultData.availableCashback}
            onAddFunds={handleAddFunds}
          />
          <p className="px-6 pb-4 text-gray-500">↑ With add funds button that triggers an action</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">With Pending Cashback</h2>
        <div className="border border-gray-200 rounded-md">
          <BalanceProgressBar
            currentBalance={defaultData.currentBalance}
            totalBalance={defaultData.totalBalance}
            pendingBalance={defaultData.pendingBalance}
            availableCashback={defaultData.availableCashback}
            pendingCashback={1015.49}
          />
          <p className="px-6 pb-4 text-gray-500">↑ Showing pending cashback information</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Custom Styling</h2>
        <div className="border border-gray-200 rounded-md">
          <BalanceProgressBar
            currentBalance={defaultData.currentBalance}
            totalBalance={defaultData.totalBalance}
            pendingBalance={defaultData.pendingBalance}
            availableCashback={defaultData.availableCashback}
            onAddFunds={handleAddFunds}
            customClasses={{
              container: 'bg-gray-50',
              progressBar: 'bg-green-500',
              balanceValue: 'text-blue-600',
              totalValue: 'text-green-600'
            }}
          />
          <p className="px-6 pb-4 text-gray-500">↑ With custom styling applied</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">High Balance Usage</h2>
        <div className="border border-gray-200 rounded-md">
          <BalanceProgressBar
            currentBalance={1900000}
            totalBalance={2000000}
            pendingBalance={50000}
            availableCashback={9500}
            customClasses={{
              progressBar: 'bg-yellow-500'
            }}
          />
          <p className="px-6 pb-4 text-gray-500">↑ High utilization (95%) with custom progress bar color</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Low Balance Usage</h2>
        <div className="border border-gray-200 rounded-md">
          <BalanceProgressBar
            currentBalance={400000}
            totalBalance={2000000}
            pendingBalance={100000}
            availableCashback={2000}
            customClasses={{
              progressBar: 'bg-green-400'
            }}
          />
          <p className="px-6 pb-4 text-gray-500">↑ Low utilization (20%) with custom progress bar color</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceProgressBarTest;