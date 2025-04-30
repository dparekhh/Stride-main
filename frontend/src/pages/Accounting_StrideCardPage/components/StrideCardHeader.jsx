import React from 'react';

/**
 * StrideCardHeader Component
 * 
 * This component provides the header section for the Stride Card page,
 * including subtabs and counts.
 */
const StrideCardHeader = ({
  transactions,
  activeSubtab,
  setActiveSubtab
}) => {
  // Format subtabs with counts
  const formattedSubtabs = [
    { id: 'overview', label: 'Overview', count: transactions.length },
    { 
      id: 'needs-review', 
      label: 'Needs Review', 
      count: transactions.filter(tx => tx.actionStatus === "Needs review").length 
    },
    { 
      id: 'ready-to-sync', 
      label: 'Ready to Sync', 
      count: transactions.filter(tx => tx.actionStatus === "Ready to sync").length 
    },
    { 
      id: 'waiting-for-cardholder', 
      label: 'Waiting for Cardholder', 
      count: transactions.filter(tx => tx.actionStatus === "Waiting for cardholder").length 
    }
  ];
  
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {formattedSubtabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeSubtab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            onClick={() => setActiveSubtab(tab.id)}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${
                activeSubtab === tab.id
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default StrideCardHeader;