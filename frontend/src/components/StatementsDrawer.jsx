import React from 'react';
import { Download, ChevronRight } from 'lucide-react';
import AppDrawer from './common/AppDrawer';

/**
 * Statements drawer component for viewing card statements
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Array} props.statements - Array of statement items
 * @returns {React.ReactElement} Statements drawer component
 */
const StatementsDrawer = ({ isOpen, onClose, statements = [] }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date - converts YYYY-MM-DD to MMM D, YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Statements"
      description="View and download your monthly statements"
    >
      {/* Statements section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Monthly Statements</h3>
        
        {statements.length === 0 ? (
          <div className="text-gray-500 p-4 border border-gray-200 rounded-lg text-center">
            No statements available.
          </div>
        ) : (
          <div className="space-y-4">
            {statements.map((statement) => (
              <div 
                key={statement.id} 
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div>
                  <p className="font-medium">{statement.period}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(statement.startDate)} - {formatDate(statement.endDate)}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block h-2 w-2 rounded-full mr-1 ${
                      statement.status === 'Current' ? 'bg-blue-500' : 
                      statement.status === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></span>
                    <span className="text-sm text-gray-500">{statement.status}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(statement.totalAmount)}</p>
                  <p className="text-sm text-gray-500">{statement.totalTransactions} transactions</p>
                  
                  {statement.status === 'Current' && (
                    <p className="text-sm text-gray-500">Due: {formatDate(statement.dueDate)}</p>
                  )}
                  
                  <div className="flex mt-2 justify-end">
                    <button 
                      className="p-1 text-gray-500 hover:text-gray-700"
                      onClick={() => window.open(statement.downloadUrl, '_blank')}
                      title="Download statement"
                    >
                      <Download size={16} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-gray-700" title="View details">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppDrawer>
  );
};

export default StatementsDrawer;