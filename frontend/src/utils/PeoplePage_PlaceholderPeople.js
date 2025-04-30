
/**
 * PeoplePage_PlaceholderPeople.js
 * 
 * Mock data for the People page.
 * Includes placeholder people data with consistent structure
 * All data follows Indian context for departments, locations, and naming
 */

import roles from './PeoplePage_Role';

// Indian cities commonly used as business locations
export const locations = [
  'Bengaluru',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh'
];

// Common business departments
export const departments = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'Human Resources',
  'Operations',
  'Customer Support',
  'Administration',
  'Legal'
];

// Mock people data with Indian context
export const people = [
  {
    id: 1,
    name: 'Arjun Sharma',
    email: 'arjun.sharma@stride.com',
    hasCard: true,
    role: 'Employee',
    department: 'Engineering',
    location: 'Bengaluru',
    manager: 'Priya Patel'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@stride.com',
    hasCard: true,
    role: 'Manager',
    department: 'Engineering',
    location: 'Bengaluru',
    manager: 'Vikram Mehta'
  },
  {
    id: 3,
    name: 'Vikram Mehta',
    email: 'vikram.mehta@stride.com',
    hasCard: true,
    role: 'Admin',
    department: 'IT',
    location: 'Delhi',
    manager: 'Neha Sharma'
  },
  {
    id: 4,
    name: 'Neha Sharma',
    email: 'neha.sharma@stride.com',
    hasCard: true,
    role: 'Manager',
    department: 'Sales',
    location: 'Mumbai',
    manager: 'Amit Kumar'
  },
  {
    id: 5,
    name: 'Rohan Mehta',
    email: 'rohan.mehta@stride.com',
    hasCard: true,
    role: 'Admin',
    department: 'Executive',
    location: 'Mumbai',
    manager: 'Amit Kumar'
  },
  {
    id: 6,
    name: 'Ananya Gupta',
    email: 'ananya.gupta@stride.com',
    hasCard: false,
    role: 'Employee',
    department: 'Marketing',
    location: 'Bengaluru',
    manager: 'Neha Sharma'
  },
  {
    id: 7,
    name: 'Aditya Singh',
    email: 'aditya.singh@stride.com',
    hasCard: false,
    role: 'Employee',
    department: 'Finance',
    location: 'Delhi',
    manager: 'Vikram Mehta'
  },
  {
    id: 8,
    name: 'Meera Iyer',
    email: 'meera.iyer@stride.com',
    hasCard: true,
    role: 'Bookkeeper',
    department: 'Finance',
    location: 'Chennai',
    manager: 'Aditya Singh'
  },
  {
    id: 9,
    name: 'Amit Kumar',
    email: 'amit.kumar@stride.com',
    hasCard: true,
    role: 'Admin',
    department: 'Board',
    location: 'Mumbai',
    manager: 'Board of Directors'
  }
];

export default people;
