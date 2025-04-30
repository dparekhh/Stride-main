import React, { useState } from "react";
import { Search, Filter, Calendar, Download, MoreVertical, Plus, X, ChevronDown, Check, Sliders, 
         Users, Building2, MapPin, FolderEdit } from "lucide-react";
import InvitePeopleDrawer from "../components/InvitePeopleDrawer";
import EmployeeDrawer from "../components/EmployeeDrawer";
import EditEmployeeDrawer from "../components/EditEmployeeDrawer";
import { useNavigate } from "react-router-dom";
import PeopleTable from "../components/people/PeopleTable";
import FilterSection from "../components/people/FilterSection";
import ActionHeader from "../components/people/ActionHeader";
import allPeople, { departments, locations } from "../utils/PeoplePage_PlaceholderPeople";
import { PageLayout, PageTable } from "../components/common/page-layout";

/**
 * PeoplePage component - manages people-related data and UI at the page level
 * This page handles state management and data fetching for the people section
 */
const PeoplePage = () => {
  // Page-level state
  const [activeTab, setActiveTab] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [showInviteDrawer, setShowInviteDrawer] = useState(false);
  const navigate = useNavigate();
  
  // Employee-related state
  const [showEmployeeDrawer, setShowEmployeeDrawer] = useState(false);
  const [showEditEmployeeDrawer, setShowEditEmployeeDrawer] = useState(false);
  
  // Custom groups - would be populated from API in real implementation
  const customGroups = [];

  // Tabs configuration
  const tabs = [
    { id: "all", label: "Overview", icon: Users },
  ];

  // Handle action button click to open invite drawer
  const handleActionButtonClick = () => {
    setShowInviteDrawer(true);
  };
  
  // Handle opening employee drawer on row click
  const handleEmployeeClick = () => {
    setShowEmployeeDrawer(true);
  };
  
  // Handle edit employee functionality
  const handleEditEmployee = () => {
    setShowEmployeeDrawer(false);
    setShowEditEmployeeDrawer(true);
  };

  // Get the selected employee data (using the first one as placeholder)
  const selectedEmployee = allPeople[0];

  // Format tabs to match standardized PageLayout component format
  const formattedSubtabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon
  }));

  // Create action buttons for the header
  const actionButtons = [
    // Team updates button (white with border)
    <button
      key="team-updates-button"
      className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center"
    >
      <span className="mr-2">Team updates</span>
      <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">20</span>
    </button>,
    
    // Invite people button (orange/coral)
    <button
      key="invite-people-button"
      className="bg-primary text-white px-4 py-2 rounded-lg flex items-center font-medium"
      onClick={handleActionButtonClick}
    >
      <Plus size={18} className="mr-2" />
      Invite people
    </button>
  ];

  // Define table columns with required properties for filter and column action buttons
  const columns = [
    { id: 'select', label: 'Select', Header: 'Select', accessor: 'select', width: '40px', disableSortBy: true, visible: true, order: 1 },
    { id: 'name', label: 'Name', Header: 'Name', accessor: 'name', width: '250px', visible: true, order: 2 },
    { id: 'card', label: 'Physical card', Header: 'Physical card', accessor: 'card', width: '120px', visible: true, order: 3 },
    { id: 'role', label: 'Role', Header: 'Role', accessor: 'role', width: '150px', visible: true, order: 4 },
    { id: 'department', label: 'Department', Header: 'Department', accessor: 'department', width: '150px', visible: true, order: 5 },
    { id: 'location', label: 'Location', Header: 'Location', accessor: 'location', width: '150px', visible: true, order: 6 },
    { id: 'manager', label: 'Manager', Header: 'Manager', accessor: 'manager', width: '150px', visible: true, order: 7 }
  ];

  // Setup state for search
  const [searchTerm, setSearchTerm] = useState("");
  
  // Define handlers for column visibility and filtering
  const handleColumnVisibilityChange = (columnId, isVisible) => {
    console.log(`Column ${columnId} visibility changed to ${isVisible}`);
    // Update column visibility state would go here in a real implementation
  };

  const handleFilterChange = (columnId, filterValue) => {
    console.log(`Filter for column ${columnId} changed to ${filterValue}`);
    // Apply filter logic here in a real implementation
  };

  // Define default visible columns
  const defaultVisibleColumns = columns.filter(col => col.visible).map(col => col.id);

  return (
    <>
      {/* Invite People Drawer */}
      <InvitePeopleDrawer 
        isOpen={showInviteDrawer} 
        onClose={() => setShowInviteDrawer(false)} 
      />
      
      {/* Employee Drawer */}
      <EmployeeDrawer
        isOpen={showEmployeeDrawer}
        onClose={() => setShowEmployeeDrawer(false)}
        employee={selectedEmployee}
        onEditProfile={handleEditEmployee}
      />
      
      {/* Edit Employee Drawer */}
      <EditEmployeeDrawer
        isOpen={showEditEmployeeDrawer}
        onClose={() => {
          setShowEditEmployeeDrawer(false);
          setShowEmployeeDrawer(false);
        }}
        onBack={() => {
          setShowEditEmployeeDrawer(false);
          setShowEmployeeDrawer(true);
        }}
        employee={selectedEmployee}
      />

      <PageLayout
        pageTitle="Organization"
        heading="People"
        actions={actionButtons}
        subtabs={formattedSubtabs}
        activeSubtab={activeTab}
        onSubtabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showSearchBar={true}
        showActionButtons={true}
        columns={columns}
        defaultVisibleColumns={defaultVisibleColumns}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onFilterChange={handleFilterChange}
      >
        {/* People Table Component */}
        <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-10 px-6 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Physical card
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allPeople.length > 0 ? (
                allPeople.map((person) => (
                  <tr 
                    key={person.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={handleEmployeeClick}
                  >
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          <div className="text-sm text-gray-500">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {person.hasCard ? (
                        <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                          <Check size={14} className="text-green-600" />
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{person.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{person.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.manager}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No people found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              0–0 of 0 employees
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default PeoplePage;