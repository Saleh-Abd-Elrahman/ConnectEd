import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

// Sample messages data for different chats
const chatMessages = {
  1: [
    {
      id: 1,
      sender: 'Ed AI',
      content: 'Your assignment is due in 16 hours & 38 minutes.',
      time: '11:00 AM',
      isAI: true
    },
    {
      id: 2,
      sender: 'You',
      content: 'Thanks for the reminder! I\'m working on it right now.',
      time: '11:02 AM',
      isUser: true
    },
    {
      id: 3,
      sender: 'Ed AI',
      content: 'Great! Let me know if you need any help with the assignment.',
      time: '11:03 AM',
      isAI: true
    }
  ],
  2: [
    {
      id: 1,
      sender: 'Jena',
      content: 'Has everyone reviewed the latest financial statements?',
      time: '9:15 AM',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    },
    {
      id: 2,
      sender: 'You',
      content: 'Yes, I went through them this morning.',
      time: '9:20 AM',
      isUser: true
    },
    {
      id: 3,
      sender: 'Jena',
      content: 'Great, see you guys later',
      time: '9:30 AM',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    }
  ],
  3: [
    {
      id: 1,
      sender: 'Professor Uy',
      content: 'I will be a bit late to class',
      time: 'Fri',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    }
  ],
  4: [
    {
      id: 1,
      sender: 'Liam',
      content: 'Our class starts in 2 minutes, why is no one here?',
      time: 'Fri',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    }
  ],
  5: [
    {
      id: 1,
      sender: 'Kiran',
      content: 'Hey, how are you doing?',
      time: '1w ago',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    },
    {
      id: 2,
      sender: 'You',
      content: 'I\'m doing great! Just finished my assignments.',
      time: '1w ago',
      isUser: true
    },
    {
      id: 3,
      sender: 'Kiran',
      content: 'Amazing!',
      time: '1w ago',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    }
  ],
  6: [
    {
      id: 1,
      sender: 'Professor Sarah Chen',
      content: 'Hello! I hope you\'re doing well.',
      time: '2:45 PM',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    },
    {
      id: 2,
      sender: 'Professor Sarah Chen',
      content: 'Would you be available for a meeting tomorrow at 2 PM to discuss your research project?',
      time: 'Just now',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    }
  ]
};

// Chat data mapping
const chatData = {
  1: { name: 'Ed AI', type: 'ai', color: 'bg-purple-500', initial: 'E' },
  2: { name: 'Accounting 2841', type: 'group', color: 'bg-emerald-500' },
  3: { name: 'Business Innovation 1801', type: 'group', color: 'bg-orange-400' },
  4: { name: 'Funding 271', type: 'class', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' },
  5: { name: 'Kiran Glaucus', type: 'direct', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  6: { name: 'Professor Sarah Chen', type: 'direct', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' }
};

function ChatConversation() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    chats, 
    activeChatMessages, 
    sendMessage, 
    setActiveChat,
    userInfoMap,
    isUserOnline
  } = useChat();
  const [newMessage, setNewMessage] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find the current chat
  const currentChat = chats.find(chat => chat.id === chatId);

  // Set active chat when component mounts or chatId changes
  useEffect(() => {
    if (currentChat) {
      setActiveChat(currentChat);
    } else if (chats.length > 0 && chatId) {
      // If direct navigation to chat ID and chat not loaded yet
      const checkChat = chats.find(c => c.id === chatId);
      if (checkChat) {
        setActiveChat(checkChat);
      } else {
        // Chat not found, redirect to chats list
        navigate('/chats');
      }
    }
    
    return () => {
      // Clear active chat when component unmounts
      setActiveChat(null);
    };
  }, [chatId, chats, setActiveChat, navigate]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && chatId) {
      try {
        await sendMessage(chatId, newMessage);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const formatMessageTime = (timestamp: Date | { toDate: () => Date }) => {
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

  // Get chat display information
  const getChatDisplayInfo = () => {
    if (!currentChat) return { name: 'Loading...', type: 'direct' as const };
    
    if (currentChat.type === 'ai') {
      return { 
        name: 'Ed AI', 
        type: 'ai' as const,
        color: 'bg-purple-500',
        online: true
      };
    }
    
    if (currentChat.type === 'group') {
      return { 
        name: currentChat.groupName || 'Group Chat', 
        type: 'group' as const,
        color: 'bg-green-500' 
      };
    }
    
    // For direct chats, find the other participant
    const otherUserId = currentChat.participants.find(id => id !== currentUser?.id);
    const otherUser = otherUserId ? userInfoMap[otherUserId] : null;
    
    if (!otherUser) {
      return { 
        name: 'Unknown User', 
        type: 'direct' as const,
        color: 'bg-gray-500' 
      };
    }
    
    return {
      name: otherUser.displayName,
      photoURL: otherUser.photoURL,
      type: 'direct' as const,
      color: otherUser.role === 'professor' ? 'bg-blue-500' : 'bg-orange-400',
      online: otherUserId ? isUserOnline(otherUserId) : false,
      role: otherUser.role
    };
  };

  const chatInfo = getChatDisplayInfo();

  if (!currentChat) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-4">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Loading chat...</h2>
          <p className="text-gray-500 dark:text-gray-400">
            If this persists, the chat may not exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/chats')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Return to Chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 p-4 flex items-center space-x-4 shadow-sm">
        <button 
          onClick={() => navigate('/chats')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex items-center space-x-3">
          {chatInfo.photoURL ? (
            <img
              src={chatInfo.photoURL}
              alt={chatInfo.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className={`w-10 h-10 ${chatInfo.color} rounded-full flex items-center justify-center text-white`}>
              {chatInfo.type === 'ai' ? 'AI' : chatInfo.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="font-medium dark:text-white">{chatInfo.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {chatInfo.type === 'ai' && 'AI Assistant'}
              {chatInfo.type === 'group' && 'Group Chat'}
              {chatInfo.type === 'direct' && (
                chatInfo.online ? 'Online' : 'Offline'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeChatMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          activeChatMessages.map(message => {
            const isUserMessage = message.senderId === currentUser?.id;
            const sender = isUserMessage 
              ? currentUser 
              : message.senderId === 'AI_ASSISTANT'
                ? { displayName: 'Ed AI', isAI: true }
                : userInfoMap[message.senderId];
                
            return (
              <div
                key={message.id}
                className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    isUserMessage
                      ? 'bg-[#00A3FF] text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  {!isUserMessage && (
                    <p className="text-sm font-medium text-[#00A3FF] dark:text-[#00A3FF] mb-1">
                      {sender?.displayName || 'Unknown User'}
                    </p>
                  )}
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    isUserMessage
                      ? 'text-blue-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <form onSubmit={handleSend} className="p-4">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <Paperclip className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 text-[#00A3FF] hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatConversation;