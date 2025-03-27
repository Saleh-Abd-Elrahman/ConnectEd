import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Search, X } from 'lucide-react';

type MeetingStatus = 'pending' | 'accepted' | 'rejected';

interface Meeting {
  id: number;
  student: string;
  course: string;
  date: string;
  time: string;
  reason: string;
  status: MeetingStatus;
  studentImage?: string;
  responseMessage?: string;
}

function ProfessorMeetings() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<MeetingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 1,
      student: 'Alex Johnson',
      course: 'Business Innovation 1801',
      date: '2025-03-15',
      time: '14:00',
      reason: 'Discuss project proposal',
      status: 'pending',
      studentImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
    },
    {
      id: 2,
      student: 'Sarah Chen',
      course: 'Business Innovation 1801',
      date: '2025-03-16',
      time: '11:00',
      reason: 'Review assignment feedback',
      status: 'accepted',
      studentImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      responseMessage: 'Looking forward to our meeting!'
    },
    {
      id: 3,
      student: 'Michael Zhang',
      course: 'Advanced Economics 401',
      date: '2025-03-20',
      time: '15:00',
      reason: 'Discuss research methodology',
      status: 'pending',
      studentImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    },
    {
      id: 4,
      student: 'Emma Wilson',
      course: 'Advanced Economics 401',
      date: '2025-03-18',
      time: '13:30',
      reason: 'Career guidance discussion',
      status: 'rejected',
      studentImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      responseMessage: 'I have a faculty meeting at this time. Please reschedule for next week.'
    }
  ]);

  // Response Modal State
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseAction, setResponseAction] = useState<'accept' | 'reject' | null>(null);

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

  const submitResponse = () => {
    if (!selectedMeeting || !responseAction) return;

    setMeetings(meetings.map(meeting => 
      meeting.id === selectedMeeting.id
        ? {
            ...meeting,
            status: responseAction === 'accept' ? 'accepted' : 'rejected',
            responseMessage: responseMessage.trim()
          }
        : meeting
    ));

    setShowResponseModal(false);
    setSelectedMeeting(null);
    setResponseAction(null);
    setResponseMessage('');
  };

  const filteredMeetings = meetings
    .filter(meeting => filter === 'all' || meeting.status === filter)
    .filter(meeting => 
      searchQuery === '' ||
      meeting.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.course.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            placeholder="Search by student or course..."
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

      {/* Meetings List */}
      <div className="mt-6 space-y-4">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start space-x-4">
              <img
                src={meeting.studentImage}
                alt={meeting.student}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium dark:text-white">{meeting.student}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{meeting.course}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${getStatusColor(meeting.status)} flex items-center space-x-1`}>
                    {getStatusIcon(meeting.status)}
                    <span className="text-sm capitalize">{meeting.status}</span>
                  </div>
                </div>
                <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Date: {new Date(meeting.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p>
                    Time: {new Date(`2000-01-01T${meeting.time}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </p>
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
        ))}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">
                {responseAction === 'accept' ? 'Accept' : 'Reject'} Meeting Request
              </h3>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Meeting with {selectedMeeting.student} on{' '}
                  {new Date(selectedMeeting.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at{' '}
                  {new Date(`2000-01-01T${selectedMeeting.time}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Response Message
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder={
                    responseAction === 'accept'
                      ? "Add a message for the student (e.g., 'Looking forward to our meeting!')"
                      : "Add a reason for declining (e.g., 'I have a conflict at this time. Please reschedule.')"
                  }
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:border-transparent"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={submitResponse}
                  className={`px-4 py-2 text-white rounded-full ${
                    responseAction === 'accept'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Confirm {responseAction === 'accept' ? 'Acceptance' : 'Rejection'}
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