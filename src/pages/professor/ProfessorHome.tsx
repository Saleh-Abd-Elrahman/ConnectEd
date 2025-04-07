import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, BookOpen, Clock, Calendar, CheckCircle, XCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { useClasses } from '../../contexts/ClassContext';
import { useMeetings } from '../../contexts/MeetingsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Meeting } from '../../models/types';

function ProfessorHome() {
  const navigate = useNavigate();
  const [expandedClasses, setExpandedClasses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { classes, loading: classesLoading } = useClasses();
  const { meetings, loading: meetingsLoading } = useMeetings();
  const { currentUser } = useAuth();

  const toggleClass = (classId: string) => {
    setExpandedClasses(prev => 
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const getMeetingsForClass = (classId: string): Meeting[] => {
    return meetings.filter(meeting => meeting.classId === classId);
  };

  const getStudentCountForClass = (enrolledStudents: string[] | undefined) => {
    return enrolledStudents?.length || 0;
  };

  const formatClassTime = (schedule: string | undefined) => {
    return schedule || 'No schedule available';
  };

  // Filter classes based on search query
  const filteredClasses = searchQuery.trim()
    ? classes.filter(classItem => 
        classItem.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : classes;

  if (classesLoading || meetingsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A3FF]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        {/* Navigation Tabs */}
        <div className="flex border-b dark:border-gray-700">
          <button className="px-4 py-2 text-[#00A3FF] border-b-2 border-[#00A3FF] font-medium">
            Classes
          </button>
          <button 
            onClick={() => navigate('/professor/calendar')}
            className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Calendar
          </button>
          <button 
            onClick={() => navigate('/professor/meetings')}
            className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Meeting Requests
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search classes, students, or assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F6F8FA] dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Classes List */}
      <main className="p-4 space-y-4">
        {filteredClasses.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium dark:text-white mb-2">No Classes Found</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No classes match your search criteria.' : 'You are not teaching any classes yet.'}
            </p>
          </div>
        ) : (
          filteredClasses.map(classItem => {
            const classStudents = getStudentCountForClass(classItem.enrolledStudents);
            const classMeetings = getMeetingsForClass(classItem.id);
            
            return (
              <div key={classItem.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#E8F1FF] dark:bg-blue-900/20 rounded-lg">
                        <BookOpen className="w-6 h-6 text-[#00A3FF]" />
                      </div>
                      <div>
                        <h2 className="font-semibold dark:text-white">{classItem.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatClassTime(classItem.schedule)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{classStudents} Students</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleClass(classItem.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        {expandedClasses.includes(classItem.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {expandedClasses.includes(classItem.id) && (
                  <div className="border-t dark:border-gray-700 p-4 space-y-6">
                    {/* Meeting Requests Section */}
                    <div>
                      <h3 className="font-medium dark:text-white mb-3">Meeting Requests</h3>
                      <div className="space-y-3">
                        {classMeetings.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400">No meeting requests for this class.</p>
                        ) : (
                          classMeetings.map(meeting => (
                            <div key={meeting.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-full ${
                                    meeting.status === 'pending' 
                                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                                      : meeting.status === 'accepted'
                                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                      : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                  }`}>
                                    {meeting.status === 'pending' ? <Clock className="w-4 h-4" /> : 
                                     meeting.status === 'accepted' ? <CheckCircle className="w-4 h-4" /> :
                                     <XCircle className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <h4 className="font-medium dark:text-white">Meeting with Student</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {meeting.date} at {meeting.time}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Reason: {meeting.reason}
                                    </p>
                                  </div>
                                </div>
                                {meeting.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <button className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/40">
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40">
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </>
  );
}

export default ProfessorHome;