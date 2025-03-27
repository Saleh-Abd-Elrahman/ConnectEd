import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Clock, Users, BookOpen } from 'lucide-react';

function ProfessorCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sample events data for professors
  const events = [
    {
      date: '2025-03-15',
      title: 'Business Innovation 1801',
      time: '10:00 AM - 11:30 AM',
      type: 'class',
      location: 'Room 301',
      students: 28,
      attendance: '92%'
    },
    {
      date: '2025-03-15',
      title: 'Office Hours',
      time: '2:00 PM - 4:00 PM',
      type: 'office-hours',
      location: 'Office 405',
      meetings: 3
    },
    {
      date: '2025-03-16',
      title: 'Department Meeting',
      time: '9:00 AM - 10:30 AM',
      type: 'meeting',
      location: 'Conference Room A'
    },
    {
      date: '2025-03-16',
      title: 'Advanced Economics 401',
      time: '2:00 PM - 3:30 PM',
      type: 'class',
      location: 'Room 205',
      students: 35,
      attendance: '88%'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => event.date === formatDate(date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(prevDate.getMonth() - 1);
      } else {
        newDate.setMonth(prevDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Generate calendar grid data
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    calendarDays.push(date);
  }

  // Add empty cells to complete the grid
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  for (let i = calendarDays.length; i < totalCells; i++) {
    calendarDays.push(null);
  }

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-[#E8F1FF] dark:bg-blue-900/20 text-[#00A3FF]';
      case 'office-hours':
        return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'meeting':
        return 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
      default:
        return 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <>
      <div className="p-4">
        {/* Navigation Tabs */}
        <div className="flex border-b dark:border-gray-700">
          <button 
            onClick={() => navigate('/professor/home')}
            className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Classes
          </button>
          <button className="px-4 py-2 text-[#00A3FF] border-b-2 border-[#00A3FF] font-medium">
            Calendar
          </button>
          <button 
            onClick={() => navigate('/professor/meetings')}
            className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Meeting Requests
          </button>
        </div>

        {/* Calendar Header */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold dark:text-white">
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mt-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 text-gray-500 dark:text-gray-400 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 border dark:border-gray-700 ${
                  date ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                } ${
                  date && isToday(date) ? 'ring-2 ring-[#00A3FF]' : ''
                }`}
              >
                {date && (
                  <>
                    <span className={`text-sm font-medium ${
                      isToday(date) ? 'text-[#00A3FF]' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {date.getDate()}
                    </span>

                    {/* Events for this date */}
                    <div className="mt-1 space-y-1">
                      {getEventsForDate(date).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={`text-xs p-1.5 rounded ${getEventTypeStyles(event.type)}`}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 mt-0.5">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className="truncate">{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 mt-0.5">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          {event.type === 'class' && (
                            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-0.5">
                              <Users className="w-3 h-3 mr-1" />
                              <span className="truncate">{event.students} students ({event.attendance})</span>
                            </div>
                          )}
                          {event.type === 'office-hours' && event.meetings && (
                            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-0.5">
                              <BookOpen className="w-3 h-3 mr-1" />
                              <span className="truncate">{event.meetings} meetings scheduled</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfessorCalendar;