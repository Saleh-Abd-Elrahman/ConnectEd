import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import ProfessorHome from './pages/professor/ProfessorHome';
import ProfessorCalendar from './pages/professor/ProfessorCalendar';
import ProfessorMeetings from './pages/professor/ProfessorMeetings';
import ProfessorProfile from './pages/professor/ProfessorProfile';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import Meetings from './pages/Meetings';
import Chats from './pages/Chats';
import ChatConversation from './pages/ChatConversation';
import Notifications from './pages/Notifications';
import { MeetingsProvider } from './contexts/MeetingsContext';
import { ChatProvider } from './contexts/ChatContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeApp } from './utils/initializeApp';

export type Theme = 'light' | 'dark';

// Component to handle protected routes
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'professor';
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/" />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    return currentUser.role === 'student' 
      ? <Navigate to="/home" /> 
      : <Navigate to="/professor/home" />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [appInitialized, setAppInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize app and database
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeApp();
        setAppInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setInitError('Failed to initialize application. Please refresh and try again.');
      }
    };
    
    initialize();
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    const preloadClass = document.documentElement.classList.contains('preload');
    if (preloadClass) {
      setTimeout(() => {
        document.documentElement.classList.remove('preload');
      }, 200);
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.add('preload');
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!appInitialized) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {initError || 'Initializing application...'}
        </p>
      </div>
    );
  }

  return (
    <MeetingsProvider>
      <ChatProvider>
        <Router>
          <Layout theme={theme} onThemeToggle={toggleTheme}>
            <Routes>
              <Route path="/" element={<Login />} />
              
              {/* Student Routes */}
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Calendar />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meetings" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Meetings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chats" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Chats />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chats/:chatId" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <ChatConversation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Notifications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Professor Routes */}
              <Route 
                path="/professor/home" 
                element={
                  <ProtectedRoute requiredRole="professor">
                    <ProfessorHome />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/professor/calendar" 
                element={
                  <ProtectedRoute requiredRole="professor">
                    <ProfessorCalendar />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/professor/meetings" 
                element={
                  <ProtectedRoute requiredRole="professor">
                    <ProfessorMeetings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/professor/profile" 
                element={
                  <ProtectedRoute requiredRole="professor">
                    <ProfessorProfile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </Router>
      </ChatProvider>
    </MeetingsProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;