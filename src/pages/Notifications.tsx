import React, { useState } from 'react';
import { Bell, Calendar, MessageCircle, GraduationCap, FileText, Clock, X } from 'lucide-react';

// Sample notifications data
const initialNotifications = [
  {
    id: 1,
    type: 'assignment',
    title: 'Assignment Due Soon',
    message: 'Business Innovation 1801 assignment due in 2 days',
    time: '2 hours ago',
    icon: FileText,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    unread: true,
    details: {
      course: 'Business Innovation 1801',
      dueDate: 'March 17, 2025',
      type: 'Group Project',
      status: 'Not Started'
    }
  },
  {
    id: 2,
    type: 'class',
    title: 'Class Reminder',
    message: 'Funding 271 starts in 30 minutes',
    time: '30 minutes ago',
    icon: GraduationCap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    unread: true,
    details: {
      course: 'Funding 271',
      time: '9:30 AM - 10:30 AM',
      room: 'Room 301',
      professor: 'Dr. Smith'
    }
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message',
    message: 'Professor Uy sent you a message',
    time: '1 hour ago',
    icon: MessageCircle,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    unread: false,
    details: {
      from: 'Professor Uy',
      course: 'Business Innovation 1801',
      preview: 'Hello class, I wanted to discuss...',
      received: 'March 15, 2025 at 10:30 AM'
    }
  },
  {
    id: 4,
    type: 'calendar',
    title: 'Event Added',
    message: 'Group meeting scheduled for tomorrow at 2 PM',
    time: '3 hours ago',
    icon: Calendar,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    unread: false,
    details: {
      event: 'Group Meeting',
      date: 'March 16, 2025',
      time: '2:00 PM - 3:00 PM',
      location: 'Online (Zoom)',
      participants: 'Team Alpha'
    }
  },
  {
    id: 5,
    type: 'deadline',
    title: 'Deadline Extended',
    message: 'Accounting 2841 project deadline extended to next week',
    time: '5 hours ago',
    icon: Clock,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    unread: false,
    details: {
      course: 'Accounting 2841',
      assignment: 'Final Project',
      oldDeadline: 'March 20, 2025',
      newDeadline: 'March 27, 2025',
      reason: 'Extended due to system maintenance'
    }
  }
];

type Filter = 'all' | 'unread';

type NotificationDetails = {
  [key: string]: string;
};

type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: React.ComponentType;
  color: string;
  bgColor: string;
  unread: boolean;
  details: NotificationDetails;
};

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: false
    })));
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (notification.unread) {
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, unread: false } : n
      ));
    }
  };

  const closePopup = () => {
    setSelectedNotification(null);
  };

  const filteredNotifications = activeFilter === 'all'
    ? notifications
    : notifications.filter(notification => notification.unread);

  const hasUnreadNotifications = notifications.some(notification => notification.unread);

  return (
    <div className="h-full bg-white dark:bg-gray-900 relative">
      {/* Header Section */}
      <div className="p-4 border-b dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Notifications</h2>
          <button 
            className={`text-sm ${
              hasUnreadNotifications 
                ? 'text-[#00A3FF] hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer' 
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
            onClick={hasUnreadNotifications ? handleMarkAllAsRead : undefined}
          >
            Mark all as read
          </button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#00A3FF] text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              activeFilter === 'unread'
                ? 'bg-[#00A3FF] text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Unread {hasUnreadNotifications && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {notifications.filter(n => n.unread).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y dark:divide-gray-800">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No {activeFilter === 'unread' ? 'unread ' : ''}notifications
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 ${notification.unread ? 'bg-gray-50 dark:bg-gray-800/50' : ''} cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${notification.bgColor}`}>
                    <IconComponent className={`w-5 h-5 ${notification.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium dark:text-white flex items-center">
                          {notification.title}
                          {notification.unread && (
                            <span className="ml-2 w-2 h-2 bg-[#00A3FF] rounded-full"></span>
                          )}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Popup */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${selectedNotification.bgColor}`}>
                  <selectedNotification.icon className={`w-5 h-5 ${selectedNotification.color}`} />
                </div>
                <h3 className="text-lg font-semibold dark:text-white">
                  {selectedNotification.title}
                </h3>
              </div>
              <button 
                onClick={closePopup}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {Object.entries(selectedNotification.details).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {value}
                  </dd>
                </div>
              ))}
            </div>
            <div className="p-4 border-t dark:border-gray-700 flex justify-end">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-[#00A3FF] text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;