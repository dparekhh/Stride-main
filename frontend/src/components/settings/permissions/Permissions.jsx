import React from 'react';

function Permissions({ activeSubtab }) {
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">User Management</h3>
          <button className="btn-primary text-sm">
            <i className="fas fa-plus mr-2"></i>
            Add User
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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                      AM
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Ananya Mehta</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">ananya@company.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Administrator</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
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
                      RS
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Rahul Singh</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">rahul@company.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">AP Clerk</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
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
                      PG
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Priya Gupta</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">priya@company.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Approver</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
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

  const renderRoles = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">Role Management</h3>
          <button className="btn-primary text-sm">
            <i className="fas fa-plus mr-2"></i>
            Add Role
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Administrator</h4>
                <p className="text-sm text-gray-500">Full system access</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-edit"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">AP Clerk</h4>
                <p className="text-sm text-gray-500">Invoice processing and bill management</p>
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
          
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Approver</h4>
                <p className="text-sm text-gray-500">Review and approve invoices</p>
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
          
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Finance Manager</h4>
                <p className="text-sm text-gray-500">Full financial overview and reporting</p>
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
          
          <div className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Read Only</h4>
                <p className="text-sm text-gray-500">View-only access to system data</p>
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
      </div>
    </div>
  );

  const renderAccessControl = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-md font-semibold mb-4">Role Permissions</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permission
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Administrator
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AP Clerk
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approver
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Finance Manager
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Read Only
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  View Bills & Invoices
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Create/Edit Bills
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Approve Invoices
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Mark Bills as Paid
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  View Analytics
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Manage Users & Roles
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Configure Settings
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-check text-green-500"></i>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  <i className="fas fa-times text-red-500"></i>
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
      case 'users':
        return renderUsers();
      case 'roles':
        return renderRoles();
      case 'access_control':
        return renderAccessControl();
      default:
        return renderUsers();
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}

export default Permissions;
