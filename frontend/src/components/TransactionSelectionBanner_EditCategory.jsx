import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';
import { CHART_OF_ACCOUNTS, filterAccountsBySearchTerm } from '../utils/accountingData';

/**
 * TransactionSelectionBanner_EditCategory Component
 * 
 * Modal that appears when editing categories for selected transactions.
 * Displays a list of categories that can be selected to assign to transactions.
 * 
 * @param {Object} props
 * @param {number} props.selectedCount - Number of selected transactions
 * @param {Function} props.onSelectCategory - Handler for category selection
 * @param {Function} props.onClose - Handler for closing the modal
 */
const TransactionSelectionBanner_EditCategory = ({
  selectedCount,
  onSelectCategory,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);

  // Initialize categories from CHART_OF_ACCOUNTS
  useEffect(() => {
    // Sort categories alphabetically by name
    const sortedCategories = [...CHART_OF_ACCOUNTS].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    setCategories(sortedCategories);
  }, []);

  // Filter categories based on search term
  const filteredCategories = searchTerm.trim() === '' 
    ? categories 
    : filterAccountsBySearchTerm(categories, searchTerm);

  // Handle selection of a category with improved UX
  const handleCategorySelect = (category) => {
    if (onSelectCategory) {
      // Add visual feedback before calling parent handler
      const listItem = document.getElementById(`category-item-${category.id}`);
      if (listItem) {
        // Add a brief highlight effect
        listItem.classList.add('bg-green-50');
        
        // Set a small timeout to show the selection before closing
        setTimeout(() => {
          onSelectCategory(category);
        }, 150);
      } else {
        // If we can't find the element for some reason, just call the handler immediately
        onSelectCategory(category);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-600">
            Editing {selectedCount} {selectedCount === 1 ? 'transaction' : 'transactions'}
          </h2>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Type to search"
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories list */}
        <div className="flex-1 overflow-y-auto">
          {filteredCategories.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No categories found matching "{searchTerm}"
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <li 
                  id={`category-item-${category.id}`}
                  key={category.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="p-4">
                    <div className="font-medium text-gray-800">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.code}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

TransactionSelectionBanner_EditCategory.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default TransactionSelectionBanner_EditCategory;