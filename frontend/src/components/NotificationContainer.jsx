import React from 'react';
import Notification from './Notification';

const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto w-full">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
            actionLabel={notification.actionLabel}
            onAction={notification.onAction}
            autoClose={notification.autoClose !== undefined ? notification.autoClose : true}
            duration={notification.duration}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;