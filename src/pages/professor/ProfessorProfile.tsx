import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Phone, MapPin, Globe, BookOpen, Users, Clock, Award, Briefcase, GraduationCap } from 'lucide-react';

function ProfessorProfile() {
  const navigate = useNavigate();

  const professorData = {
    name: "Dr. Sarah Chen",
    title: "Associate Professor of Business Innovation",
    department: "School of Business",
    email: "sarah.chen@ieuniversity.com",
    phone: "+1 (555) 123-4567",
    office: "Room 405, Business Building",
    website: "www.sarahchen.edu",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=800&h=800",
    education: [
      {
        degree: "Ph.D. in Business Administration",
        institution: "Stanford University",
        year: "2015"
      },
      {
        degree: "MBA",
        institution: "Harvard Business School",
        year: "2010"
      },
      {
        degree: "B.Sc. in Economics",
        institution: "University of California, Berkeley",
        year: "2008"
      }
    ],
    expertise: [
      "Business Innovation",
      "Strategic Management",
      "Entrepreneurship",
      "Digital Transformation",
      "Organizational Behavior"
    ],
    currentCourses: [
      {
        code: "BUS 1801",
        name: "Business Innovation",
        students: 28,
        schedule: "Mon, Wed 10:00AM - 11:30AM"
      },
      {
        code: "ECO 401",
        name: "Advanced Economics",
        students: 35,
        schedule: "Tue, Thu 2:00PM - 3:30PM"
      }
    ],
    stats: {
      yearsTeaching: 10,
      totalStudents: 1200,
      publications: 25,
      researchProjects: 8
    },
    officeHours: [
      "Monday: 2:00 PM - 4:00 PM",
      "Wednesday: 2:00 PM - 4:00 PM",
      "Friday: By Appointment"
    ]
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="pb-20">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex flex-col items-center">
          <img
            src={professorData.image}
            alt={professorData.name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-semibold text-center dark:text-white">{professorData.name}</h2>
          <p className="text-[#00A3FF] mt-1">{professorData.title}</p>
          <p className="text-gray-500 dark:text-gray-400">{professorData.department}</p>
        </div>

        {/* Contact Information */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Mail className="w-5 h-5 mr-3" />
            <span>{professorData.email}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Phone className="w-5 h-5 mr-3" />
            <span>{professorData.phone}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="w-5 h-5 mr-3" />
            <span>{professorData.office}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Globe className="w-5 h-5 mr-3" />
            <span>{professorData.website}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center text-[#00A3FF]">
            <BookOpen className="w-5 h-5 mr-2" />
            <span className="text-2xl font-semibold">{professorData.stats.yearsTeaching}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Years Teaching</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center text-[#00A3FF]">
            <Users className="w-5 h-5 mr-2" />
            <span className="text-2xl font-semibold">{professorData.stats.totalStudents}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Students Taught</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center text-[#00A3FF]">
            <Award className="w-5 h-5 mr-2" />
            <span className="text-2xl font-semibold">{professorData.stats.publications}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Publications</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center text-[#00A3FF]">
            <Briefcase className="w-5 h-5 mr-2" />
            <span className="text-2xl font-semibold">{professorData.stats.researchProjects}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Research Projects</p>
        </div>
      </div>

      {/* Current Courses */}
      <div className="p-4">
        <h3 className="text-lg font-semibold dark:text-white mb-3">Current Courses</h3>
        <div className="space-y-3">
          {professorData.currentCourses.map((course, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium dark:text-white">{course.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{course.code}</p>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.schedule}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.students} Students
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="p-4">
        <h3 className="text-lg font-semibold dark:text-white mb-3">Education</h3>
        <div className="space-y-3">
          {professorData.education.map((edu, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-start">
              <GraduationCap className="w-5 h-5 text-[#00A3FF] mr-3 mt-1" />
              <div>
                <h4 className="font-medium dark:text-white">{edu.degree}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{edu.institution}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{edu.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Areas of Expertise */}
      <div className="p-4">
        <h3 className="text-lg font-semibold dark:text-white mb-3">Areas of Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {professorData.expertise.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[#E8F1FF] dark:bg-blue-900/20 text-[#00A3FF] rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Office Hours */}
      <div className="p-4">
        <h3 className="text-lg font-semibold dark:text-white mb-3">Office Hours</h3>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          {professorData.officeHours.map((hours, index) => (
            <div
              key={index}
              className="flex items-center py-2 border-b dark:border-gray-700 last:border-0"
            >
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">{hours}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default ProfessorProfile;