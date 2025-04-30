/**
 * Employee Data Management Module
 * 
 * This module centralizes all employee data and related operations to ensure consistency 
 * across the application. It provides a structured data format and utility functions
 * for working with employee data.
 * 
 * @version 1.0.0
 * @module employeeData
 */

// Enums for employee data

/**
 * Employee status options
 * @enum {string}
 */
export const EmployeeStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  INVITED: 'invited',
  TERMINATED: 'terminated'
};

/**
 * Employee role options
 * @enum {string}
 */
export const EmployeeRole = {
  ADMINISTRATOR: 'administrator',
  FINANCE_MANAGER: 'finance_manager',
  AP_CLERK: 'ap_clerk', 
  APPROVER: 'approver',
  EMPLOYEE: 'employee',
  READ_ONLY: 'read_only'
};

/**
 * Permission types available in the system
 * @enum {string}
 */
export const PermissionType = {
  VIEW_BILLS: 'view_bills',
  CREATE_BILLS: 'create_bills',
  APPROVE_BILLS: 'approve_bills',
  MANAGE_VENDORS: 'manage_vendors',
  MANAGE_CARDS: 'manage_cards',
  ISSUE_CARDS: 'issue_cards',
  VIEW_REPORTS: 'view_reports',
  MANAGE_EMPLOYEES: 'manage_employees',
  MANAGE_SETTINGS: 'manage_settings'
};

/**
 * Card status options
 * @enum {string}
 */
export const CardStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  BLOCKED: 'blocked',
  EXPIRED: 'expired'
};

// Default permissions by role
const rolePermissionsMap = {
  [EmployeeRole.ADMINISTRATOR]: [
    PermissionType.VIEW_BILLS, PermissionType.CREATE_BILLS, PermissionType.APPROVE_BILLS,
    PermissionType.MANAGE_VENDORS, PermissionType.MANAGE_CARDS, PermissionType.ISSUE_CARDS,
    PermissionType.VIEW_REPORTS, PermissionType.MANAGE_EMPLOYEES, PermissionType.MANAGE_SETTINGS
  ],
  [EmployeeRole.FINANCE_MANAGER]: [
    PermissionType.VIEW_BILLS, PermissionType.CREATE_BILLS, PermissionType.APPROVE_BILLS,
    PermissionType.MANAGE_VENDORS, PermissionType.MANAGE_CARDS, PermissionType.ISSUE_CARDS,
    PermissionType.VIEW_REPORTS
  ],
  [EmployeeRole.AP_CLERK]: [
    PermissionType.VIEW_BILLS, PermissionType.CREATE_BILLS, PermissionType.MANAGE_VENDORS
  ],
  [EmployeeRole.APPROVER]: [
    PermissionType.VIEW_BILLS, PermissionType.APPROVE_BILLS, PermissionType.VIEW_REPORTS
  ],
  [EmployeeRole.EMPLOYEE]: [
    PermissionType.VIEW_BILLS
  ],
  [EmployeeRole.READ_ONLY]: [
    PermissionType.VIEW_BILLS, PermissionType.VIEW_REPORTS
  ]
};

/**
 * Comprehensive employee data structure that includes all fields needed across components
 * @typedef {Object} Employee
 * @property {number} id - Unique identifier for the employee
 * @property {number} tenant_id - Multi-tenant identifier
 * @property {string} firstName - Employee's first name
 * @property {string} lastName - Employee's last name
 * @property {string} email - Employee's email address
 * @property {string} department - Employee's department
 * @property {string} location - Employee's location
 * @property {EmployeeRole} role - Employee's role in the system
 * @property {Array<PermissionType>} permissions - List of employee permissions
 * @property {CardStatus|null} cardStatus - Status of employee's card if any
 * @property {Object|null} spendLimits - Employee's spending limits
 * @property {number|null} reportingManagerId - ID of employee's manager
 * @property {Array<number>} teamMemberIds - IDs of team members reporting to this employee
 * @property {EmployeeStatus} status - Current status of the employee
 * @property {string|null} lastActive - Timestamp of last activity
 * @property {boolean} hasPhysicalCard - Whether employee has a physical card
 * @property {boolean} hasVirtualCard - Whether employee has any virtual cards
 * @property {string} avatar - Employee's initials for avatar display
 */

/**
 * List of employees with comprehensive data structure
 * @type {Array<Employee>}
 */
export const employees = [
  { 
    id: 1, 
    tenant_id: 1, 
    firstName: "Amit", 
    lastName: "Sharma", 
    email: "amit.sharma@teknetworks.in",
    department: "Finance", 
    location: "Mumbai", 
    role: EmployeeRole.FINANCE_MANAGER,
    permissions: rolePermissionsMap[EmployeeRole.FINANCE_MANAGER],
    cardStatus: CardStatus.ACTIVE,
    spendLimits: { amount: 50000, frequency: "monthly", currency: "INR" },
    reportingManagerId: null,
    teamMemberIds: [2, 3, 4],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-29T15:30:00Z",
    hasPhysicalCard: true,
    hasVirtualCard: true,
    avatar: "AS"
  },
  { 
    id: 2, 
    tenant_id: 1, 
    firstName: "Priya", 
    lastName: "Mehta", 
    email: "priya.mehta@teknetworks.in",
    department: "HR", 
    location: "Bangalore", 
    role: EmployeeRole.ADMINISTRATOR,
    permissions: rolePermissionsMap[EmployeeRole.ADMINISTRATOR],
    cardStatus: CardStatus.ACTIVE,
    spendLimits: { amount: 25000, frequency: "monthly", currency: "INR" },
    reportingManagerId: 1,
    teamMemberIds: [6, 7],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-30T10:45:00Z",
    hasPhysicalCard: true,
    hasVirtualCard: true,
    avatar: "PM"
  },
  { 
    id: 3, 
    tenant_id: 1, 
    firstName: "Rajesh", 
    lastName: "Patel", 
    email: "rajesh.patel@teknetworks.in",
    department: "Support", 
    location: "Delhi", 
    role: EmployeeRole.AP_CLERK,
    permissions: rolePermissionsMap[EmployeeRole.AP_CLERK],
    cardStatus: CardStatus.ACTIVE,
    spendLimits: { amount: 10000, frequency: "monthly", currency: "INR" },
    reportingManagerId: 1,
    teamMemberIds: [],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-30T08:15:00Z",
    hasPhysicalCard: false,
    hasVirtualCard: true,
    avatar: "RP"
  },
  { 
    id: 4, 
    tenant_id: 1, 
    firstName: "Sneha", 
    lastName: "Iyer", 
    email: "sneha.iyer@teknetworks.in",
    department: "Audit", 
    location: "Chennai", 
    role: EmployeeRole.APPROVER,
    permissions: rolePermissionsMap[EmployeeRole.APPROVER],
    cardStatus: null,
    spendLimits: null,
    reportingManagerId: 1,
    teamMemberIds: [],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-28T14:20:00Z",
    hasPhysicalCard: false,
    hasVirtualCard: false,
    avatar: "SI"
  },
  { 
    id: 5, 
    tenant_id: 1, 
    firstName: "Vikram", 
    lastName: "Reddy", 
    email: "vikram.reddy@teknetworks.in",
    department: "Sales", 
    location: "Hyderabad", 
    role: EmployeeRole.EMPLOYEE,
    permissions: rolePermissionsMap[EmployeeRole.EMPLOYEE],
    cardStatus: CardStatus.PENDING,
    spendLimits: { amount: 5000, frequency: "monthly", currency: "INR" },
    reportingManagerId: 8,
    teamMemberIds: [],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-25T09:30:00Z",
    hasPhysicalCard: false,
    hasVirtualCard: false,
    avatar: "VR"
  },
  { 
    id: 6, 
    tenant_id: 1, 
    firstName: "Neha", 
    lastName: "Joshi", 
    email: "neha.joshi@teknetworks.in",
    department: "Marketing", 
    location: "Pune", 
    role: EmployeeRole.EMPLOYEE,
    permissions: rolePermissionsMap[EmployeeRole.EMPLOYEE],
    cardStatus: CardStatus.ACTIVE,
    spendLimits: { amount: 15000, frequency: "monthly", currency: "INR" },
    reportingManagerId: 2,
    teamMemberIds: [],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-30T11:10:00Z",
    hasPhysicalCard: true,
    hasVirtualCard: true,
    avatar: "NJ"
  },
  { 
    id: 7, 
    tenant_id: 1, 
    firstName: "Karthik", 
    lastName: "Venkatesh", 
    email: "karthik.v@teknetworks.in",
    department: "HR", 
    location: "Bangalore", 
    role: EmployeeRole.EMPLOYEE,
    permissions: rolePermissionsMap[EmployeeRole.EMPLOYEE],
    cardStatus: CardStatus.INACTIVE,
    spendLimits: { amount: 5000, frequency: "monthly", currency: "INR" },
    reportingManagerId: 2,
    teamMemberIds: [],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-29T13:45:00Z",
    hasPhysicalCard: false,
    hasVirtualCard: true,
    avatar: "KV"
  },
  { 
    id: 8, 
    tenant_id: 1, 
    firstName: "Tara", 
    lastName: "Singh", 
    email: "tara.singh@teknetworks.in",
    department: "Sales", 
    location: "Hyderabad", 
    role: EmployeeRole.APPROVER,
    permissions: rolePermissionsMap[EmployeeRole.APPROVER],
    cardStatus: CardStatus.ACTIVE,
    spendLimits: { amount: 20000, frequency: "monthly", currency: "INR" },
    reportingManagerId: null,
    teamMemberIds: [5, 9],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-30T09:20:00Z",
    hasPhysicalCard: true,
    hasVirtualCard: true,
    avatar: "TS"
  },
  { 
    id: 9, 
    tenant_id: 1, 
    firstName: "Arun", 
    lastName: "Kumar", 
    email: "arun.kumar@teknetworks.in",
    department: "Sales", 
    location: "Mumbai", 
    role: EmployeeRole.EMPLOYEE,
    permissions: rolePermissionsMap[EmployeeRole.EMPLOYEE],
    cardStatus: CardStatus.ACTIVE,
    spendLimits: { amount: 7500, frequency: "monthly", currency: "INR" },
    reportingManagerId: 8,
    teamMemberIds: [],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-28T16:05:00Z",
    hasPhysicalCard: false,
    hasVirtualCard: true,
    avatar: "AK"
  },
  { 
    id: 10, 
    tenant_id: 1, 
    firstName: "Kavita", 
    lastName: "Desai", 
    email: "kavita.d@teknetworks.in",
    department: "Finance", 
    location: "Mumbai", 
    role: EmployeeRole.AP_CLERK,
    permissions: rolePermissionsMap[EmployeeRole.AP_CLERK],
    cardStatus: null,
    spendLimits: null,
    reportingManagerId: 1,
    teamMemberIds: [],
    status: EmployeeStatus.INVITED,
    lastActive: null,
    hasPhysicalCard: false,
    hasVirtualCard: false,
    avatar: "KD"
  },
  
  // Tenant 2 employees
  { 
    id: 11, 
    tenant_id: 2, 
    firstName: "Arjun", 
    lastName: "Verma", 
    email: "arjun.verma@cloudaxis.co.in",
    department: "Engineering", 
    location: "Noida", 
    role: EmployeeRole.ADMINISTRATOR,
    permissions: rolePermissionsMap[EmployeeRole.ADMINISTRATOR],
    cardStatus: CardStatus.ACTIVE,
    spendLimits: { amount: 30000, frequency: "monthly", currency: "INR" },
    reportingManagerId: null,
    teamMemberIds: [12, 13],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-30T15:45:00Z",
    hasPhysicalCard: false,
    hasVirtualCard: true,
    avatar: "AV"
  },
  { 
    id: 12, 
    tenant_id: 2, 
    firstName: "Ananya", 
    lastName: "Ghosh", 
    email: "ananya.ghosh@cloudaxis.co.in",
    department: "Product", 
    location: "Kolkata", 
    role: EmployeeRole.FINANCE_MANAGER,
    permissions: rolePermissionsMap[EmployeeRole.FINANCE_MANAGER],
    cardStatus: CardStatus.ACTIVE,
    spendLimits: { amount: 25000, frequency: "monthly", currency: "INR" },
    reportingManagerId: 11,
    teamMemberIds: [14],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-29T11:30:00Z",
    hasPhysicalCard: true,
    hasVirtualCard: true,
    avatar: "AG"
  },
  { 
    id: 13, 
    tenant_id: 2, 
    firstName: "Rohan", 
    lastName: "Kapoor", 
    email: "rohan.kapoor@cloudaxis.co.in",
    department: "Operations", 
    location: "Ahmedabad", 
    role: EmployeeRole.APPROVER,
    permissions: rolePermissionsMap[EmployeeRole.APPROVER],
    cardStatus: CardStatus.ACTIVE,
    spendLimits: { amount: 15000, frequency: "monthly", currency: "INR" },
    reportingManagerId: 11,
    teamMemberIds: [15],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-30T10:15:00Z",
    hasPhysicalCard: true,
    hasVirtualCard: true,
    avatar: "RK"
  },
  { 
    id: 14, 
    tenant_id: 2, 
    firstName: "Kiran", 
    lastName: "Nair", 
    email: "kiran.nair@cloudaxis.co.in",
    department: "Legal", 
    location: "Chandigarh", 
    role: EmployeeRole.AP_CLERK,
    permissions: rolePermissionsMap[EmployeeRole.AP_CLERK],
    cardStatus: CardStatus.ACTIVE,
    spendLimits: { amount: 10000, frequency: "monthly", currency: "INR" },
    reportingManagerId: 12,
    teamMemberIds: [],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-28T09:20:00Z",
    hasPhysicalCard: false,
    hasVirtualCard: true,
    avatar: "KN"
  },
  { 
    id: 15, 
    tenant_id: 2, 
    firstName: "Divya", 
    lastName: "Menon", 
    email: "divya.menon@cloudaxis.co.in",
    department: "Operations", 
    location: "Ahmedabad", 
    role: EmployeeRole.EMPLOYEE,
    permissions: rolePermissionsMap[EmployeeRole.EMPLOYEE],
    cardStatus: CardStatus.PENDING,
    spendLimits: { amount: 5000, frequency: "monthly", currency: "INR" },
    reportingManagerId: 13,
    teamMemberIds: [],
    status: EmployeeStatus.ACTIVE,
    lastActive: "2025-03-25T14:40:00Z",
    hasPhysicalCard: false,
    hasVirtualCard: false,
    avatar: "DM"
  }
];

