import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Search, X } from 'lucide-react';
import { useMeetings } from '../../contexts/MeetingsContext';
import { Meeting, MeetingStatus } from '../../models/types';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface StudentInfo {
  displayName: string;
  photoURL?: string;
}

function ProfessorMeetings() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { meetings, updateMeetingStatus, refreshMeetings, loading } = useMeetings();
  const [filter, setFilter] = useState<MeetingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Student info cache
  const [studentInfo, setStudentInfo] = useState<Record<string, StudentInfo>>({});

  // Response Modal State
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseAction, setResponseAction] = useState<'accept' | 'reject' | null>(null);

  // Load student info
  useEffect(() => {
    const fetchStudentInfo = async () => {
      const newStudentInfo: Record<string, StudentInfo> = { ...studentInfo };
      
      for (const meeting of meetings) {
        if (meeting.studentId && !newStudentInfo[meeting.studentId]) {
          try {
            const studentDoc = await getDoc(doc(db, 'users', meeting.studentId));
            if (studentDoc.exists()) {
              const data = studentDoc.data();
              newStudentInfo[meeting.studentId] = {
                displayName: data.displayName || 'Unknown Student',
                photoURL: data.photoURL
              };
            }
          } catch (error) {
            console.error('Error fetching student info:', error);
          }
        }
      }
      
      setStudentInfo(newStudentInfo);
    };

    if (meetings.length > 0) {
      fetchStudentInfo();
    }
  }, [meetings]);

  useEffect(() => {
    // Load meetings when component mounts
    refreshMeetings();
  }, [refreshMeetings]);

  const getStatusColor = (status: MeetingStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
      case 'accepted':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
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

  const handleResponse = (meeting: Meeting, action: 'accept' | 'reject') => {
    setSelectedMeeting(meeting);
    setResponseAction(action);
    setResponseMessage('');
    setShowResponseModal(true);
  };

  const submitResponse = async () => {
    if (!selectedMeeting || !responseAction) return;

    try {
      await updateMeetingStatus(
        selectedMeeting.id, 
        responseAction === 'accept' ? 'accepted' : 'rejected',
        responseMessage.trim() || undefined
      );
      
      setShowResponseModal(false);
      setSelectedMeeting(null);
      setResponseAction(null);
      setResponseMessage('');
    } catch (error) {
      console.error('Error updating meeting status:', error);
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

  const filteredMeetings = meetings
    .filter(meeting => filter === 'all' || meeting.status === filter)
    .filter(meeting => {
      if (searchQuery === '') return true;
      
      const studentName = studentInfo[meeting.studentId]?.displayName || '';
      const reason = meeting.reason || '';
      const searchLower = searchQuery.toLowerCase();
      
      return studentName.toLowerCase().includes(searchLower) || 
             reason.toLowerCase().includes(searchLower);
    });

  return (
    <div className="p-4">
      {/* Navigation Tabs */}
      <div className="flex border-b dark:border-gray-700">
        <button 
          onClick={() => navigate('/professor/home')}
          className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Classes
        </button>
        <button 
          onClick={() => navigate('/professor/calendar')}
          className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Calendar
        </button>
        <button
          onClick={() => navigate('/professor/chats')}
          className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Chats
        </button>
        <button className="px-4 py-2 text-[#00A3FF] border-b-2 border-[#00A3FF] font-medium">
          Meeting Requests
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mt-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by student or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="flex space-x-2">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === status
                  ? 'bg-[#00A3FF] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2.5"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          </div>
        </div>
      )}

      {/* Meetings List */}
      {!loading && (
        <div className="mt-6 space-y-4">
          {filteredMeetings.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery || filter !== 'all' 
                  ? 'No meetings match your search criteria.' 
                  : 'No meeting requests yet.'}
              </p>
            </div>
          ) : (
            filteredMeetings.map((meeting) => {
              const student = studentInfo[meeting.studentId] || { displayName: 'Unknown Student' };
              
              return (
                <div
                  key={meeting.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    {student.photoURL ? (
                      <img
                        src={student.photoURL}
                        alt={student.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {student.displayName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium dark:text-white">{student.displayName}</h3>
                          {meeting.classId && <p className="text-sm text-blue-500 dark:text-blue-400">Class Request</p>}
                        </div>
                        <div className={`px-3 py-1 rounded-full ${getStatusColor(meeting.status)} flex items-center space-x-1`}>
                          {getStatusIcon(meeting.status)}
                          <span className="text-sm capitalize">{meeting.status}</span>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>Date: {formatDate(meeting.date)}</p>
                        <p>Time: {formatTime(meeting.time)}</p>
                        <p>Reason: {meeting.reason}</p>
                        {meeting.responseMessage && (
                          <p className="mt-2 italic">Response: {meeting.responseMessage}</p>
                        )}
                      </div>
                      {meeting.status === 'pending' && (
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => handleResponse(meeting, 'accept')}
                            className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/40 flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleResponse(meeting, 'reject')}
                            className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40 flex items-center space-x-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">
                {responseAction === 'accept' ? 'Accept Meeting' : 'Reject Meeting'}
              </h3>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Optional Message
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows={3}
                  placeholder={responseAction === 'accept' 
                    ? "Add any additional details about the meeting..." 
                    : "Provide a reason for rejecting or suggest an alternative..."}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white resize-none"
                ></textarea>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md mr-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={submitResponse}
                  className={`px-4 py-2 rounded-md text-white ${
                    responseAction === 'accept' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {responseAction === 'accept' ? 'Accept' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfessorMeetings;