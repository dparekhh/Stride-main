import React from 'react';

function Approvals({ activeSubtab }) {
  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">Approval Workflows</h3>
          <button className="btn-primary text-sm">
            <i className="fas fa-plus mr-2"></i>
            Create Workflow
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Standard Invoice Approval</h4>
                <p className="text-sm text-gray-500 mt-1">For all invoices under ₹50,000</p>
              </div>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="flex-1 relative">
                <div className="h-1 bg-gray-200 rounded">
                  <div className="h-1 bg-green-500 rounded" style={{ width: '100%' }}></div>
                </div>
                <div className="absolute -top-2 left-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <i className="fas fa-user-tie text-xs"></i>
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <i className="fas fa-user-shield text-xs"></i>
                </div>
                <div className="absolute -top-2 right-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <i className="fas fa-check text-xs"></i>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 text-xs text-gray-500">
              <div>Requester</div>
              <div className="text-center">Finance Manager</div>
              <div className="text-right">Approval Complete</div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">High-Value Invoice Approval</h4>
                <p className="text-sm text-gray-500 mt-1">For invoices above ₹50,000</p>
              </div>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <div className="flex-1 relative">
                <div className="h-1 bg-gray-200 rounded">
                  <div className="h-1 bg-green-500 rounded" style={{ width: '100%' }}></div>
                </div>
                <div className="absolute -top-2 left-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <i className="fas fa-user-tie text-xs"></i>
                </div>
                <div className="absolute -top-2 left-1/3 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <i className="fas fa-user-shield text-xs"></i>
                </div>
                <div className="absolute -top-2 left-2/3 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <i className="fas fa-user-tie text-xs"></i>
                </div>
                <div className="absolute -top-2 right-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <i className="fas fa-check text-xs"></i>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 text-xs text-gray-500">
              <div>Requester</div>
              <div>Finance Manager</div>
              <div>CFO</div>
              <div className="text-right">Approval Complete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRules = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">Approval Rules</h3>
          <button className="btn-primary text-sm">
            <i className="fas fa-plus mr-2"></i>
            Add Rule
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Amount-Based Routing</h4>
                <p className="text-sm text-gray-500 mt-1">Route based on invoice amount</p>
              </div>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div className="mt-3 bg-gray-50 p-3 rounded-md">
              <p className="text-sm"><span className="font-medium">Condition:</span> If invoice amount is <span className="font-medium">greater than ₹50,000</span></p>
              <p className="text-sm mt-1"><span className="font-medium">Action:</span> Use <span className="font-medium">High-Value Invoice Approval</span> workflow</p>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Vendor-Based Routing</h4>
                <p className="text-sm text-gray-500 mt-1">Special rules for specific vendors</p>
              </div>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div className="mt-3 bg-gray-50 p-3 rounded-md">
              <p className="text-sm"><span className="font-medium">Condition:</span> If vendor is <span className="font-medium">in approved vendor list</span></p>
              <p className="text-sm mt-1"><span className="font-medium">Action:</span> Skip approval for invoices under ₹10,000</p>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Category-Based Routing</h4>
                <p className="text-sm text-gray-500 mt-1">Route based on expense category</p>
              </div>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div className="mt-3 bg-gray-50 p-3 rounded-md">
              <p className="text-sm"><span className="font-medium">Condition:</span> If category is <span className="font-medium">Capital Expenditure</span></p>
              <p className="text-sm mt-1"><span className="font-medium">Action:</span> Always use <span className="font-medium">High-Value Invoice Approval</span> workflow</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApprovers = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">Approvers</h3>
          <button className="btn-primary text-sm">
            <i className="fas fa-plus mr-2"></i>
            Add Approver
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      RS
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Rahul Singh</div>
                      <div className="text-sm text-gray-500">rahul@company.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Finance Manager</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Finance</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹ 50,000</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-gray-500 hover:text-gray-700 mr-3">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      AM
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Ananya Mehta</div>
                      <div className="text-sm text-gray-500">ananya@company.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">CFO</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Executive</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹ 500,000</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-gray-500 hover:text-gray-700 mr-3">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      VP
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Vikram Patel</div>
                      <div className="text-sm text-gray-500">vikram@company.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Department Head</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Operations</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹ 100,000</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-gray-500 hover:text-gray-700 mr-3">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubtab) {
      case 'workflows':
        return renderWorkflows();
      case 'rules':
        return renderRules();
      case 'approvers':
        return renderApprovers();
      default:
        return renderWorkflows();
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}

export default Approvals;
