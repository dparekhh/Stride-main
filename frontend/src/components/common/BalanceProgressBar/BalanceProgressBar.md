# BalanceProgressBar

A reusable component to display balance information with a progress bar visualization.

## Features

- Displays current balance and total balance limit
- Shows pending balance amount
- Includes available cashback information
- Optional pending cashback display
- Visual progress bar representing balance utilization
- Optional "Add funds" action with callback
- Highly customizable with CSS class overrides

## Usage

```jsx
import BalanceProgressBar from 'components/common/BalanceProgressBar';

// Basic usage
<BalanceProgressBar
  currentBalance={1539072.87}
  totalBalance={2000000}
  pendingBalance={203097}
  availableCashback={7695.36}
/>

// With all options
<BalanceProgressBar
  currentBalance={1539072.87}
  totalBalance={2000000}
  pendingBalance={203097}
  availableCashback={7695.36}
  pendingCashback={1015.49}
  onAddFunds={() => handleAddFunds()}
  customClasses={{
    container: 'bg-gray-50 p-4 rounded-lg',
    progressBar: 'bg-green-500'
  }}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentBalance` | number | Yes | The current balance amount |
| `totalBalance` | number | Yes | The total balance limit |
| `pendingBalance` | number | Yes | The pending balance amount |
| `availableCashback` | number | Yes | The available cashback amount |
| `pendingCashback` | number | No | The pending cashback amount (optional) |
| `onAddFunds` | function | No | Callback function when "Add funds" is clicked |
| `customClasses` | object | No | Object containing CSS class overrides for component parts |

## Integration Guide

To migrate from the existing implementation to this reusable component:

1. Import the component:
   ```jsx
   import BalanceProgressBar from '../components/common/BalanceProgressBar';
   ```

2. Remove the old balance display code:
   ```jsx
   // Remove these lines
   <div className="px-6 mb-6">
     <div className="flex justify-between mb-2">
       <div className="space-y-1">
         <p className="text-sm text-gray-500">Utilized limit</p>
         <h2 className="text-3xl font-semibold">
           {formatCurrency(currentBalance)}
         </h2>
         <p className="text-sm text-gray-500">Pending: {formatCurrency(pendingBalance)}</p>
       </div>

       <div className="space-y-1 text-right">
         <p className="text-sm text-gray-500">Total limit</p>
         <h2 className="text-3xl font-semibold">
           {formatCurrency(totalBalance)}
         </h2>
         <a href="#" className="text-sm text-black underline hover:text-gray-700 cursor-pointer">Add funds</a>
       </div>
     </div>

     {/* Progress bar - full width to match header divider */}
     <div className="w-full h-2 bg-gray-200 rounded-full mt-2 mb-4">
       <div 
         className="h-2 bg-blue-500 rounded-full" 
         style={{ width: `${progressPercentage}%` }}
       ></div>
     </div>

     {/* Available cashback */}
     <div className="pb-4 mb-6">
       <p className="text-sm text-gray-500">Available cashback</p>
       <p className="text-lg font-medium flex items-center">
         {formatCurrency(availableCashback)} <span className="ml-1">-&gt;</span>
       </p>
     </div>
   </div>
   ```

3. Create an add funds handler if needed:
   ```jsx
   const handleAddFunds = () => {
     // Implement add funds functionality
     console.log('Add funds clicked');
     // Example: open a modal or navigate to funds page
   };
   ```

4. Replace with the new component:
   ```jsx
   <BalanceProgressBar
     currentBalance={currentBalance}
     totalBalance={totalBalance}
     pendingBalance={pendingBalance}
     availableCashback={availableCashback}
     pendingCashback={pendingCashback}
     onAddFunds={handleAddFunds}
   />
   ```

## Customization

The component accepts a `customClasses` prop that allows you to override the default styling:

```jsx
<BalanceProgressBar
  currentBalance={1539072.87}
  totalBalance={2000000}
  pendingBalance={203097}
  availableCashback={7695.36}
  customClasses={{
    container: 'bg-gray-50 p-4 rounded-lg',
    progressBar: 'bg-green-500',
    balanceValue: 'text-2xl text-blue-600',
    totalValue: 'text-2xl text-green-600'
  }}
/>
```

Available class override keys:
- `container`: The main container div
- `balanceRow`: The row containing balance information
- `leftColumn`: The left column with current balance
- `rightColumn`: The right column with total balance
- `label`: Balance labels
- `balanceValue`: Current balance value
- `totalValue`: Total balance value
- `pendingLabel`: Pending balance label
- `addFundsLink`: Add funds link
- `progressBarContainer`: Progress bar container
- `progressBar`: The progress bar itself
- `cashbackContainer`: Cashback section container
- `cashbackLabel`: Available cashback label
- `cashbackValue`: Available cashback value
- `pendingCashbackLabel`: Pending cashback label