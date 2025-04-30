/**
 * ApproverOptions.js
 * 
 * Centralized approver options for the Workflow Builder
 * Provides a list of possible approvers with their roles
 * Implements a two-level dropdown with back button functionality
 */

import roles from './PeoplePage_Role';
import { people } from './PeoplePage_PlaceholderPeople';

// Generate role-based approver options first
const roleOptions = roles.map(role => ({
  id: `role-${role.id}`,
  name: role.name,
  type: 'role',
  displayValue: `${role.name} Role`,
  level: 'main'
}));

// Generate individual employee options from the placeholder people
const employeeOptions = people.map(person => ({
  id: `emp-${person.id}`,
  name: person.name,
  role: person.role,
  type: 'employee',
  displayValue: `${person.name} (${person.role})`,
  level: 'employee'
}));

// Create the "Add specific employee" option that will trigger the second-level dropdown
const specificEmployeeOption = {
  id: 'specific-employee',
  name: 'Add specific employee as approver',
  type: 'action',
  displayValue: 'Add specific employee as approver',
  level: 'main'
};

// Create the back button option for returning to the main dropdown
const backOption = {
  id: 'back-to-main',
  name: 'Back to roles',
  type: 'back',
  displayValue: 'Back to roles',
  level: 'employee'
};

// Combine main-level options only (roles + specific employee option)
const mainLevelOptions = [
  ...roleOptions,
  specificEmployeeOption
];

// Combine employee-level options (back button + employees)
const employeeLevelOptions = [
  backOption,
  ...employeeOptions
];

// Create the complete set of options with level information
const approverOptions = [
  ...mainLevelOptions,
  ...employeeLevelOptions
];

// Export formatted options for PortalDropdown component
const formattedApproverOptions = approverOptions.map(approver => ({
  value: approver.id,
  label: approver.displayValue,
  type: approver.type,
  level: approver.level
}));

// Format main level options separately for initial display
const formattedMainLevelOptions = mainLevelOptions.map(approver => ({
  value: approver.id,
  label: approver.displayValue,
  type: approver.type,
  level: approver.level
}));

// Format employee level options separately for second-level display
const formattedEmployeeLevelOptions = employeeLevelOptions.map(approver => ({
  value: approver.id,
  label: approver.displayValue,
  type: approver.type,
  level: approver.level
}));

export default formattedApproverOptions;

// Export all option sets for reference and use
export { 
  approverOptions,
  formattedMainLevelOptions,
  formattedEmployeeLevelOptions
};