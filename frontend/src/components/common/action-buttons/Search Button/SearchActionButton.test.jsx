import React, { useState } from 'react';
import SearchActionButton from './SearchActionButton';

/**
 * This is a simple test component to demonstrate the SearchActionButton
 * in isolation. This is not meant to be used in production.
 */
const SearchActionButtonTest = () => {
  const [searchValues, setSearchValues] = useState({
    default: '',
    noBorder: '',
    customWidth: '',
    custom: '',
    disabled: ''
  });

  const handleSearchChange = (type, value) => {
    setSearchValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SearchActionButton Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Default Usage</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <SearchActionButton
            onSearchChange={(value) => handleSearchChange('default', value)}
            placeholder="Search..."
          />
          <span className="text-gray-500">← Default search button</span>
        </div>
        {searchValues.default && (
          <p className="mt-2 text-sm text-gray-600">Search term: "{searchValues.default}"</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">No Border</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <SearchActionButton
            onSearchChange={(value) => handleSearchChange('noBorder', value)}
            placeholder="Search without border..."
            noBorder={true}
          />
          <span className="text-gray-500">← No border</span>
        </div>
        {searchValues.noBorder && (
          <p className="mt-2 text-sm text-gray-600">Search term: "{searchValues.noBorder}"</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Custom Width</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <SearchActionButton
            onSearchChange={(value) => handleSearchChange('customWidth', value)}
            placeholder="Half width search..."
            width="1/2"
          />
          <span className="text-gray-500">← Custom width (1/2)</span>
        </div>
        {searchValues.customWidth && (
          <p className="mt-2 text-sm text-gray-600">Search term: "{searchValues.customWidth}"</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Custom Styling</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <SearchActionButton
            onSearchChange={(value) => handleSearchChange('custom', value)}
            placeholder="Custom styled search..."
            className="bg-orange-50 rounded-lg"
          />
          <span className="text-gray-500">← Custom styling applied</span>
        </div>
        {searchValues.custom && (
          <p className="mt-2 text-sm text-gray-600">Search term: "{searchValues.custom}"</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Disabled State</h2>
        <div className="flex items-center justify-start space-x-4 p-4 border border-gray-200 rounded-md">
          <SearchActionButton
            onSearchChange={(value) => handleSearchChange('disabled', value)}
            placeholder="Disabled search input..."
            disabled={true}
          />
          <span className="text-gray-500">← Disabled state</span>
        </div>
        {searchValues.disabled && (
          <p className="mt-2 text-sm text-gray-600">Search term: "{searchValues.disabled}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchActionButtonTest;