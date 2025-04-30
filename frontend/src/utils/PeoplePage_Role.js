/**
 * PeoplePage_Role.js
 * 
 * Centralized role definitions for the People page
 * Contains standard role definitions with consistent structure:
 * - id: Unique identifier for the role
 * - name: Display name for the role
 * - description: Detailed description of role permissions and capabilities
 */

// Role definitions with Indian context
const roles = [
  {
    id: "admin",
    name: "Admin",
    description: "Super-users who can invite users, issue cards, set spend limits, create accounting rules, and modify all Stride company settings.",
  },
  {
    id: "it-admin",
    name: "IT admin",
    description: "IT admins can provision users, handle user management, set up and manage integrations and developer settings. They cannot view company spend or manage any spend controls.",
  },
  {
    id: "manager",
    name: "Manager",
    description: "Managers can invite other members of your company under them. They can review their team's spend, approve expenses, and request cards for team members.",
  },
  {
    id: "bookkeeper",
    name: "Bookkeeper",
    description: "Internal employees or assistants who are given access to activity data to help with expenses and accounting. They cannot issue cards or invite others.",
  },
  {
    id: "employee",
    name: "Employee",
    description: "Employees can request or be issued virtual and/or physical cards, as well as submit expenses and reimbursements. They cannot issue cards or invite others.",
  },
  {
    id: "developer-admin",
    name: "Developer admin",
    description: "Developer admins can provision other developer admins, handle user management, and manage developer settings. They cannot view company spend or manage any spend controls.",
  }
];

export default roles;