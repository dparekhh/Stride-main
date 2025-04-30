import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MoreVertical, 
  Filter, 
  BarChart, 
  Settings, 
  Upload, 
  PenLine, 
  FileText, 
  Table, 
  Plus, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Edit,
  Users
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { useNotification } from "../contexts/NotificationContext";

/**
 * VendorManager component for managing vendors in the Bill Pay section
 * Handles vendor listing, search, filtering, and new vendor creation 
 */
const VendorManager = ({ 
  vendors = [], 
  loading, 
  error, 
  onRefresh, 
  searchTerm, 
  setSearchTerm, 
  setSelectedVendor,
  onSettingsOpen,
  activeSubtab = 'overview'
}) => {
  // New vendor dropdown state and functionality removed
  // Only keeping the necessary reference for rendering
  const newVendorMenuRef = useRef(null);
  
  // React Router navigate hook
  const navigate = useNavigate();
  
  // Get notification context
  const { showSuccess, showError, showInfo } = useNotification();

  // New vendor menu functionality has been disabled as per requirements

  // Event listener for toggleNewVendorMenu has been removed
  // This functionality is disabled as per requirements

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle status change for a vendor
  const handleStatusChange = (vendorId, newStatus) => {
    // In a real app, this would update the vendor status in the backend
    showInfo(`Vendor status updated to: ${newStatus}`);
  };
  
  // Handle vendor owner change
  const handleOwnerChange = (vendorId, newOwner) => {
    // In a real app, this would update the vendor owner in the backend
    showInfo(`Vendor owner updated to: ${newOwner}`);
  };

  // Filter vendors based on search term
  const filteredVendors = useMemo(() => {
    if (!searchTerm) return vendors;
    
    const lowerSearch = searchTerm.toLowerCase();
    return vendors.filter(vendor => 
      vendor.name.toLowerCase().includes(lowerSearch) ||
      vendor.department.toLowerCase().includes(lowerSearch) ||
      vendor.location.toLowerCase().includes(lowerSearch) ||
      vendor.owner.toLowerCase().includes(lowerSearch)
    );
  }, [vendors, searchTerm]);

  return (
    <div className="space-y-6">

      {/* No custom search bar - using standardized search from PageLayout */}

      {/* Vendors table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Show appropriate state based on loading, error, and data */}
        {loading ? (
          <div className="py-10 text-center">
            <LoadingSpinner size="large" className="mb-3 mx-auto" />
            <p>Loading vendors...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-center">
            <AlertCircle className="mx-auto mb-2" size={32} />
            <p>{error}</p>
            <button onClick={onRefresh} className="mt-3 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md">
              Try Again
            </button>
          </div>
        ) : !filteredVendors || filteredVendors.length === 0 ? (
          <div className="py-10 text-center">
            <Users className="text-gray-300 mx-auto mb-3" size={48} />
            <p className="text-gray-500">No vendors found</p>
            <p className="text-sm text-gray-400 mt-1">Contact your administrator to add new vendors</p>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)]">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-[40px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  </th>
                  <th className="w-[180px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="w-[150px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Owner
                  </th>
                  <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spend
                  </th>
                  <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spend (30 days)
                  </th>
                  <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax
                  </th>
                  <th className="w-[180px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Period
                  </th>
                  <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Term. Date
                  </th>
                  <th className="w-[120px] px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-sm font-medium">
                            {vendor.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="truncate">
                          <div className="text-sm font-medium text-gray-900 truncate">{vendor.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 relative group truncate">
                        <div className="flex items-center">
                          <span className="truncate">{vendor.owner}</span>
                          <Edit size={14} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer flex-shrink-0" 
                            onClick={() => {
                              // Placeholder for editable owner field
                              const newOwner = prompt("Enter new owner name:", vendor.owner);
                              if (newOwner && newOwner !== vendor.owner) {
                                handleOwnerChange(vendor.id, newOwner);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 truncate">{formatCurrency(vendor.totalSpend)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 truncate">{formatCurrency(vendor.recentSpend)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 truncate">{vendor.department}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 truncate">{vendor.location}</div>
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        className={`text-sm rounded-full px-2 py-1 border ${
                          vendor.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 
                          'bg-red-50 text-red-700 border-red-100'
                        }`}
                        value={vendor.status}
                        onChange={(e) => handleStatusChange(vendor.id, e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      {vendor.status === 'inactive' && (
                        <div className="mt-1 text-xs text-red-500">
                          Warning: Inactive
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 truncate">{vendor.tax}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 truncate">
                        {formatDate(vendor.contractStart)} - {formatDate(vendor.contractEnd)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 truncate">{formatDate(vendor.terminationDate)}</div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary-dark mr-3">
                        Edit
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorManager;