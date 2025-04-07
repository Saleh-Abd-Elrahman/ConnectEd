import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Clock, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClasses } from '../contexts/ClassContext';
import { Student } from '../models/types';

function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { classes } = useClasses();

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

  // Assume this is a student profile
  const student = currentUser as Student;
  
  // Get enrolled classes
  const enrolledClasses = classes.filter(
    cls => cls.enrolledStudents?.includes(student.id)
  );

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-24 h-24 bg-[#E8F1FF] dark:bg-blue-900/20 rounded-full flex items-center justify-center text-[#00A3FF] text-3xl font-bold mb-4 md:mb-0 md:mr-6">
              {student.displayName ? student.displayName.charAt(0) : 'S'}
            </div>
            <div>
              <h1 className="text-2xl font-bold dark:text-white">{student.displayName}</h1>
              <p className="text-gray-500 dark:text-gray-400">Student</p>
              <p className="text-gray-500 dark:text-gray-400">
                {student.major || 'Business Administration'}, 
                Year {student.year || '3'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Contact Information</h2>
          <div className="flex items-center mb-4">
            <Mail className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="dark:text-white">{student.email}</p>
            </div>
          </div>
        </div>
        
        {/* Enrolled Classes */}
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Enrolled Classes</h2>
          {enrolledClasses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No classes currently enrolled.</p>
          ) : (
            <div className="space-y-3">
              {enrolledClasses.map(course => (
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
        
        {/* Stats */}
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-[#E8F1FF] dark:bg-blue-900/20 rounded-full mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-[#00A3FF]" />
              </div>
              <h3 className="text-2xl font-bold dark:text-white">{enrolledClasses.length}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Classes</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-[#E8F1FF] dark:bg-blue-900/20 rounded-full mx-auto mb-2">
                <Clock className="w-6 h-6 text-[#00A3FF]" />
              </div>
              <h3 className="text-2xl font-bold dark:text-white">3</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Years at University</p>
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
    </main>
  );
}

export default Profile;