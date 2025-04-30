import React, { useState } from 'react';
import DownloadActionButton from './DownloadActionButton';

/**
 * Example component to demonstrate the DownloadActionButton in a practical scenario
 */
const DownloadActionButtonExample = () => {
  const [lastDownloadType, setLastDownloadType] = useState(null);
  
  // Sample data for demonstration
  const transactions = [
    { id: 1, date: '2024-04-01', amount: 1250.00, merchant: 'ABC Corp' },
    { id: 2, date: '2024-04-02', amount: 350.75, merchant: 'XYZ Services' },
    { id: 3, date: '2024-04-03', amount: 125.00, merchant: 'Office Supplies Ltd' }
  ];
  
  // Handlers for different download scenarios
  const handleDownloadAll = () => {
    console.log('Downloading all transactions:', transactions);
    setLastDownloadType('All transactions');
  };
  
  const handleDownloadSelected = () => {
    console.log('Downloading selected transaction:', transactions[0]);
    setLastDownloadType('Selected transaction');
  };
  
  const handleEmptyDownload = () => {
    console.log('No data to download');
    setLastDownloadType('Empty data');
  };
  
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">DownloadActionButton Example</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
        <div className="p-4 border rounded-md">
          <p className="mb-3">Simple download button:</p>
          <DownloadActionButton
            onDownload={handleDownloadAll}
            tooltipText="Download all transactions"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Variants</h2>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Default</h3>
            <DownloadActionButton
              onDownload={handleDownloadAll}
              tooltipText="Download data"
            />
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Custom Style</h3>
            <DownloadActionButton
              onDownload={handleDownloadSelected}
              tooltipText="Download selected"
              className="bg-orange-50 rounded-full"
            />
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Disabled</h3>
            <DownloadActionButton
              onDownload={handleEmptyDownload}
              tooltipText="No data to download"
              disabled={true}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">In Context</h3>
        <div className="p-4 border rounded-md">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Transaction List</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                className="px-3 py-1 border rounded-md"
                placeholder="Search..."
              />
              <DownloadActionButton
                onDownload={handleDownloadAll}
                tooltipText="Export transactions"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Merchant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.merchant}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {lastDownloadType && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">Last download action: {lastDownloadType}</p>
        </div>
      )}
    </div>
  );
};

export default DownloadActionButtonExample;