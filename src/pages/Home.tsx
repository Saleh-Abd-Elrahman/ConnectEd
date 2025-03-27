import React, { useState } from 'react';
import { Search, Users, BookOpen, Code, Beaker, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);

  const toggleGroup = (groupId: number) => {
    setExpandedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const groups = [
    {
      id: 1,
      name: 'Funding 271',
      instructor: 'Liam Morgan',
      time: 'Fri, 9:30AM - 10:30AM',
      status: 'now',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      type: 'class',
      subgroups: [
        {
          id: 1,
          name: 'Group 1',
          message: "Iris: I've submitted our report!",
          due: '24th October',
          color: 'bg-blue-500',
          members: ['Iris', 'John', 'Sarah']
        }
      ]
    },
    {
      id: 2,
      name: 'Data Science 401',
      instructor: 'Dr. Emily Chen',
      time: 'Mon, 2:00PM - 4:00PM',
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      type: 'class',
      subgroups: [
        {
          id: 1,
          name: 'Analysis Team',
          message: 'Alex: Updated the dataset preprocessing code',
          due: '20th October',
          color: 'bg-purple-500',
          members: ['Alex', 'Maria', 'James']
        },
        {
          id: 2,
          name: 'Visualization Team',
          message: 'Emma: New dashboard mockups ready for review',
          due: '22nd October',
          color: 'bg-green-500',
          members: ['Emma', 'David', 'Sophie']
        }
      ]
    },
    {
      id: 3,
      name: 'Software Engineering 355',
      instructor: 'Prof. Michael Zhang',
      time: 'Wed, 11:00AM - 1:00PM',
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      type: 'class',
      subgroups: [
        {
          id: 1,
          name: 'Frontend Team',
          message: 'Ryan: PR ready for review',
          due: '25th October',
          color: 'bg-pink-500',
          members: ['Ryan', 'Lisa', 'Tom']
        },
        {
          id: 2,
          name: 'Backend Team',
          message: 'Mike: API documentation updated',
          due: '23rd October',
          color: 'bg-yellow-500',
          members: ['Mike', 'Anna', 'Chris']
        },
        {
          id: 3,
          name: 'DevOps Team',
          message: 'Sam: Deployment pipeline configured',
          due: '27th October',
          color: 'bg-indigo-500',
          members: ['Sam', 'Kate', 'Paul']
        }
      ]
    },
    {
      id: 4,
      name: 'Chemistry Research Group',
      instructor: 'Dr. Sarah Peterson',
      time: 'Thu, 3:00PM - 5:00PM',
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69',
      type: 'research',
      subgroups: [
        {
          id: 1,
          name: 'Lab Team A',
          message: 'Lucy: Experiment results ready for analysis',
          due: '30th October',
          color: 'bg-emerald-500',
          members: ['Lucy', 'Mark', 'Helen']
        },
        {
          id: 2,
          name: 'Lab Team B',
          message: 'Daniel: New compound synthesis completed',
          due: '1st November',
          color: 'bg-cyan-500',
          members: ['Daniel', 'Rachel', 'Oliver']
        }
      ]
    }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'now':
        return 'bg-[#E8F1FF] dark:bg-blue-900 text-[#00A3FF] dark:text-blue-300';
      case 'upcoming':
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class':
        return <BookOpen className="w-5 h-5" />;
      case 'research':
        return <Beaker className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

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
            className="w-full pl-10 pr-4 py-2 bg-[#F6F8FA] dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {groups.map(group => (
          <div key={group.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <img
                src={`${group.image}?w=100&h=100&fit=crop`}
                alt={group.instructor}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold dark:text-white">{group.name}</h2>
                  {getTypeIcon(group.type)}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {group.instructor}: {group.time}
                </p>
              </div>
            </div>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(group.status)}`}>
              {group.status === 'now' ? 'Class: Now' : 'Upcoming'}
            </span>

            {/* Subgroups */}
            <div className="mt-4 space-y-4">
              <button 
                onClick={() => toggleGroup(group.id)}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {expandedGroups.includes(group.id) ? (
                  <ChevronUp className="w-4 h-4 mr-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 mr-2" />
                )}
                {group.subgroups.length} Subgroups
              </button>
              
              {expandedGroups.includes(group.id) && (
                <div className="space-y-3 pl-4">
                  {group.subgroups.map(subgroup => (
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
                            {subgroup.message}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="inline-block px-2 py-0.5 bg-[#E8F1FF] dark:bg-blue-900/20 text-[#00A3FF] dark:text-blue-300 rounded-full text-xs">
                              Due: {subgroup.due}
                            </span>
                            <div className="flex -space-x-2">
                              {subgroup.members.map((member, idx) => (
                                <div
                                  key={idx}
                                  className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs text-white ring-2 ring-white dark:ring-gray-800"
                                >
                                  {member[0]}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

export default Home;