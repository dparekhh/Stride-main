import React, { useState, useEffect } from 'react';
import { Search, Check, Clock, X, MoreVertical, CreditCard } from 'lucide-react';
import AppDrawer from './common/AppDrawer';

// Helper function to update class names in component
const updateFocusClasses = () => {
  // Find all inputs within the component
  const elements = document.querySelectorAll('#requests-drawer input, #requests-drawer select');
  
  // Update each element's focus classes
  elements.forEach(el => {
    el.classList.remove('focus:ring-primary', 'focus:border-primary');
    el.classList.add('focus:ring-black', 'focus:border-black');
  });
};

/**
 * Requests Drawer Component
 * Displays a list of card requests and their status
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 */
const RequestsDrawer = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Mock request data
  const requests = [
    { 
      id: 1, 
      type: 'Virtual Card', 
      requester: 'Rahul Sharma', 
      date: 'Mar 28, 2025', 
      status: 'approved',
      amount: '₹15,000',
      description: 'Software subscription'
    },
    { 
      id: 2, 
      type: 'Physical Card', 
      requester: 'Priya Patel', 
      date: 'Mar 27, 2025', 
      status: 'pending',
      amount: '₹25,000',
      description: 'Team expenses'
    },
    { 
      id: 3, 
      type: 'Virtual Card', 
      requester: 'Amit Kumar', 
      date: 'Mar 25, 2025', 
      status: 'rejected',
      amount: '₹50,000',
      description: 'Marketing campaign'
    }
  ];
  
  // Update focus styles when the component is mounted
  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        updateFocusClasses();
      }, 100);
    }
  }, [isOpen]);
  
  // Filter requests based on status
  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter);
  
  // Filter further based on search term
  const searchedRequests = searchTerm
    ? filteredRequests.filter(req => 
        req.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredRequests;
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <Check size={14} className="text-green-600 mr-1" />
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock size={14} className="text-yellow-600 mr-1" />
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <X size={14} className="text-red-600 mr-1" />
      }
    };
    
    const config = statusConfig[status];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Card Requests"
      description="View and manage card requests"
      width="md:w-1/2"
    >
      <div id="requests-drawer" className="space-y-4">
        {/* Search and filter controls */}
        <div className="flex items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${filter === 'pending' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${filter === 'approved' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              onClick={() => setFilter('approved')}
            >
              Approved
            </button>
          </div>
        </div>
        
        {/* Request list */}
        <div className="space-y-3">
          {searchedRequests.length > 0 ? (
            searchedRequests.map((request) => (
              <div 
                key={request.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <CreditCard size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{request.type}</h4>
                      <p className="text-sm text-gray-500">{request.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={request.status} />
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <span className="block text-gray-500">Requester</span>
                    <span className="font-medium">{request.requester}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Amount</span>
                    <span className="font-medium">{request.amount}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Date</span>
                    <span className="font-medium">{request.date}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No card requests found</p>
            </div>
          )}
        </div>
      </div>
    </AppDrawer>
  );
};

export default RequestsDrawer;