import React from 'react';
import { Mail, Phone, MapPin, Award, BookOpen, Clock, LogOut, Users, BarChart2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useClasses } from '../../contexts/ClassContext';
import { useNavigate } from 'react-router-dom';
import { Professor } from '../../models/types';

function ProfessorProfile() {
  const { currentUser, logout } = useAuth();
  const { classes } = useClasses();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A3FF]"></div>
      </div>
    );
  }

  const professor = currentUser as Professor;
  const classCount = classes.length;
  const studentCount = classes.reduce((total, cls) => total + (cls.enrolledStudents?.length || 0), 0);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-24 h-24 bg-[#E8F1FF] dark:bg-blue-900/20 rounded-full flex items-center justify-center text-[#00A3FF] text-3xl font-bold mb-4 md:mb-0 md:mr-6">
              {professor.displayName ? professor.displayName.charAt(0) : 'P'}
            </div>
            <div>
              <h1 className="text-2xl font-bold dark:text-white">{professor.displayName}</h1>
              <p className="text-gray-500 dark:text-gray-400">Professor</p>
              <p className="text-gray-500 dark:text-gray-400">{professor.department || 'Department of Business and Law'}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#E8F1FF] dark:bg-blue-900/20 text-[#00A3FF] rounded-full text-sm">
                  Business Law
                </span>
                <span className="px-3 py-1 bg-[#E8F1FF] dark:bg-blue-900/20 text-[#00A3FF] rounded-full text-sm">
                  Corporate Ethics
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="dark:text-white">{professor.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="dark:text-white">(555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Office</p>
                <p className="dark:text-white">Business Building, Room 302</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Office Hours</p>
                <p className="dark:text-white">{professor.officeHours || 'Mon, Wed 2:00PM - 4:00PM'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Education & Expertise */}
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Education & Expertise</h2>
          <div className="space-y-4">
            <div className="flex">
              <Award className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="font-medium dark:text-white">Education</p>
                <ul className="mt-2 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Ph.D. Business Law, Stanford University</li>
                  <li>M.B.A, Harvard Business School</li>
                  <li>B.A. Economics, Yale University</li>
                </ul>
              </div>
            </div>
            
            <div className="flex">
              <BookOpen className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="font-medium dark:text-white">Areas of Expertise</p>
                <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>Business Law and Ethics</li>
                  <li>Corporate Governance</li>
                  <li>International Business Regulations</li>
                  <li>Contract Negotiations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Current Courses */}
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Current Courses</h2>
          {classes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No courses currently assigned.</p>
          ) : (
            <div className="space-y-3">
              {classes.map(course => (
                <div key={course.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-medium dark:text-white">{course.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{course.schedule || 'Schedule not available'}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{course.enrolledStudents?.length || 0} Students</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Teaching Statistics */}
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Teaching Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-[#E8F1FF] dark:bg-blue-900/20 rounded-full mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-[#00A3FF]" />
              </div>
              <h3 className="text-2xl font-bold dark:text-white">{classCount}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Classes</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-[#E8F1FF] dark:bg-blue-900/20 rounded-full mx-auto mb-2">
                <Users className="w-6 h-6 text-[#00A3FF]" />
              </div>
              <h3 className="text-2xl font-bold dark:text-white">{studentCount}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-[#E8F1FF] dark:bg-blue-900/20 rounded-full mx-auto mb-2">
                <BarChart2 className="w-6 h-6 text-[#00A3FF]" />
              </div>
              <h3 className="text-2xl font-bold dark:text-white">8</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Years Teaching</p>
            </div>
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfessorProfile;