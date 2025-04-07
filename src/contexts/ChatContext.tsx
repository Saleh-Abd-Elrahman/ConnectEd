import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc,
  orderBy,
  serverTimestamp,
  getDoc,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './AuthContext';

// Types
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Date | Timestamp;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    senderId: string;
    text: string;
    timestamp: Date | Timestamp;
  };
  createdAt: Date | Timestamp;
  type: 'direct' | 'group' | 'ai';
  groupName?: string;
  classId?: string;
}

export interface UserInfo {
  id: string;
  displayName: string;
  email: string;
  role: string;
  photoURL?: string;
}

interface ChatContextType {
  chats: Chat[];
  messages: Record<string, ChatMessage[]>;
  activeChat: Chat | null;
  activeChatMessages: ChatMessage[];
  activeUsers: UserInfo[];
  userInfoMap: Record<string, UserInfo>;
  loading: boolean;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  setActiveChat: (chat: Chat | null) => void;
  createChat: (participants: string[], type: 'direct' | 'group' | 'ai', groupName?: string) => Promise<string>;
  isUserOnline: (userId: string) => boolean;
  getUserInfo: (userId: string) => UserInfo | undefined;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [userInfoMap, setUserInfoMap] = useState<Record<string, UserInfo>>({});
  const [activeUsers, setActiveUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Get user chats
  useEffect(() => {
    if (!currentUser?.id) return;

    setLoading(true);
    
    // Query for all chats where the user is a participant
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.id)
    );
    
    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chatList: Chat[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Convert timestamps to Date objects
        const chat: Chat = {
          id: doc.id,
          participants: data.participants,
          type: data.type || 'direct',
          groupName: data.groupName,
          classId: data.classId,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastMessage: data.lastMessage ? {
            senderId: data.lastMessage.senderId,
            text: data.lastMessage.text,
            timestamp: data.lastMessage.timestamp?.toDate() || new Date()
          } : undefined
        };
        
        chatList.push(chat);
      });
      
      // Sort chats by the timestamp of their last message (newest first)
      chatList.sort((a, b) => {
        const timeA = a.lastMessage?.timestamp instanceof Date 
          ? a.lastMessage.timestamp.getTime() 
          : 0;
        const timeB = b.lastMessage?.timestamp instanceof Date 
          ? b.lastMessage.timestamp.getTime() 
          : 0;
        return timeB - timeA;
      });
      
      setChats(chatList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch all user info for all participants in all chats
  useEffect(() => {
    if (!chats.length) return;

    const userIds = new Set<string>();
    
    // Collect all unique user IDs from chat participants
    chats.forEach(chat => {
      chat.participants.forEach(participantId => {
        if (participantId !== 'AI_ASSISTANT' && participantId !== currentUser?.id) {
          userIds.add(participantId);
        }
      });
    });
    
    // Add current user as well
    if (currentUser?.id) {
      userIds.add(currentUser.id);
    }
    
    // Fetch user info for each unique user ID
    const fetchUserInfo = async () => {
      const userInfo: Record<string, UserInfo> = {};
      
      // Set AI assistant info
      userInfo['AI_ASSISTANT'] = {
        id: 'AI_ASSISTANT',
        displayName: 'Ed AI',
        email: 'ai@assistant.com',
        role: 'ai'
      };
      
      for (const userId of userIds) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            userInfo[userId] = {
              id: userId,
              displayName: data.displayName || 'Unknown User',
              email: data.email || '',
              role: data.role || 'student',
              photoURL: data.photoURL
            };
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
      
      setUserInfoMap(userInfo);
      
      // Set active users (for now, consider all users as active)
      const activeUsersList = Object.values(userInfo).filter(u => u.id !== 'AI_ASSISTANT');
      setActiveUsers(activeUsersList);
    };
    
    fetchUserInfo();
  }, [chats, currentUser]);

  // Get messages for active chat
  useEffect(() => {
    if (!activeChat) return;
    
    const messagesQuery = query(
      collection(db, 'messages'),
      where('chatId', '==', activeChat.id),
      orderBy('timestamp', 'asc')
    );
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageList: ChatMessage[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        messageList.push({
          id: doc.id,
          chatId: data.chatId,
          senderId: data.senderId,
          text: data.text,
          timestamp: data.timestamp?.toDate() || new Date(),
          read: data.read || false
        });
      });
      
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: messageList
      }));
    });
    
    return () => unsubscribe();
  }, [activeChat]);
  
  // Mark messages as read when they're displayed
  useEffect(() => {
    if (!activeChat || !currentUser?.id) return;
    
    const chatMessages = messages[activeChat.id] || [];
    const unreadMessages = chatMessages.filter(
      msg => !msg.read && msg.senderId !== currentUser.id
    );
    
    if (unreadMessages.length === 0) return;
    
    // Mark messages as read
    unreadMessages.forEach(async (message) => {
      const messageRef = doc(db, 'messages', message.id);
      await updateDoc(messageRef, { read: true });
    });
  }, [activeChat, messages, currentUser]);

  // Send a new message
  const sendMessage = async (chatId: string, text: string) => {
    if (!currentUser?.id || !text.trim()) return;
    
    try {
      // Special handling for AI chat
      const chat = chats.find(c => c.id === chatId);
      if (chat?.type === 'ai') {
        // Add user message
        const userMessage = {
          chatId,
          senderId: currentUser.id,
          text,
          timestamp: serverTimestamp(),
          read: true
        };
        
        const userMessageDoc = await addDoc(collection(db, 'messages'), userMessage);
        
        // Add AI response (in real app, this would call an AI service)
        setTimeout(async () => {
          const aiResponse = {
            chatId,
            senderId: 'AI_ASSISTANT',
            text: getAIResponse(text),
            timestamp: serverTimestamp(),
            read: false
          };
          
          await addDoc(collection(db, 'messages'), aiResponse);
          
          // Update the chat's last message
          const chatRef = doc(db, 'chats', chatId);
          await updateDoc(chatRef, {
            lastMessage: {
              senderId: 'AI_ASSISTANT',
              text: aiResponse.text,
              timestamp: serverTimestamp()
            }
          });
        }, 1000);
        
        return;
      }
      
      // Regular message
      const message = {
        chatId,
        senderId: currentUser.id,
        text,
        timestamp: serverTimestamp(),
        read: false
      };
      
      // Add the message
      await addDoc(collection(db, 'messages'), message);
      
      // Update the chat's last message
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: {
          senderId: currentUser.id,
          text,
          timestamp: serverTimestamp()
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Create a new chat
  const createChat = async (participants: string[], type: 'direct' | 'group' | 'ai', groupName?: string) => {
    if (!currentUser?.id) throw new Error('User not authenticated');
    
    // Make sure the current user is included in participants
    if (!participants.includes(currentUser.id)) {
      participants.push(currentUser.id);
    }
    
    // For direct chats, check if a chat already exists between these users
    if (type === 'direct' && participants.length === 2) {
      const existingChat = chats.find(chat => 
        chat.type === 'direct' && 
        chat.participants.length === 2 &&
        chat.participants.includes(participants[0]) && 
        chat.participants.includes(participants[1])
      );
      
      if (existingChat) return existingChat.id;
    }
    
    // Create a new chat
    const newChat = {
      participants,
      type,
      groupName: type === 'group' ? groupName : undefined,
      createdAt: serverTimestamp(),
    };
    
    const chatRef = await addDoc(collection(db, 'chats'), newChat);
    return chatRef.id;
  };

  // Simple AI response function (for demo purposes)
  const getAIResponse = (text: string): string => {
    const responses = [
      "I'd be happy to help with that!",
      "Let me find that information for you.",
      "That's a great question. Here's what I found...",
      "According to your class material, you should focus on...",
      "Don't forget your assignment is due soon!",
      "I've analyzed your question and think that...",
      "Have you considered approaching this from a different angle?",
      "Based on your course content, I'd suggest...",
      "I've checked your schedule, and you have time for this on Thursday.",
      "Your professor has covered this topic in last week's lecture."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Check if a user is online (for demo purposes)
  const isUserOnline = (userId: string): boolean => {
    // In a real app, this would check the user's online status
    return userId !== 'AI_ASSISTANT' && Math.random() > 0.3; // 70% chance of being online
  };

  // Get user info
  const getUserInfo = (userId: string): UserInfo | undefined => {
    return userInfoMap[userId];
  };

  // Get messages for active chat
  const activeChatMessages = activeChat ? messages[activeChat.id] || [] : [];

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        activeChat,
        activeChatMessages,
        activeUsers,
        userInfoMap,
        loading,
        sendMessage,
        setActiveChat,
        createChat,
        isUserOnline,
        getUserInfo
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 