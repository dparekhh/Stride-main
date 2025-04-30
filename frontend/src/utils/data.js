
// src/utils/data.js
export const sampleBillsData = [
  {
    id: "A1",
    tenant_id: 1,
    vendor: "ABC Technologies",
    status: "Pending",
    amount: "₹100,000.00",
    invoiceDate: "16/05/2023",
    vendorOwner: "Rahul Sharma",
    paymentDate: "25/06/2023",
    dueDate: "16/06/2023",
    paymentStatus: "Unpaid",
    paymentMethod: "Bank Transfer",
    approvalStatus: "Awaiting Approval",
    category: "Software",
    invoiceNumber: "INV12345",
    poNumber: "PO2023001",
    isRecurring: true,
    department: "Engineering"
  },
  {
    id: "B2",
    tenant_id: 1,
    vendor: "XYZ Services",
    status: "Draft",
    amount: "₹50,550.00",
    invoiceDate: "30/06/2023",
    vendorOwner: "Priya Patel",
    paymentDate: "N/A",
    dueDate: "30/07/2023",
    paymentStatus: "Not Started",
    paymentMethod: "Pending",
    approvalStatus: "Draft",
    category: "Consulting",
    invoiceNumber: "INV23456",
    poNumber: "PO2023042",
    isRecurring: false,
    department: "Marketing"
  },
  {
    id: "C3",
    tenant_id: 1,
    vendor: "Global Supplies",
    status: "For Approval",
    amount: "₹120,000.00",
    invoiceDate: "25/07/2023",
    vendorOwner: "Vikram Singh",
    paymentDate: "N/A",
    dueDate: "25/08/2023",
    paymentStatus: "Scheduled",
    paymentMethod: "ACH",
    approvalStatus: "In Review",
    category: "Office Supplies",
    invoiceNumber: "INV34567",
    poNumber: "PO2023098",
    isRecurring: true,
    department: "Operations"
  },
  {
    id: "D4",
    tenant_id: 2,
    vendor: "Tech Innovators",
    status: "Approved",
    amount: "₹75,000.00",
    invoiceDate: "10/06/2023",
    vendorOwner: "Ananya Mehta",
    paymentDate: "15/07/2023",
    dueDate: "10/07/2023",
    paymentStatus: "Paid",
    paymentMethod: "Bank Transfer",
    approvalStatus: "Approved",
    category: "Technology",
    invoiceNumber: "INV45678",
    poNumber: "PO2023115",
    isRecurring: false,
    department: "IT"
  }
];

export const sampleAPClerks = [
  {
    id: "DP",
    tenant_id: 1,
    name: "Dev Parekh",
    location: "Sales, Mumbai",
    initials: "DP",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800"
  },
  {
    id: "PS",
    tenant_id: 1,
    name: "Pratik Save",
    location: "Tech, Bangalore",
    initials: "PS",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800"
  },
  {
    id: "AM",
    tenant_id: 2,
    name: "Amita Malhotra",
    location: "Finance, Delhi",
    initials: "AM",
    bgColor: "bg-green-100",
    textColor: "text-green-800"
  }
];