/**
 * Utility function to filter employees by department
 * @param {Array<Employee>} employeeList - List of employees to filter
 * @param {string} department - Department to filter by
 * @param {number} [tenantId] - Optional tenant ID to filter by
 * @returns {Array<Employee>} Filtered employees
 */
export const filterByDepartment = (employeeList, department, tenantId) => {
  let filtered = employeeList.filter(emp => emp.department === department);
  if (tenantId !== undefined) {
    filtered = filtered.filter(emp => emp.tenant_id === tenantId);
  }
  return filtered;
};

/**
 * Utility function to filter employees by location
 * @param {Array<Employee>} employeeList - List of employees to filter
 * @param {string} location - Location to filter by
 * @param {number} [tenantId] - Optional tenant ID to filter by
 * @returns {Array<Employee>} Filtered employees
 */
export const filterByLocation = (employeeList, location, tenantId) => {
  let filtered = employeeList.filter(emp => emp.location === location);
  if (tenantId !== undefined) {
    filtered = filtered.filter(emp => emp.tenant_id === tenantId);
  }
  return filtered;
};

/**
 * Utility function to get an employee by ID
 * @param {Array<Employee>} employeeList - List of employees to search
 * @param {number} id - Employee ID to find
 * @returns {Employee|null} The found employee or null
 */
