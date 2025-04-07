import React, { useState } from 'react';
import { Search, Users, BookOpen, Beaker, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClasses } from '../contexts/ClassContext';
import { Class, Subgroup, Student } from '../models/types';

function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { classes, loading } = useClasses();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Get classes for student
  const getClassesForStudent = (): Class[] => {
    if (!currentUser || !classes.length) return [];
    
    const student = currentUser as Student;
    return classes.filter(cls => cls.enrolledStudents?.includes(student.id));
  };

  const studentClasses = getClassesForStudent();

  // Filter classes based on search query
  const filteredClasses = searchQuery.trim()
    ? studentClasses.filter(cls => 
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : studentClasses;

  const getStatusBadgeColor = (classItem: Class) => {
    // Default to upcoming for now - in a real app we'd compare with current time
    return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
  };

  if (loading) {
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
            Home
          </button>
          <button 
            onClick={() => navigate('/calendar')}
            className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Calendar
          </button>
          <button 
            onClick={() => navigate('/meetings')}
            className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Meetings
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F6F8FA] dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {filteredClasses.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium dark:text-white mb-2">No Classes Found</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No classes match your search criteria.' : 'You are not enrolled in any classes yet.'}
            </p>
          </div>
        ) : (
          filteredClasses.map(classItem => (
            <div key={classItem.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#E8F1FF] dark:bg-blue-900/20 rounded-full flex items-center justify-center text-[#00A3FF]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="font-semibold dark:text-white">{classItem.name}</h2>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {classItem.schedule || 'Schedule not available'}
                  </p>
                </div>
              </div>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(classItem)}`}>
                Upcoming
              </span>

              {/* Subgroups */}
              {classItem.subgroups && classItem.subgroups.length > 0 && (
                <div className="mt-4 space-y-4">
                  <button 
                    onClick={() => toggleGroup(classItem.id)}
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {expandedGroups.includes(classItem.id) ? (
                      <ChevronUp className="w-4 h-4 mr-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 mr-2" />
                    )}
                    {classItem.subgroups.length} Subgroups
                  </button>
                  
                  {expandedGroups.includes(classItem.id) && (
                    <div className="space-y-3 pl-4">
                      {classItem.subgroups.map((subgroup: Subgroup) => (
                        <div key={subgroup.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${subgroup.color} rounded-full flex items-center justify-center text-white`}>
                              {subgroup.name[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium dark:text-white">{subgroup.name}</p>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {subgroup.members.length} members
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {subgroup.lastMessage || 'No recent messages'}
                              </p>
                              {subgroup.dueDate && (
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="inline-block px-2 py-0.5 bg-[#E8F1FF] dark:bg-blue-900/20 text-[#00A3FF] dark:text-blue-300 rounded-full text-xs">
                                    Due: {subgroup.dueDate}
                                  </span>
                                  <div className="flex -space-x-2">
                                    {subgroup.members.slice(0, 3).map((member, idx) => (
                                      <div
                                        key={idx}
                                        className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs text-white ring-2 ring-white dark:ring-gray-800"
                                      >
                                        {member[0]}
                                      </div>
                                    ))}
                                    {subgroup.members.length > 3 && (
                                      <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs text-white ring-2 ring-white dark:ring-gray-800">
                                        +{subgroup.members.length - 3}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </>
  );
}

export default Home;