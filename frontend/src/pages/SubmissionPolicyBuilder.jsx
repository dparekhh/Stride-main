import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Settings, 
  History, 
  PlayCircle, 
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkflowBuilder from '../components/common/action-buttons/WorkflowBuilder';
import ExpenseTypeSelector from '../components/common/action-buttons/WorkflowBuilder/ExpenseTypeSelector';
// Removed dependency on useWorkflowState in favor of internal state management

const SubmissionPolicyBuilder = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('build');
  const [autoLockCards, setAutoLockCards] = useState(false);
  const [expenseType, setExpenseType] = useState('Select');
  const [showConditionBlock, setShowConditionBlock] = useState(true);
  
  // No longer need external workflow state - using recommended internal state approach
  
  // Handle navigation back to policy page
  const handleBack = () => {
    navigate('/policy');
  };
  
  // Handle expense type selection
  const handleExpenseTypeSelect = (type) => {
    setExpenseType(type);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Config Popup is now handled by the WorkflowBuilder component */}
      
      {/* Header section */}
      <div className="flex items-center mb-8">
        <button 
          onClick={handleBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Back to policy"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Submission Policy</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left section - Workflow Builder (75%) */}
        <div className="w-full md:w-3/4 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">Workflow Builder</h2>
          
          {/* Using the WorkflowBuilder with recommended internal state management */}
          {showConditionBlock ? (
            <div className="workflow-container">
              <WorkflowBuilder
                useInternalState={true}
                customOptions={{
                  'add-required-fields': ['Receipts', 'Memos', 'Mileage reimbursement locations', 'Accounting fields'],
                  'add-optional-fields': ['Receipts', 'Memos', 'Mileage reimbursement locations', 'Accounting fields']
                }}
                triggerText="When"
                triggerHighlight="Submitting policy"
                showEndPoint={true}
                endPointText="Approve"
                endPointHighlight="Expense"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <button 
                onClick={() => setShowConditionBlock(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add Workflow
              </button>
            </div>
          )}
        </div>
        
        {/* Right section - Tabs and Additional Settings (25%) */}
        <div className="w-full md:w-1/4">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'build' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('build')}
            >
              Build
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>
          
          {/* Tab content */}
          <div className="mb-8">
            {activeTab === 'build' ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Build your submission policy workflow by adding conditions and actions.
                </p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center">
                  <PlayCircle size={16} className="mr-2" />
                  Run Workflow
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">
                  No workflow history available yet.
                </p>
              </div>
            )}
          </div>
          
          {/* Additional Settings */}
          <div>
            <h3 className="text-lg font-medium flex items-center mb-4">
              <Settings size={16} className="mr-2" />
              Additional Settings
            </h3>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium mb-1">Auto-lock cards with missing items</h4>
                  <p className="text-sm text-gray-600">
                    Automatically lock cards with outstanding submission requirements.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoLockCards} 
                    onChange={() => setAutoLockCards(!autoLockCards)} 
                    className="sr-only peer"
                  />
                  <div className={`w-10 h-5 rounded-full peer ${autoLockCards ? 'bg-blue-600' : 'bg-gray-300'} 
                    peer-checked:after:translate-x-full peer-checked:after:border-white 
                    after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white 
                    after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPolicyBuilder;