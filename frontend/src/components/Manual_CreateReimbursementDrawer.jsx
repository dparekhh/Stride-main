import React, { useState } from 'react';
import FileUploadZone from './common/FileUploadZone';
import SearchableDropdown from './common/SearchableDropdown';
import { Calendar } from 'lucide-react';
import people from '../utils/PeoplePage_PlaceholderPeople';

/**
 * Manual_CreateReimbursementDrawer Component
 * 
 * Reusable component for the Manual tab in the Create Reimbursement drawer
 * 
 * @param {Object} props
 * @param {Function} props.onReceiptUpload - Function to handle uploaded receipt file
 * @param {Function} props.onClose - Function to close the drawer
 * @returns {React.ReactElement} Manual tab content
 */
const Manual_CreateReimbursementDrawer = ({ onReceiptUpload, onClose }) => {
  const [person, setPerson] = useState("");
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [description, setDescription] = useState("");

  // Handle form submission
  const handleSubmit = () => {
    console.log('Form submitted:', { person, merchant, amount, transactionDate, description });
    // Additional submission logic can be added here
  };

  // Format option for the SearchableDropdown
  const formatPersonOption = (option) => {
    const { name, department, location } = option;
    const initials = name.split(' ').map(word => word[0]).join('');
    
    return (
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
          {initials}
        </div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">{department} · {location}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-grow p-4 space-y-4 overflow-y-auto pb-8">
        {/* Choose person field */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Choose person (required)
          </label>
          <SearchableDropdown
            options={people}
            value={person}
            onChange={setPerson}
            placeholder="Select a person"
            displayKey="name"
            valueKey="id"
            formatOption={formatPersonOption}
            chevronStyle={{ type: 'rotating' }}
          />
        </div>

        {/* Merchant field */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Merchant (required)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />
        </div>

        {/* Amount and Currency fields */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-500 mb-1">
              Amount (required)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="w-1/3">
            <label className="block text-sm text-gray-500 mb-1">
              Currency (required)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              value="INR"
              readOnly
              disabled
            />
          </div>
        </div>

        {/* Transaction date field */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Transaction date (required)
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
          </div>
        </div>

        {/* Description field */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            What is it for?
          </label>
          <textarea
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            rows="2"
            placeholder="e.g. Lunch meeting with marketing team (required)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Receipt upload */}
        <div className="pb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attach Receipt
          </label>
          <FileUploadZone 
            uploadText="Drop receipt or click here to upload"
            onFileUpload={onReceiptUpload}
            className="max-h-32 mt-2"
          />
        </div>
      </div>
      
      {/* Footer - fixed at the bottom with full width */}
      <div className="w-full px-4 py-3 bg-white flex justify-between items-center border-t border-gray-200 mt-auto">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Close
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Manual_CreateReimbursementDrawer;