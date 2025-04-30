import React, { useState } from 'react';
import SearchActionButton from './SearchActionButton';

/**
 * Example component to demonstrate the SearchActionButton in a practical scenario
 */
const SearchActionButtonExample = () => {
  // State to hold search results
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockData = [
    { id: 1, name: 'Invoice #1001', amount: '₹12,500', date: '12 Apr 2025' },
    { id: 2, name: 'Invoice #1002', amount: '₹8,750', date: '15 Apr 2025' },
    { id: 3, name: 'Invoice #1003', amount: '₹22,000', date: '18 Apr 2025' },
    { id: 4, name: 'Invoice #1004', amount: '₹5,300', date: '20 Apr 2025' },
    { id: 5, name: 'Invoice #1005', amount: '₹16,800', date: '25 Apr 2025' },
  ];

  // Handle search term changes
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    
    // Filter mock data based on search term
    if (term.trim() === '') {
      setSearchResults([]);
    } else {
      const filtered = mockData.filter(item => 
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.amount.includes(term) ||
        item.date.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SearchActionButton Example</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Default Usage</h2>
        <div className="flex items-center justify-start p-4 border border-gray-200 rounded-md">
          <SearchActionButton
            onSearchChange={handleSearchChange}
            placeholder="Search invoices..."
          />
        </div>
        
        {searchTerm && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {searchResults.length > 0 
                ? `Found ${searchResults.length} result(s) for "${searchTerm}"` 
                : `No results found for "${searchTerm}"`}
            </p>
            
            {searchResults.length > 0 && (
              <ul className="mt-2 border rounded-md divide-y">
                {searchResults.map(item => (
                  <li key={item.id} className="p-3 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span>{item.amount}</span>
                    </div>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Without Border</h2>
        <div className="flex items-center justify-start p-4 border border-gray-200 rounded-md">
          <SearchActionButton
            onSearchChange={(term) => console.log('Search term (no border):', term)}
            placeholder="No border search..."
            noBorder={true}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Custom Width</h2>
        <div className="flex items-center justify-start p-4 border border-gray-200 rounded-md">
          <SearchActionButton
            onSearchChange={(term) => console.log('Search term (custom width):', term)}
            placeholder="Half width search..."
            width="1/2"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Custom Styling</h2>
        <div className="flex items-center justify-start p-4 border border-gray-200 rounded-md">
          <SearchActionButton
            onSearchChange={(term) => console.log('Search term (custom style):', term)}
            placeholder="Custom styled search..."
            className="bg-orange-50 rounded-lg"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Disabled State</h2>
        <div className="flex items-center justify-start p-4 border border-gray-200 rounded-md">
          <SearchActionButton
            onSearchChange={(term) => console.log('Search term (disabled):', term)}
            placeholder="Disabled search input..."
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchActionButtonExample;