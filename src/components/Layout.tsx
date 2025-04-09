import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Bell, User, Sun, Moon, BookOpen, Calendar } from 'lucide-react';
import { Theme } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  theme: Theme;
  onThemeToggle: () => void;
}

function Layout({ children, theme, onThemeToggle }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isChatConversation = location.pathname.startsWith('/chats/');
  const isProfessorRoute = location.pathname.startsWith('/professor');

  if (isLoginPage || isChatConversation) {
    return <>{children}</>;
  }

  const getHeaderTitle = () => {
    if (isProfessorRoute) {
      if (location.pathname === '/professor/home') return 'Classes';
      if (location.pathname === '/professor/calendar') return 'Calendar';
      if (location.pathname === '/professor/meetings') return 'Meeting Requests';
      if (location.pathname === '/professor/profile') return 'Profile';
      if (location.pathname === '/professor/chats') return 'Chats';
    } else {
      if (location.pathname === '/home') return 'Filter Options';
      if (location.pathname === '/profile') return 'Profile';
      if (location.pathname === '/calendar') return 'Calendar';
      if (location.pathname === '/chats') return 'Chats';
      if (location.pathname === '/notifications') return 'Notifications';
    }
    return '';
  };

  // Check if current location is a chat page (for either role)
  const isChatPage = location.pathname === '/chats' || location.pathname === '/professor/chats';

  return (
    <div className={`min-h-screen flex flex-col bg-[#F6F8FA] dark:bg-gray-900 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Header with Theme Toggle */}
      <header className="bg-white dark:bg-gray-800 p-4 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-semibold dark:text-white">
          {getHeaderTitle()}
        </h1>
        <button 
          onClick={onThemeToggle}
          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          {theme === 'light' ? (
            <Moon className="w-6 h-6" />
          ) : (
            <Sun className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-2">
        <div className="flex justify-around items-center">
          {isProfessorRoute ? (
            // Professor Navigation
            <>
              <button 
                onClick={() => navigate('/professor/home')}
                className={`flex flex-col items-center ${location.pathname === '/professor/home' ? 'text-[#00A3FF]' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-xs mt-1">Classes</span>
              </button>
              <button 
                onClick={() => navigate('/professor/calendar')}
                className={`flex flex-col items-center ${location.pathname === '/professor/calendar' ? 'text-[#00A3FF]' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <Calendar className="w-6 h-6" />
                <span className="text-xs mt-1">Calendar</span>
              </button>
              <button 
                onClick={() => navigate('/professor/chats')}
                className={`flex flex-col items-center ${location.pathname === '/professor/chats' ? 'text-[#00A3FF]' : 'text-gray-500 dark:text-gray-400'} relative`}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs mt-1">Chats</span>
              </button>
              <button 
                onClick={() => navigate('/professor/meetings')}
                className={`flex flex-col items-center ${location.pathname === '/professor/meetings' ? 'text-[#00A3FF]' : 'text-gray-500 dark:text-gray-400'} relative`}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs mt-1">Meetings</span>
              </button>
              <button 
                onClick={() => navigate('/professor/profile')}
                className={`flex flex-col items-center ${location.pathname === '/professor/profile' ? 'text-[#00A3FF]' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <User className="w-6 h-6" />
                <span className="text-xs mt-1">Profile</span>
              </button>
            </>
          ) : (
            // Student Navigation
            <>
              <button 
                onClick={() => navigate('/home')}
                className={`flex flex-col items-center ${location.pathname === '/home' ? 'text-[#00A3FF]' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <Home className="w-6 h-6" />
                <span className="text-xs mt-1">Home</span>
              </button>
              <button 
                onClick={() => navigate('/chats')}
                className={`flex flex-col items-center ${location.pathname === '/chats' ? 'text-[#00A3FF]' : 'text-gray-500 dark:text-gray-400'} relative`}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs mt-1">Chats</span>
              </button>
              <button 
                onClick={() => navigate('/notifications')}
                className={`flex flex-col items-center ${location.pathname === '/notifications' ? 'text-[#00A3FF]' : 'text-gray-500 dark:text-gray-400'} relative`}
              >
                <Bell className="w-6 h-6" />
                <span className="text-xs mt-1">Notifications</span>
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-[#00A3FF]' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <User className="w-6 h-6" />
                <span className="text-xs mt-1">Profile</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Layout;