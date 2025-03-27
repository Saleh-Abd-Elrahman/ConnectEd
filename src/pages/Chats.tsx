import React, { useState } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMeetings } from '../contexts/MeetingsContext';

// Sample data for online users
const onlineUsers = [
  { id: 1, name: 'Sally', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', online: true },
  { id: 2, name: 'Jason', image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12', online: true },
  { id: 3, name: 'Jena', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', online: true },
  { id: 4, name: 'Michael', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', online: false },
  { id: 5, name: 'Liam', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', online: true },
  { id: 6, name: 'Mark', initials: 'M', online: false }
];

// Sample data for chats
const chats = [
  {
    id: 1,
    type: 'ai',
    name: 'Ed AI',
    message: 'Your assignment is due in 16 hours & 38 minutes.',
    time: '11:00 AM',
    unread: true,
    color: 'bg-purple-500'
  },
  {
    id: 2,
    type: 'group',
    name: 'Accounting 2841',
    message: 'Jena: great,see you guys later',
    time: '9:30 AM',
    unread: true,
    color: 'bg-emerald-500'
  },
  {
    id: 3,
    type: 'group',
    name: 'Business Innovation 1801',
    message: 'Professor Uy: I will be a bit late to class',
    time: 'Fri',
    hasSubgroup: true,
    color: 'bg-orange-400'
  },
  {
    id: 4,
    type: 'class',
    name: 'Funding 271',
    message: 'Liam: Our class starts in 2 minutes, why is no one here?',
    time: 'Fri',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    hasSubgroup: true,
    subgroups: [
      {
        id: 1,
        name: 'Group 1',
        message: "Iris: I've submitted our report!",
        time: 'Fri',
        due: '24th October',
        color: 'bg-blue-500'
      }
    ]
  },
  {
    id: 6,
    type: 'direct',
    name: 'Professor Sarah Chen',
    message: 'Would you be available for a meeting tomorrow at 2 PM to discuss your research project?',
    time: 'Just now',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    unread: true
  },
  {
    id: 5,
    type: 'direct',
    name: 'Kiran Glaucus',
    message: 'Amazing!',
    time: '1w ago',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    online: true
  }
];

function Chats() {
  const navigate = useNavigate();
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingReason, setMeetingReason] = useState('');
  const { addMeeting } = useMeetings();

  const professors = [
    'Professor Sarah Chen',
    'Professor Uy',
    'Professor Smith',
    'Professor Johnson'
  ];

  const handleRequestMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    
    addMeeting({
      professor: selectedProfessor,
      date: meetingDate,
      time: meetingTime,
      reason: meetingReason
    });

    setShowMeetingModal(false);
    // Reset form
    setSelectedProfessor('');
    setMeetingDate('');
    setMeetingTime('');
    setMeetingReason('');

    // Navigate to meetings page to show the new request
    navigate('/meetings');
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900">
      {/* Request Meeting Button */}
      <div className="p-4 flex justify-end">
        <button
          onClick={() => setShowMeetingModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#00A3FF] text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span>Request Meeting</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Online Users */}
      <div className="px-4 pb-4 flex space-x-4 overflow-x-auto">
        {onlineUsers.map(user => (
          <div key={user.id} className="flex flex-col items-center space-y-1 min-w-[60px]">
            <div className="relative">
              {user.image ? (
                <img
                  src={`${user.image}?w=100&h=100&fit=crop`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user.initials}
                </div>
              )}
              {user.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              )}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate w-full text-center">
              {user.name}
            </span>
          </div>
        ))}
      </div>

      {/* Chat List */}
      <div className="divide-y dark:divide-gray-800">
        {chats.map(chat => (
          <div 
            key={chat.id} 
            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
            onClick={() => navigate(`/chats/${chat.id}`)}
          >
            <div className="flex items-start space-x-3">
              {chat.image ? (
                <img
                  src={`${chat.image}?w=100&h=100&fit=crop`}
                  alt={chat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className={`w-10 h-10 ${chat.color} rounded-full flex items-center justify-center`}>
                  {chat.type === 'ai' ? 'E' : <div className="w-5 h-5 bg-white/30 rounded-full" />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium dark:text-white truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {chat.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.message}</p>
                {chat.hasSubgroup && (
                  <button className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <span className="mr-1">▼</span> Select Subgroup
                  </button>
                )}
                {chat.subgroups?.map(subgroup => (
                  <div key={subgroup.id} className="mt-2 pl-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full ${subgroup.color} flex items-center justify-center text-white`}>
                        <div className="w-4 h-4 bg-white/30 rounded-full" />
                      </div>
                      <div>
                        <p className="font-medium text-sm dark:text-white">{subgroup.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{subgroup.message}</p>
                        {subgroup.due && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                            Due: {subgroup.due}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {chat.unread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Meeting Request Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">Request Meeting</h3>
              <button
                onClick={() => setShowMeetingModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRequestMeeting} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Professor
                </label>
                <select
                  value={selectedProfessor}
                  onChange={(e) => setSelectedProfessor(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a professor</option>
                  {professors.map(professor => (
                    <option key={professor} value={professor}>
                      {professor}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason for Meeting
                </label>
                <textarea
                  value={meetingReason}
                  onChange={(e) => setMeetingReason(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Briefly describe the reason for the meeting..."
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A3FF] text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chats;