export const getEmployeeById = (employeeList, id) => {
  return employeeList.find(emp => emp.id === id) || null;
};

/**
 * Utility function to get an employee's team members
 * @param {Array<Employee>} employeeList - List of all employees
 * @param {number} managerId - ID of the manager
 * @returns {Array<Employee>} List of team members
 */
export const getTeamMembers = (employeeList, managerId) => {
  return employeeList.filter(emp => emp.reportingManagerId === managerId);
};

/**
 * Utility function to check if an employee has a specific permission
 * @param {Employee} employee - The employee to check
 * @param {PermissionType} permission - The permission to check for
 * @returns {boolean} True if the employee has the permission
 */
export const hasPermission = (employee, permission) => {
  return employee.permissions.includes(permission);
};

/**
 * Utility function to filter employees by status
 * @param {Array<Employee>} employeeList - List of employees to filter
 * @param {EmployeeStatus} status - Status to filter by
 * @param {number} [tenantId] - Optional tenant ID to filter by
 * @returns {Array<Employee>} Filtered employees
 */
export const filterByStatus = (employeeList, status, tenantId) => {
  let filtered = employeeList.filter(emp => emp.status === status);
  if (tenantId !== undefined) {
    filtered = filtered.filter(emp => emp.tenant_id === tenantId);
  }
  return filtered;
};

/**
 * Utility function to filter employees by role
 * @param {Array<Employee>} employeeList - List of employees to filter
 * @param {EmployeeRole} role - Role to filter by
 * @param {number} [tenantId] - Optional tenant ID to filter by
 * @returns {Array<Employee>} Filtered employees
 */
export const filterByRole = (employeeList, role, tenantId) => {
  let filtered = employeeList.filter(emp => emp.role === role);
  if (tenantId !== undefined) {
    filtered = filtered.filter(emp => emp.tenant_id === tenantId);
  }
  return filtered;
};

/**
 * Utility function to get employees with specific card status
 * @param {Array<Employee>} employeeList - List of employees to filter
 * @param {CardStatus} cardStatus - Card status to filter by
 * @returns {Array<Employee>} Filtered employees
 */
export const filterByCardStatus = (employeeList, cardStatus) => {
  return employeeList.filter(emp => emp.cardStatus === cardStatus);
};

/**
 * Get an employee's full name
 * @param {Employee} employee - The employee
 * @returns {string} Full name
 */
export const getFullName = (employee) => {
  return `${employee.firstName} ${employee.lastName}`;
};