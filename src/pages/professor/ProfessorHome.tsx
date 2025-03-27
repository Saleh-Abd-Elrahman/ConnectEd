import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, BookOpen, Clock, Calendar, CheckCircle, XCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

function ProfessorHome() {
  const navigate = useNavigate();
  const [expandedClasses, setExpandedClasses] = useState<number[]>([]);

  const toggleClass = (classId: number) => {
    setExpandedClasses(prev => 
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const classes = [
    {
      id: 1,
      name: 'Business Innovation 1801',
      time: 'Mon, Wed 10:00AM - 11:30AM',
      students: 28,
      attendance: 92,
      status: 'in-progress',
      nextClass: 'Today, 10:00AM',
      assignments: [
        {
          id: 1,
          title: 'Innovation Case Study',
          dueDate: 'March 20, 2025',
          submitted: 20,
          total: 28
        },
        {
          id: 2,
          title: 'Group Project Milestone 1',
          dueDate: 'March 25, 2025',
          submitted: 15,
          total: 28
        }
      ],
      meetings: [
        {
          id: 1,
          student: 'Alex Johnson',
          time: 'Today, 2:00 PM',
          status: 'pending'
        },
        {
          id: 2,
          student: 'Sarah Chen',
          time: 'Tomorrow, 11:00 AM',
          status: 'accepted'
        }
      ]
    },
    {
      id: 2,
      name: 'Advanced Economics 401',
      time: 'Tue, Thu 2:00PM - 3:30PM',
      students: 35,
      attendance: 88,
      status: 'upcoming',
      nextClass: 'Tomorrow, 2:00PM',
      assignments: [
        {
          id: 1,
          title: 'Economic Analysis Paper',
          dueDate: 'March 22, 2025',
          submitted: 30,
          total: 35
        }
      ],
      meetings: [
        {
          id: 1,
          student: 'Michael Zhang',
          time: 'March 20, 3:00 PM',
          status: 'pending'
        }
      ]
    }
  ];

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
            className="w-full pl-10 pr-4 py-2 bg-[#F6F8FA] dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Classes List */}
      <main className="p-4 space-y-4">
        {classes.map(classItem => (
          <div key={classItem.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#E8F1FF] dark:bg-blue-900/20 rounded-lg">
                    <BookOpen className="w-6 h-6 text-[#00A3FF]" />
                  </div>
                  <div>
                    <h2 className="font-semibold dark:text-white">{classItem.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{classItem.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{classItem.students} Students</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {classItem.attendance}% Attendance
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

              <div className="mt-4 flex items-center space-x-4">
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-[#00A3FF] h-2 rounded-full"
                    style={{ width: `${classItem.attendance}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-[#00A3FF]">
                  Next: {classItem.nextClass}
                </span>
              </div>
            </div>

            {expandedClasses.includes(classItem.id) && (
              <div className="border-t dark:border-gray-700 p-4 space-y-6">
                {/* Assignments Section */}
                <div>
                  <h3 className="font-medium dark:text-white mb-3">Current Assignments</h3>
                  <div className="space-y-3">
                    {classItem.assignments.map(assignment => (
                      <div key={assignment.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium dark:text-white">{assignment.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Due: {assignment.dueDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#00A3FF]">
                              {assignment.submitted}/{assignment.total} Submitted
                            </p>
                            <div className="mt-1 flex items-center space-x-1">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                <div 
                                  className="bg-[#00A3FF] h-1.5 rounded-full"
                                  style={{ width: `${(assignment.submitted/assignment.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meeting Requests Section */}
                <div>
                  <h3 className="font-medium dark:text-white mb-3">Meeting Requests</h3>
                  <div className="space-y-3">
                    {classItem.meetings.map(meeting => (
                      <div key={meeting.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              meeting.status === 'pending' 
                                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                                : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            }`}>
                              {meeting.status === 'pending' ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </div>
                            <div>
                              <h4 className="font-medium dark:text-white">{meeting.student}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{meeting.time}</p>
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
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </main>
    </>
  );
}

export default ProfessorHome;