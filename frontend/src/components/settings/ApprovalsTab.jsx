
import React from "react";
import { Edit } from "lucide-react";

const ApprovalsTab = () => {
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-6">Bill Approvals</h3>
      <div className="flex flex-col">
        {/* First step - When a bill is created */}
        <div className="flex mb-10">
          <div className="flex flex-col items-center mr-6">
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center"></div>
            <div className="w-0.5 h-16 bg-gray-300 mt-1"></div>
          </div>
          <div className="flex items-center mt-1">
            <span className="mr-3 text-gray-700">When a</span>
            <span className="bg-green-100 px-4 py-1.5 rounded text-gray-800">Bill is created</span>
            <button className="ml-3 text-gray-400 hover:text-gray-600">
              <Edit size={18} />
            </button>
          </div>
        </div>
        {/* Second step - Require approver */}
        <div className="flex mb-10">
          <div className="flex flex-col items-center mr-6">
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center"></div>
            <div className="w-0.5 h-16 bg-gray-300 mt-1"></div>
          </div>
          <div className="flex items-center mt-1">
            <span className="mr-3 text-gray-700">Require</span>
            <button className="bg-red-200 px-4 py-1.5 rounded text-gray-800">Add Approver</button>
            <span className="mx-3 text-gray-700">or</span>
            <button className="bg-red-200 px-4 py-1.5 rounded text-gray-800">Add Approver</button>
          </div>
        </div>
        {/* Condition step - Amount */}
        <div className="flex mb-6">
          <div className="flex flex-col items-center mr-6">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" stroke="black" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3L5 21M21 12H3M5 3L19 21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="w-0.5 h-40 bg-gray-300 mt-1"></div>
          </div>
          <div className="mt-1">
            <div className="flex items-center">
              <span className="mr-3 text-gray-700">If</span>
              <button className="bg-gray-200 px-4 py-1.5 rounded text-gray-800">Amount</button>
              <span className="mx-3 text-gray-700">is greater than or equal to</span>
              <button className="bg-gray-200 px-4 py-1.5 rounded text-gray-800">Add Amount</button>
            </div>
            {/* Nested approvers - with proper indentation */}
            <div className="flex mt-10 ml-2">
              <div className="flex flex-col items-center mr-6">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center"></div>
                <div className="w-0.5 h-16 bg-gray-300 mt-1"></div>
              </div>
              <div className="flex items-center mt-1">
                <span className="mr-3 text-gray-700">Require</span>
                <button className="bg-red-200 px-4 py-1.5 rounded text-gray-800">Add Approver</button>
                <span className="mx-3 text-gray-700">or</span>
                <button className="bg-red-200 px-4 py-1.5 rounded text-gray-800">Add Approver</button>
              </div>
            </div>
            {/* Nested notify */}
            <div className="flex mt-2 ml-2">
              <div className="flex flex-col items-center mr-6">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center"></div>
              </div>
              <div className="flex items-center mt-1">
                <span className="mr-3 text-gray-700">Notify</span>
                <button className="bg-red-200 px-4 py-1.5 rounded text-gray-800">Add Approver</button>
              </div>
            </div>
          </div>
        </div>
        {/* Department condition */}
        <div className="flex mb-10">
          <div className="flex flex-col items-center mr-6">
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center"></div>
            <div className="w-0.5 h-16 bg-gray-300 mt-1"></div>
          </div>
          <div className="flex items-center mt-1">
            <span className="mr-3 text-gray-700">Require</span>
            <button className="bg-red-200 px-4 py-1.5 rounded text-gray-800">Add Approver</button>
            <span className="mx-3 text-gray-700">or</span>
            <button className="bg-red-200 px-4 py-1.5 rounded text-gray-800">Add Approver</button>
          </div>
        </div>
        {/* Final approval step */}
        <div className="flex">
          <div className="flex flex-col items-center mr-6">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-gray-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-1">
            <span className="mr-3 text-gray-700">Approve</span>
            <span className="bg-green-100 px-4 py-1.5 rounded text-gray-800">Bill</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalsTab;
