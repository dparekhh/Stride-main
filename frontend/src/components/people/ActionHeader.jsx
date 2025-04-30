import React from "react";
import { Plus } from "lucide-react";

/**
 * ActionHeader component - Displays action buttons for the people page
 * This is a presentational component that receives callbacks from the parent
 */
const ActionHeader = ({ onInvitePeople, teamUpdatesCount = 0 }) => {
  return (
    <div className="flex items-center justify-between h-10 mb-6">
      <h1 className="text-2xl font-bold">People</h1>
      <div className="flex space-x-3">
        {teamUpdatesCount > 0 && (
          <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center">
            <span className="mr-2">Team updates</span>
            <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
              {teamUpdatesCount}
            </span>
          </button>
        )}
        <button 
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center font-medium"
          onClick={onInvitePeople}
        >
          <Plus size={18} className="mr-2" />
          Invite people
        </button>
      </div>
    </div>
  );
};

export default ActionHeader;