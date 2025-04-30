import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

const Notification = ({ message, type = "success", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300); // Give time for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Define background color based on notification type
  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-500";
      case "error":
        return "bg-red-50 border-red-500";
      case "warning":
        return "bg-yellow-50 border-yellow-500";
      case "info":
        return "bg-blue-50 border-blue-500";
      default:
        return "bg-gray-50 border-gray-500";
    }
  };

  // Define icon based on notification type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check size={18} className="text-green-500" />;
      case "error":
        return <X size={18} className="text-red-500" />;
      case "warning":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-yellow-500">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        );
      case "info":
        return (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-blue-500">
            <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out mb-2 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div className={`flex items-center p-3 rounded-md border shadow-md ${getBgColor()}`}>
        <div className="mr-2">{getIcon()}</div>
        <p className="font-medium text-sm">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) setTimeout(onClose, 300);
          }}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Notification;