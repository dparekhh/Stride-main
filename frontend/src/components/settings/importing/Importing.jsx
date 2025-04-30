import React from 'react';

function Importing({ activeSubtab }) {
  const renderImportSources = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-md font-semibold mb-4">Active Import Sources</h3>
        
        <div className="divide-y divide-gray-100">
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center text-orange-600 mr-3">
                  <i className="fas fa-file-upload"></i>
                </div>
                <div>
                  <h4 className="font-medium">Manual Upload</h4>
                  <p className="text-sm text-gray-500">Upload invoices and receipts manually</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" id="manual_upload" className="sr-only toggle-checkbox" defaultChecked />
                  <label htmlFor="manual_upload" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center text-green-600 mr-3">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div>
                  <h4 className="font-medium">WhatsApp Integration</h4>
                  <p className="text-sm text-gray-500">Receive invoices and receipts via WhatsApp</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" id="whatsapp_integration" className="sr-only toggle-checkbox" defaultChecked />
                  <label htmlFor="whatsapp_integration" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mr-3">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 className="font-medium">Email Integration</h4>
                  <p className="text-sm text-gray-500">Receive invoices and receipts via email</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-3">
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Inactive</span>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" id="email_integration" className="sr-only toggle-checkbox" />
                  <label htmlFor="email_integration" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center text-purple-600 mr-3">
                  <i className="fas fa-cloud-download-alt"></i>
                </div>
                <div>
                  <h4 className="font-medium">ERP Import</h4>
                  <p className="text-sm text-gray-500">Import data from connected ERP systems</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-3">
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Inactive</span>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" id="erp_import" className="sr-only toggle-checkbox" />
                  <label htmlFor="erp_import" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-md font-semibold mb-4">AI Processing Settings</h3>
        
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-sm">OCR Confidence Threshold</label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="85"
                className="w-full mr-4"
              />
              <span className="text-sm font-medium">85%</span>
            </div>
            <p className="text-xs text-gray-500">
              Data with confidence levels below this threshold will require manual review
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">Enhanced NLP Processing</h4>
              <p className="text-xs text-gray-500">
                Enable advanced natural language processing for better categorization
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="enhanced_nlp" className="sr-only toggle-checkbox" defaultChecked />
              <label htmlFor="enhanced_nlp" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">Auto-Categorization</h4>
              <p className="text-xs text-gray-500">
                Automatically categorize expenses based on AI analysis
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="auto_categorization" className="sr-only toggle-checkbox" defaultChecked />
              <label htmlFor="auto_categorization" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">Vendor Matching</h4>
              <p className="text-xs text-gray-500">
                Auto-match vendors based on invoice data
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="vendor_matching" className="sr-only toggle-checkbox" defaultChecked />
              <label htmlFor="vendor_matching" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">Data Extraction Quality Checks</h4>
              <p className="text-xs text-gray-500">
                Perform additional verification on extracted data
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="quality_checks" className="sr-only toggle-checkbox" defaultChecked />
              <label htmlFor="quality_checks" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-md font-semibold mb-4">OpenAI Integration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Model</label>
            <select className="input-field">
              <option value="gpt-4o">GPT-4o (Recommended)</option>
              <option value="gpt-4-32k">GPT-4 32k</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">Enable Advanced Document Analysis</h4>
              <p className="text-xs text-gray-500">
                Use OpenAI's advanced capabilities for complex document analysis
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="advanced_analysis" className="sr-only toggle-checkbox" defaultChecked />
              <label htmlFor="advanced_analysis" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">Document Templates</h3>
          <button className="btn-primary text-sm">
            <i className="fas fa-plus mr-2"></i>
            Add Template
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 mr-3">
                <i className="fas fa-file-invoice"></i>
              </div>
              <div>
                <h4 className="font-medium">Standard Invoice</h4>
                <p className="text-sm text-gray-500">Default template for most invoices</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-edit"></i>
              </button>
              <button className="text-red-500 hover:text-red-700">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 mr-3">
                <i className="fas fa-receipt"></i>
              </div>
              <div>
                <h4 className="font-medium">Expense Receipt</h4>
                <p className="text-sm text-gray-500">Template for standard receipts</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-edit"></i>
              </button>
              <button className="text-red-500 hover:text-red-700">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 mr-3">
                <i className="fas fa-building"></i>
              </div>
              <div>
                <h4 className="font-medium">GST Invoice</h4>
                <p className="text-sm text-gray-500">Template for GST-compliant invoices</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-edit"></i>
              </button>
              <button className="text-red-500 hover:text-red-700">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-md font-semibold mb-4">Template Training</h3>
        <p className="text-sm text-gray-600 mb-4">
          Improve AI recognition by training the system with your specific document formats
        </p>
        
        <button className="btn-secondary w-full py-3">
          <i className="fas fa-brain mr-2"></i>
          Train AI with Your Documents
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubtab) {
      case 'import_sources':
        return renderImportSources();
      case 'ai_settings':
        return renderAISettings();
      case 'templates':
        return renderTemplates();
      default:
        return renderImportSources();
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}

export default Importing;
