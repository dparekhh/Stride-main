import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PageLayout } from '../components/common/page-layout';

/**
 * Accounting_BillPayPage Component
 * 
 * Displays bill payment data integrated with accounting software
 * This is a placeholder component that will be implemented in future phases
 */
const Accounting_BillPayPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  // Check connection status via context in a real implementation
  useEffect(() => {
    // Simulate checking connection status
    setTimeout(() => setIsConnected(true), 500);
  }, []);
  
  return (
    <PageLayout
      pageTitle="Accounting"
      heading="Bill Payment"
      subheading="View and manage your bills synced with your accounting software"
      showSearchBar={false}
      showActionButtons={false}
    >
      {isConnected ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl">
          <div className="flex items-center text-blue-700 mb-4">
            <AlertTriangle className="mr-2" size={24} />
            <h2 className="text-lg font-medium">Coming Soon</h2>
          </div>
          <p className="text-gray-700 mb-4">
            The Bill Payment integration feature is currently under development and will be available in an upcoming release.
          </p>
          <p className="text-gray-700">
            This page will allow you to:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
            <li>View bills ready to sync with your accounting software</li>
            <li>Select which bills to sync</li>
            <li>Set accounting categories and payment terms for each bill</li>
            <li>Create detailed reports for accounting reconciliation</li>
            <li>Track payment status across your accounting system</li>
          </ul>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-4xl">
          <div className="flex items-center text-yellow-700 mb-4">
            <AlertTriangle className="mr-2" size={24} />
            <h2 className="text-lg font-medium">Accounting Software Not Connected</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Please connect your accounting software to access bill payment integration features.
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            onClick={() => {
              // In a real implementation, this would navigate to the connection page
              console.log('Navigate to accounting connection page');
            }}
          >
            Connect Accounting Software
          </button>
        </div>
      )}
    </PageLayout>
  );
};

export default Accounting_BillPayPage;