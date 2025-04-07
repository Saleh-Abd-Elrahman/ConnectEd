import React, { useState, useEffect } from 'react';
import { Search, Calendar, X, PlusSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMeetings } from '../contexts/MeetingsContext';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Chat, ChatMessage, UserInfo } from '../contexts/ChatContext';

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
  const { currentUser } = useAuth();
  const { chats, userInfoMap, activeUsers, isUserOnline, createChat, setActiveChat, messages } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingReason, setMeetingReason] = useState('');
  const { addMeeting } = useMeetings();

  const filteredChats = searchQuery.trim() 
    ? chats.filter(chat => {
        // For direct chats, search in the other user's name
        if (chat.type === 'direct') {
          const otherUserId = chat.participants.find(id => id !== currentUser?.id);
          const otherUser = otherUserId ? userInfoMap[otherUserId] : null;
          return otherUser?.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        // For group chats, search in the group name
        if (chat.type === 'group') {
          return chat.groupName?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        // For AI chats, only show if searching for AI specifically
        if (chat.type === 'ai') {
          return 'ai'.includes(searchQuery.toLowerCase()) || 
                 'assistant'.includes(searchQuery.toLowerCase()) ||
                 'ed'.includes(searchQuery.toLowerCase());
        }
        return false;
      })
    : chats;

  const professors = Object.values(userInfoMap)
    .filter(user => user.role === 'professor')
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const students = Object.values(userInfoMap)
    .filter(user => user.role === 'student' && user.id !== currentUser?.id)
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const handleRequestMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser?.id) {
      console.error("User not authenticated");
      return;
    }
    
    addMeeting({
      professorId: selectedProfessor,
      studentId: currentUser.id,
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

  const handleCreateNewChat = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let recipientId = '';
    let chatType: 'direct' | 'ai' = 'direct';
    
    if (selectedProfessor === 'AI_ASSISTANT') {
      recipientId = 'AI_ASSISTANT';
      chatType = 'ai';
    } else if (currentUser?.role === 'student') {
      recipientId = selectedProfessor; // Professor ID
    } else {
      recipientId = selectedStudent; // Student ID
    }
    
    if (!recipientId) return;
    
    try {
      const chatId = await createChat([currentUser!.id, recipientId], chatType);
      setShowNewChatModal(false);
      setSelectedProfessor('');
      setSelectedStudent('');
      
      // Navigate to the new chat
      navigate(`/chats/${chatId}`);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleChatClick = (chat: Chat) => {
    setActiveChat(chat);
    navigate(`/chats/${chat.id}`);
  };

  const formatMessageTime = (timestamp: Date | { toDate: () => Date } | null) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    
    // If it's today, show time
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's within the last week, show relative time
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getOtherParticipantInfo = (chat: Chat) => {
    if (chat.type === 'ai') {
      return {
        displayName: 'Ed AI',
        photoURL: null,
        online: true,
        isAI: true
      };
    }
    
    if (chat.type === 'group') {
      return {
        displayName: chat.groupName || 'Group Chat',
        photoURL: null,
        online: false,
        isGroup: true
      };
    }
    
    // For direct chats, find the other participant
    const otherUserId = chat.participants.find(id => id !== currentUser?.id);
    const otherUser = otherUserId ? userInfoMap[otherUserId] : null;
    
    if (!otherUser) {
      return {
        displayName: 'Unknown User',
        photoURL: null,
        online: false
      };
    }
    
    return {
      displayName: otherUser.displayName,
      photoURL: otherUser.photoURL,
      online: isUserOnline(otherUserId || ''),
      isStudent: otherUser.role === 'student',
      isProfessor: otherUser.role === 'professor'
    };
  };

  // Check if there are unread messages
  const hasUnreadMessages = (chat: Chat): boolean => {
    if (!messages[chat.id]) return false;
    return messages[chat.id].some((msg: ChatMessage) => 
      msg.senderId !== currentUser?.id && !msg.read
    );
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900">
      {/* Action Buttons */}
      <div className="p-4 flex justify-end space-x-3">
        <button
          onClick={() => setShowNewChatModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          <PlusSquare className="w-4 h-4" />
          <span>New Chat</span>
        </button>
        
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
            placeholder="Search chats"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Online Users */}
      <div className="px-4 pb-4 flex space-x-4 overflow-x-auto">
        {activeUsers.map(user => (
          <div 
            key={user.id} 
            className="flex flex-col items-center space-y-1 min-w-[60px] cursor-pointer"
            onClick={() => {
              if (user.id !== currentUser?.id) {
                createChat([currentUser!.id, user.id], 'direct').then(chatId => {
                  navigate(`/chats/${chatId}`);
                });
              }
            }}
          >
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user.displayName.charAt(0)}
                </div>
              )}
              {isUserOnline(user.id) && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              )}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate w-full text-center">
              {user.displayName.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Chat List */}
      <div className="divide-y dark:divide-gray-800">
        {filteredChats.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No chats found matching your search.' : 'No chats yet. Start a new conversation!'}
          </div>
        ) : (
          filteredChats.map(chat => {
            const participant = getOtherParticipantInfo(chat);
            return (
              <div 
                key={chat.id} 
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                onClick={() => handleChatClick(chat)}
              >
                <div className="flex items-start space-x-3">
                  {participant.photoURL ? (
                    <img
                      src={participant.photoURL}
                      alt={participant.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-10 h-10 ${
                      participant.isAI ? 'bg-purple-500' : 
                      participant.isGroup ? 'bg-green-500' : 
                      participant.isProfessor ? 'bg-blue-500' : 
                      'bg-orange-400'
                    } rounded-full flex items-center justify-center text-white`}>
                      {participant.isAI ? 'AI' : participant.displayName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium dark:text-white truncate">{participant.displayName}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {chat.lastMessage ? formatMessageTime(chat.lastMessage.timestamp) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {chat.lastMessage ? (
                        chat.lastMessage.senderId === currentUser?.id ? 
                        `You: ${chat.lastMessage.text}` : 
                        chat.lastMessage.text
                      ) : 'No messages yet'}
                    </p>
                  </div>
                  {hasUnreadMessages(chat) ? (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
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
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
                >
                  <option value="">Select a professor</option>
                  {professors.map(prof => (
                    <option key={prof.id} value={prof.id}>
                      {prof.displayName}
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
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
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
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason
                </label>
                <textarea
                  value={meetingReason}
                  onChange={(e) => setMeetingReason(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white resize-none"
                  placeholder="Briefly describe the reason for your meeting request..."
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A3FF] text-white rounded-md hover:bg-blue-600"
                >
                  Request Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">New Chat</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNewChat} className="p-4 space-y-4">
              {currentUser?.role === 'student' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chat with
                  </label>
                  <select
                    value={selectedProfessor}
                    onChange={(e) => setSelectedProfessor(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
                  >
                    <option value="">Select a recipient</option>
                    <option value="AI_ASSISTANT">Ed AI Assistant</option>
                    {professors.map(prof => (
                      <option key={prof.id} value={prof.id}>
                        {prof.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Student
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white"
                  >
                    <option value="">Select a student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Start Chat
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