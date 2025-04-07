import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useMeetings } from '../contexts/MeetingsContext';
import { MeetingStatus } from '../models/types';
import { useAuth } from '../contexts/AuthContext';
import { useClasses } from '../contexts/ClassContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Cache for professor names to avoid repeated fetches
const professorNameCache = new Map<string, string>();
const classNameCache = new Map<string, string>();

function Meetings() {
  const navigate = useNavigate();
  const { meetings, loading, error, refreshMeetings } = useMeetings();
  const { currentUser } = useAuth();
  const { classes } = useClasses();
  const [professorNames, setProfessorNames] = useState<{ [key: string]: string }>({});
  const [classNames, setClassNames] = useState<{ [key: string]: string }>({});

  // Fetch professor names when meetings change
  useEffect(() => {
    const fetchProfessorNames = async () => {
      const newProfessorNames: { [key: string]: string } = {};
      
      for (const meeting of meetings) {
        // Skip if professorId is undefined
        if (!meeting.professorId) {
          newProfessorNames[meeting.id] = 'No Professor Assigned';
          continue;
        }

        if (!professorNameCache.has(meeting.professorId)) {
          try {
            const professorDoc = await getDoc(doc(db, 'users', meeting.professorId));
            if (professorDoc.exists()) {
              const professorData = professorDoc.data();
              const name = professorData.displayName || 'Unknown Professor';
              professorNameCache.set(meeting.professorId, name);
            }
          } catch (error) {
            console.error('Error fetching professor name:', error);
            professorNameCache.set(meeting.professorId, 'Unknown Professor');
          }
        }
        newProfessorNames[meeting.professorId] = professorNameCache.get(meeting.professorId) || 'Unknown Professor';
      }
      
      setProfessorNames(newProfessorNames);
    };

    if (meetings.length > 0) {
      fetchProfessorNames();
    }
  }, [meetings]);

  // Get class names
  useEffect(() => {
    const fetchClassNames = async () => {
      const newClassNames: { [key: string]: string } = {};
      
      for (const meeting of meetings) {
        // Skip if classId is undefined
        if (!meeting.classId) {
          newClassNames[meeting.id] = '';
          continue;
        }

        // First check if we have the class in the classes context
        const classFromContext = classes.find(c => c.id === meeting.classId);
        if (classFromContext) {
          newClassNames[meeting.id] = classFromContext.name;
          classNameCache.set(meeting.classId, classFromContext.name);
          continue;
        }

        // If not in context, check the cache
        if (classNameCache.has(meeting.classId)) {
          newClassNames[meeting.id] = classNameCache.get(meeting.classId) || '';
          continue;
        }

        // If not in cache, fetch from Firestore
        try {
          const classDoc = await getDoc(doc(db, 'classes', meeting.classId));
          if (classDoc.exists()) {
            const classData = classDoc.data();
            const name = classData.name || 'Unknown Class';
            classNameCache.set(meeting.classId, name);
            newClassNames[meeting.id] = name;
          } else {
            newClassNames[meeting.id] = '';
          }
        } catch (error) {
          console.error('Error fetching class name:', error);
          newClassNames[meeting.id] = '';
        }
      }
      
      setClassNames(newClassNames);
    };

    if (meetings.length > 0) {
      fetchClassNames();
    }
  }, [meetings, classes]);

  useEffect(() => {
    // Debug logging
    console.log('Current user:', currentUser);
    console.log('Meetings component mounted');
    
    // Load meetings when component mounts
    refreshMeetings();
  }, [refreshMeetings]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('Meetings state:', { meetings, loading, error });
  }, [meetings, loading, error]);

  const getStatusColor = (status: MeetingStatus) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'accepted':
        return 'text-green-500 dark:text-green-400';
      case 'rejected':
        return 'text-red-500 dark:text-red-400';
    }
  };

  const getStatusIcon = (status: MeetingStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time to a more readable format
  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <div className="p-4">
      {/* Navigation Tabs */}
      <div className="flex border-b dark:border-gray-700">
        <button 
          onClick={() => navigate('/home')}
          className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Home
        </button>
        <button 
          onClick={() => navigate('/calendar')}
          className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Calendar
        </button>
        <button className="px-4 py-2 text-[#00A3FF] border-b-2 border-[#00A3FF] font-medium">
          Meetings
        </button>
      </div>

      {/* Refresh Button */}
      <div className="mt-4 flex justify-between items-center">
        <h2 className="text-lg font-medium dark:text-white">Your Meeting Requests</h2>
        <button 
          onClick={() => refreshMeetings()}
          className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => refreshMeetings()}
            className="mt-2 text-sm font-medium text-red-700 hover:text-red-900"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2.5"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          </div>
        </div>
      )}

      {/* Meetings List */}
      {!loading && !error && (
        <div className="mt-6 space-y-4">
          {meetings.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No meeting requests yet
            </div>
          ) : (
            meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium dark:text-white">
                      {meeting.professorId ? (professorNames[meeting.professorId] || 'Loading...') : 'No Professor Assigned'}
                    </h3>
                    {classNames[meeting.id] && (
                      <p className="text-sm text-blue-500 dark:text-blue-400">
                        {classNames[meeting.id]}
                      </p>
                    )}
                    <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>Date: {formatDate(meeting.date)}</p>
                      <p>Time: {formatTime(meeting.time)}</p>
                      <p>Reason: {meeting.reason}</p>
                      {meeting.responseMessage && (
                        <p className="mt-2 italic">
                          Response: {meeting.responseMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`flex items-center ${getStatusColor(meeting.status)}`}>
                    {getStatusIcon(meeting.status)}
                    <span className="ml-2 text-sm capitalize">{meeting.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Meetings;