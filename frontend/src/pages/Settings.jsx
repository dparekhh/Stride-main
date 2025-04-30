import React from 'react';
import { Settings as SettingsIcon, Bell } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { PageLayout } from '../components/common/page-layout';

const Settings = () => {
  const { testAllNotifications } = useNotification();

  return (
    <PageLayout
      pageTitle="Profile"
      heading="Settings"
      showSearchBar={false}
      showActionButtons={false}
    >
      <div className="bg-white rounded-lg p-6 max-w-4xl">
        <h2 className="text-xl font-medium mb-4 flex items-center text-gray-700">
          <Bell className="w-5 h-5 mr-2" />
          Notification Settings
        </h2>
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-gray-600 mb-4">
            Test the notification system to ensure it's working correctly.
          </p>
          
          <button
            onClick={testAllNotifications}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Test Notifications
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;