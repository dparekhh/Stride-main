import React from 'react';
import SearchableDropdown from '../../common/SearchableDropdown';

// Demo employee data structure - using the same structure as VirtualCardDrawer
const EMPLOYEES = [
  { 
    id: 1, 
    name: 'Arjun Sharma',
    email: 'arjun.sharma@stride.com',
    role: 'Software Engineer',
    location: 'Bangalore',
    avatar: 'AS'
  },
  { 
    id: 2, 
    name: 'Priya Patel',
    email: 'priya.patel@stride.com',
    role: 'Product Manager',
    location: 'Mumbai',
    avatar: 'PP'
  },
  { 
    id: 3, 
    name: 'Vikram Singh',
    email: 'vikram.singh@stride.com',
    role: 'Marketing Director',
    location: 'Delhi',
    avatar: 'VS'
  },
  { 
    id: 4, 
    name: 'Neha Gupta',
    email: 'neha.gupta@stride.com',
    role: 'Finance Analyst',
    location: 'Hyderabad',
    avatar: 'NG'
  },
  { 
    id: 5, 
    name: 'Rahul Verma',
    email: 'rahul.verma@stride.com',
    role: 'UX Designer',
    location: 'Pune',
    avatar: 'RV'
  }
];

/**
 * EmployeeDropdown component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSelectEmployee - Function called when an employee is selected
 * @param {Object} props.selectedEmployee - The currently selected employee
 */
const EmployeeDropdown = ({ onSelectEmployee, selectedEmployee }) => {
  
  // Format the employee option display
  const formatEmployeeOption = (employee) => {
    return (
      <div className="flex items-center">
        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium mr-3">
          {employee.avatar}
        </div>
        <div>
          <div className="font-medium">{employee.name}</div>
          <div className="text-xs text-gray-500">{employee.role} • {employee.location}</div>
        </div>
      </div>
    );
  };
  
  // Handle employee selection
  const handleEmployeeChange = (employeeId) => {
    if (employeeId === null) {
      onSelectEmployee(null);
    } else {
      const employee = EMPLOYEES.find(e => e.id === employeeId);
      if (employee) {
        onSelectEmployee(employee);
      }
    }
  };
  
  return (
    <SearchableDropdown
      value={selectedEmployee?.id}
      onChange={handleEmployeeChange}
      options={EMPLOYEES}
      placeholder="Select someone to set it up"
      searchPlaceholder="Search employees..."
      formatOption={formatEmployeeOption}
      displayKey="name"
      valueKey="id"
      id="employee-dropdown"
    />
  );
};

export default EmployeeDropdown;