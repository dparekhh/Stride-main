import React from 'react';
import PropTypes from 'prop-types';

/**
 * BalanceProgressBar - A reusable component to display balance information with a progress bar
 * 
 * This component provides a standardized way to display balance information including:
 * - Current balance
 * - Total balance limit
 * - Pending balance
 * - Available cashback
 * - Pending cashback (optional)
 * - Progress bar visualization of current/total balance
 * 
 * @component
 */
const BalanceProgressBar = ({
  currentBalance,
  totalBalance,
  pendingBalance,
  availableCashback,
  pendingCashback,
  onAddFunds,
  customClasses = {}
}) => {
  // Calculate progress percentage
  const progressPercentage = (currentBalance / totalBalance) * 100;
  
  // Format currency value
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`px-6 mb-6 ${customClasses.container || ''}`}>
      <div className={`flex justify-between mb-2 ${customClasses.balanceRow || ''}`}>
        <div className={`space-y-1 ${customClasses.leftColumn || ''}`}>
          <p className={`text-sm text-gray-500 ${customClasses.label || ''}`}>Utilized limit</p>
          <h2 className={`text-3xl font-semibold ${customClasses.balanceValue || ''}`}>
            {formatCurrency(currentBalance)}
          </h2>
          <p className={`text-sm text-gray-500 ${customClasses.pendingLabel || ''}`}>
            Pending: {formatCurrency(pendingBalance)}
          </p>
        </div>

        <div className={`space-y-1 text-right ${customClasses.rightColumn || ''}`}>
          <p className={`text-sm text-gray-500 ${customClasses.label || ''}`}>Total limit</p>
          <h2 className={`text-3xl font-semibold ${customClasses.totalValue || ''}`}>
            {formatCurrency(totalBalance)}
          </h2>
          {onAddFunds && (
            <a 
              href="#" 
              className={`text-sm text-black underline hover:text-gray-700 cursor-pointer ${customClasses.addFundsLink || ''}`}
              onClick={(e) => {
                e.preventDefault();
                onAddFunds();
              }}
            >
              Add funds
            </a>
          )}
        </div>
      </div>

      {/* Progress bar - full width to match header divider */}
      <div className={`w-full h-2 bg-gray-200 rounded-full mt-2 mb-4 ${customClasses.progressBarContainer || ''}`}>
        <div 
          className={`h-2 bg-blue-500 rounded-full ${customClasses.progressBar || ''}`} 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Available cashback */}
      <div className={`pb-4 mb-6 ${customClasses.cashbackContainer || ''}`}>
        <p className={`text-sm text-gray-500 ${customClasses.cashbackLabel || ''}`}>Available cashback</p>
        <p className={`text-lg font-medium flex items-center ${customClasses.cashbackValue || ''}`}>
          {formatCurrency(availableCashback)}
          <span className="ml-1">-&gt;</span>
        </p>
        {pendingCashback !== undefined && (
          <p className={`text-sm text-gray-500 ${customClasses.pendingCashbackLabel || ''}`}>
            Pending cashback: {formatCurrency(pendingCashback)}
          </p>
        )}
      </div>
    </div>
  );
};

BalanceProgressBar.propTypes = {
  /** Current balance amount */
  currentBalance: PropTypes.number.isRequired,
  /** Total balance limit */
  totalBalance: PropTypes.number.isRequired,
  /** Pending balance amount */
  pendingBalance: PropTypes.number.isRequired,
  /** Available cashback amount */
  availableCashback: PropTypes.number.isRequired,
  /** Optional pending cashback amount */
  pendingCashback: PropTypes.number,
  /** Optional callback function when "Add funds" is clicked */
  onAddFunds: PropTypes.func,
  /** Optional custom CSS classes for styling component parts */
  customClasses: PropTypes.shape({
    container: PropTypes.string,
    balanceRow: PropTypes.string,
    leftColumn: PropTypes.string,
    rightColumn: PropTypes.string,
    label: PropTypes.string,
    balanceValue: PropTypes.string,
    totalValue: PropTypes.string,
    pendingLabel: PropTypes.string,
    addFundsLink: PropTypes.string,
    progressBarContainer: PropTypes.string,
    progressBar: PropTypes.string,
    cashbackContainer: PropTypes.string,
    cashbackLabel: PropTypes.string,
    cashbackValue: PropTypes.string,
    pendingCashbackLabel: PropTypes.string
  })
};

export default BalanceProgressBar;