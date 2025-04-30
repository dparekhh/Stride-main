// src/pages/AccountingSetup.jsx
import React, { useState } from "react";
import { useAccounting } from "../contexts/AccountingContext";
import { 
  Book, 
  ClipboardCheck, 
  DollarSign, 
  ChevronRight, 
  ChevronDown,
  AlertCircle,
  Check,
} from "lucide-react";

/**
 * AccountingSetup component
 * Displays the accounting setup flow for users to integrate with accounting software
 */
const AccountingSetup = () => {
  const { completeAccountingSetup } = useAccounting();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Accounting provider options
  const providers = [
    { id: "quickbooks", name: "QuickBooks" },
    { id: "xero", name: "Xero" },
    { id: "tally", name: "Tally" },
    { id: "zohobooks", name: "Zoho Books" },
  ];

  // FAQ items
  const faqItems = [
    {
      id: 1,
      question: "What happens when I connect my accounting software?",
      answer:
        "When you connect your accounting software, Stride will be able to sync bills, vendors, and payment information between systems. This eliminates manual data entry and ensures your books are always up to date."
    },
    {
      id: 2,
      question: "Is my accounting data secure?",
      answer:
        "Yes, your accounting data is completely secure. Stride uses bank-level encryption and never stores your accounting credentials. We only access the specific data needed for syncing."
    },
    {
      id: 3,
      question: "Can I control what gets synced?",
      answer:
        "Absolutely. You'll have complete control over what data gets synced and when. You can set up automatic syncing or manually approve each sync."
    }
  ];

  // Handle provider selection
  const handleProviderSelect = (providerId) => {
    setSelectedProvider(providerId);
  };

  // Handle connect button click
  const handleConnect = () => {
    if (!selectedProvider) return;
    
    // In a real app, this would open OAuth flow with the provider
    // For demo, we'll just complete the setup with mock data
    completeAccountingSetup({
      provider: selectedProvider,
      companyId: "demo-company-123",
    });
  };

  // Handle FAQ toggle
  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Set up your accounting integration</h1>
          <p className="text-gray-600">
            Connect your accounting software to sync bills, payments, and more.
          </p>
        </div>
        
        {/* Benefits section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <ClipboardCheck size={20} className="text-blue-600" />
              </div>
              <h3 className="font-semibold">Automatic syncing</h3>
            </div>
            <p className="text-sm text-gray-600">
              Bills and payments sync automatically to keep your books up to date
            </p>
          </div>
          
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <h3 className="font-semibold">Simplified reconciliation</h3>
            </div>
            <p className="text-sm text-gray-600">
              Match transactions seamlessly between systems with smart matching
            </p>
          </div>
          
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-100 rounded-full mr-3">
                <Book size={20} className="text-purple-600" />
              </div>
              <h3 className="font-semibold">Error prevention</h3>
            </div>
            <p className="text-sm text-gray-600">
              Avoid double entry and transcription errors with direct integrations
            </p>
          </div>
        </div>
        
        {/* Integration selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select your accounting software</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={`border rounded-lg p-4 cursor-pointer flex items-center justify-between ${
                  selectedProvider === provider.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleProviderSelect(provider.id)}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    selectedProvider === provider.id 
                      ? "border-blue-500 bg-blue-500" 
                      : "border-gray-300"
                  }`}>
                    {selectedProvider === provider.id && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>
                  <span className="font-medium">{provider.name}</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                  onClick={() => toggleFaq(item.id)}
                >
                  <h3 className="font-medium">{item.question}</h3>
                  <button className="text-gray-500">
                    {expandedFaq === item.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                </div>
                {expandedFaq === item.id && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <p className="text-sm text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => {}}
          >
            I'll do this later
          </button>
          <button
            className={`px-6 py-2 rounded-md ${
              selectedProvider
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleConnect}
            disabled={!selectedProvider}
          >
            Connect {selectedProvider && providers.find(p => p.id === selectedProvider)?.name}
          </button>
        </div>
        
        {/* Alternative setup option */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-md font-medium mb-2">Alternatively</h3>
          <button
            className="flex items-center text-blue-600 hover:text-blue-800"
            onClick={() => {}}
          >
            <span className="mr-2">Select someone to set it up</span>
          </button>
        </div>
        
        {/* Footer note with icon */}
        <div className="flex items-center text-sm text-gray-500">
          <AlertCircle size={16} className="mr-2" />
          <p>No stress, Stride never syncs data without your approval</p>
        </div>
      </div>
    </div>
  );
};

export default AccountingSetup;