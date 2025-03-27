export type UserRole = 'student' | 'professor';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  major?: string;
  year?: number;
  enrolledClasses: string[]; // Array of class IDs
}

export interface Professor extends User {
  role: 'professor';
  department?: string;
  officeHours?: string;
  teachingClasses: string[]; // Array of class IDs
}

export type MeetingStatus = 'pending' | 'accepted' | 'rejected';

export interface Meeting {
  id: string;
  studentId: string;
  professorId: string;
  classId?: string;
  date: string;
  time: string;
  reason: string;
  status: MeetingStatus;
  responseMessage?: string;
  createdAt: Date;
}

export interface Class {
  id: string;
  name: string;
  instructorId: string;
  schedule: string;
  description?: string;
  enrolledStudents: string[]; // Array of student IDs
  subgroups: Subgroup[];
}

export interface Subgroup {
  id: string;
  name: string;
  classId: string;
  lastMessage?: string;
  dueDate?: string;
  color: string;
  members: string[]; // Array of student IDs
}

export interface Chat {
  id: string;
  participants: string[]; // Array of user IDs
  lastMessage?: {
    senderId: string;
    text: string;
    timestamp: Date;
  };
  createdAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'meeting' | 'chat' | 'class' | 'system';
  relatedId?: string; // ID of related item (meeting, chat, etc.)
  timestamp: Date;
} 