import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip } from 'lucide-react';

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
  const [newMessage, setNewMessage] = React.useState('');

  const currentChat = chatData[Number(chatId)];
  const messages = chatMessages[Number(chatId)] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  if (!currentChat) {
    navigate('/chats');
    return null;
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
          {currentChat.image ? (
            <img
              src={`${currentChat.image}?w=100&h=100&fit=crop`}
              alt={currentChat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className={`w-10 h-10 ${currentChat.color} rounded-full flex items-center justify-center text-white`}>
              {currentChat.type === 'ai' ? currentChat.initial : <div className="w-5 h-5 bg-white/30 rounded-full" />}
            </div>
          )}
          <div>
            <h2 className="font-medium dark:text-white">{currentChat.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentChat.type === 'ai' && 'AI Assistant'}
              {currentChat.type === 'group' && 'Group Chat'}
              {currentChat.type === 'class' && 'Class Chat'}
              {currentChat.type === 'direct' && 'Online'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.isUser
                  ? 'bg-[#00A3FF] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              {!message.isUser && !message.isAI && (
                <p className="text-sm font-medium text-[#00A3FF] dark:text-[#00A3FF] mb-1">
                  {message.sender}
                </p>
              )}
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.isUser
                  ? 'text-blue-100'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
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