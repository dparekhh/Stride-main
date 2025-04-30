import React from "react";
import { Check } from "lucide-react";

/**
 * PeopleTable component - Displays a table of people with sortable columns
 * This is a presentational component that receives data and callbacks from the parent
 */
const PeopleTable = ({ people = [], onPersonClick }) => {
  if (!people || people.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          No people found. Add people to your organization to see them here.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="w-10 px-6 py-3 text-left">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Physical card
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Manager
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {people.map((person) => (
            <tr 
              key={person.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onPersonClick && onPersonClick(person)}
            >
              <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {person.hasCard ? (
                  <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                    <Check size={14} className="text-green-600" />
                  </div>
                ) : (
                  <span>—</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{person.role}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{person.department}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{person.location}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{person.manager}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {people.length > 0 ? `1–${people.length} of ${people.length} employees` : '0–0 of 0 employees'}
        </div>
      </div>
    </div>
  );
};

export default PeopleTable;