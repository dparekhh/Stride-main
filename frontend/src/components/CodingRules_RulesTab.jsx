import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';

/**
 * CodingRules_RulesTab Component
 * 
 * This component handles the Rules tab in the Coding Rules drawer,
 * displaying and managing basic rule mappings for categories and merchants.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.rules - The list of rules
 * @param {Function} props.onEditRule - Function to call when edit button is clicked
 */
const CodingRules_RulesTab = ({ rules, onEditRule }) => {
  return (
    <div className="p-6">
      {/* Create rule button */}
      <button 
        className="mb-6 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Create rule
      </button>
      
      {/* Rules list - sorted so active mappings appear first, then by type (category above merchant) */}
      <div className="space-y-4">
        {rules
          .sort((a, b) => {
            // First sort by whether it has active mappings
            if (!a.noActiveMapping && b.noActiveMapping) return -1;
            if (a.noActiveMapping && !b.noActiveMapping) return 1;
            
            // If both have active mappings or both don't, sort by type (category above merchant)
            if (a.type === 'category' && b.type === 'merchant') return -1;
            if (a.type === 'merchant' && b.type === 'category') return 1;
            
            // If same type and active status, keep original order
            return a.id - b.id;
          })
          .map((rule) => (
            <div 
              key={rule.id}
              className="border border-gray-200 rounded-md p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium text-gray-800">{rule.name}</h4>
                {rule.noActiveMapping ? (
                  <p className="text-gray-500 text-sm">No active mappings</p>
                ) : (
                  <p className="text-green-600 text-sm">
                    {rule.mappingsCount} active {rule.mappingsCount === 1 ? 'mapping' : 'mappings'}
                  </p>
                )}
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => onEditRule(rule)}
              >
                <Edit2 size={16} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CodingRules_RulesTab;