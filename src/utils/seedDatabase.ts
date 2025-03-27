import { 
  collection, 
  doc, 
  setDoc, 
  Timestamp, 
  getDocs, 
  writeBatch, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  deleteUser
} from 'firebase/auth';
import { db } from '../firebaseConfig';
import { 
  User, 
  Student, 
  Professor, 
  Class, 
  Meeting, 
  Chat, 
  Message, 
  Notification 
} from '../models/types';

// Clear existing data (use with caution!)
export const clearDatabase = async () => {
  const collections = ['users', 'classes', 'meetings', 'chats', 'messages', 'notifications'];
  const auth = getAuth();
  
  // First, try to delete the demo users from Firebase Auth
  const demoEmails = [
    'sarah.chen@university.edu',
    'david.johnson@university.edu',
    'liam.morgan@university.edu',
    'alex.johnson@university.edu',
    'emma.wilson@university.edu',
    'michael.brown@university.edu'
  ];
  
  for (const email of demoEmails) {
    try {
      // Try to sign in as the user
      const userCredential = await signInWithEmailAndPassword(auth, email, 'password123');
      // Delete the user
      await deleteUser(userCredential.user);
      console.log(`Deleted user ${email} from Firebase Auth`);
    } catch (error) {
      console.log(`Could not delete user ${email} from Firebase Auth:`, error);
    }
  }
  
  // Then clear Firestore collections
  for (const collectionName of collections) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((document) => {
      batch.delete(doc(db, collectionName, document.id));
    });
    
    await batch.commit();
    console.log(`Cleared collection: ${collectionName}`);
  }
};

// Seed users (both students and professors)
export const seedUsers = async () => {
  const auth = getAuth();
  const defaultPassword = 'password123';
  const userMap = new Map();
  
  // Professors
  const professors: Professor[] = [
    {
      id: 'prof_chen',
      email: 'sarah.chen@university.edu',
      displayName: 'Professor Sarah Chen',
      role: 'professor',
      department: 'Computer Science',
      officeHours: 'Mondays 3-5pm, Thursdays 2-4pm',
      teachingClasses: ['cs401', 'cs271'],
      createdAt: new Date()
    },
    {
      id: 'prof_johnson',
      email: 'david.johnson@university.edu',
      displayName: 'Professor David Johnson',
      role: 'professor',
      department: 'Mathematics',
      officeHours: 'Tuesdays 1-3pm, Fridays 11am-1pm',
      teachingClasses: ['math301'],
      createdAt: new Date()
    },
    {
      id: 'prof_morgan',
      email: 'liam.morgan@university.edu',
      displayName: 'Professor Liam Morgan',
      role: 'professor',
      department: 'Business',
      officeHours: 'Wednesdays 10am-12pm, Fridays 2-4pm',
      teachingClasses: ['bus271'],
      createdAt: new Date()
    }
  ];
  
  // Students
  const students: Student[] = [
    {
      id: 'student_alex',
      email: 'alex.johnson@university.edu',
      displayName: 'Alex Johnson',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301', 'bus271'],
      createdAt: new Date()
    },
    {
      id: 'student_emma',
      email: 'emma.wilson@university.edu',
      displayName: 'Emma Wilson',
      role: 'student',
      major: 'Economics',
      year: 2,
      enrolledClasses: ['math301', 'bus271'],
      createdAt: new Date()
    },
    {
      id: 'student_michael',
      email: 'michael.brown@university.edu',
      displayName: 'Michael Brown',
      role: 'student',
      major: 'Business',
      year: 4,
      enrolledClasses: ['cs271', 'bus271'],
      createdAt: new Date()
    }
  ];

  // Create all users
  for (const user of [...professors, ...students]) {
    try {
      // Try to create Auth account
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          defaultPassword
        );
        console.log(`Created Auth account for ${user.email}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          // Get existing user data
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const existingUser = usersSnapshot.docs.find(doc => doc.data().email === user.email);
          if (existingUser) {
            userMap.set(user.id, existingUser.id);
            console.log(`Found existing user ${user.email} with ID ${existingUser.id}`);
            continue;
          }
        }
        console.error(`Error creating user ${user.email}:`, error);
        continue;
      }
      
      // Store the mapping of old ID to Firebase Auth UID
      userMap.set(user.id, userCredential.user.uid);
      
      // Create Firestore document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...user,
        id: userCredential.user.uid,
        createdAt: serverTimestamp()
      });
      console.log(`Created Firestore document for ${user.email}`);
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }
  
  console.log('Users seeded successfully');
  return userMap;
};

// Seed classes
export const seedClasses = async () => {
  const classes: Class[] = [
    {
      id: 'cs401',
      name: 'Data Science 401',
      instructorId: 'prof_chen',
      schedule: 'Mon, 2:00PM - 4:00PM',
      description: 'Advanced topics in data science and machine learning',
      enrolledStudents: ['student_alex', 'student_michael'],
      subgroups: [
        {
          id: 'cs401_sg_1',
          name: 'Analysis Team',
          classId: 'cs401',
          lastMessage: 'Alex: Updated the dataset preprocessing code',
          dueDate: '2025-10-20',
          color: 'bg-purple-500',
          members: ['student_alex', 'student_michael']
        },
        {
          id: 'cs401_sg_2',
          name: 'Visualization Team',
          classId: 'cs401',
          lastMessage: 'Emma: New dashboard mockups ready for review',
          dueDate: '2025-10-22',
          color: 'bg-green-500',
          members: ['student_michael']
        }
      ]
    },
    {
      id: 'math301',
      name: 'Advanced Calculus 301',
      instructorId: 'prof_johnson',
      schedule: 'Tue, 10:00AM - 12:00PM',
      description: 'Multivariable calculus and differential equations',
      enrolledStudents: ['student_alex', 'student_emma'],
      subgroups: [
        {
          id: 'math301_sg_1',
          name: 'Homework Group A',
          classId: 'math301',
          lastMessage: 'Emma: I finished problems 1-5',
          dueDate: '2025-10-25',
          color: 'bg-blue-500',
          members: ['student_alex', 'student_emma']
        }
      ]
    },
    {
      id: 'cs271',
      name: 'Software Engineering 271',
      instructorId: 'prof_chen',
      schedule: 'Wed, 11:00AM - 1:00PM',
      description: 'Fundamentals of software engineering and project management',
      enrolledStudents: ['student_michael'],
      subgroups: [
        {
          id: 'cs271_sg_1',
          name: 'Project Team Alpha',
          classId: 'cs271',
          lastMessage: 'Michael: PR ready for review',
          dueDate: '2025-10-27',
          color: 'bg-pink-500',
          members: ['student_michael']
        }
      ]
    },
    {
      id: 'bus271',
      name: 'Funding 271',
      instructorId: 'prof_morgan',
      schedule: 'Fri, 9:30AM - 10:30AM',
      description: 'Introduction to business funding and financial strategies',
      enrolledStudents: ['student_alex', 'student_emma'],
      subgroups: [
        {
          id: 'bus271_sg_1',
          name: 'Group 1',
          classId: 'bus271',
          lastMessage: 'Emma: I\'ve submitted our report!',
          dueDate: '2025-10-24',
          color: 'bg-blue-500',
          members: ['student_alex', 'student_emma']
        }
      ]
    }
  ];
  
  for (const classItem of classes) {
    try {
      await setDoc(doc(db, 'classes', classItem.id), {
        ...classItem,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error(`Error seeding class ${classItem.id}:`, error);
      throw error;
    }
  }
  
  console.log('Classes seeded successfully:', classes.length);
  
  return classes;
};

// Seed meetings
export const seedMeetings = async () => {
  // First, get the actual Firebase Auth UIDs for our users
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const userMap = new Map();
  
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.email) {
      // Map the email to the actual Firebase Auth UID
      if (data.email === 'alex.johnson@university.edu') userMap.set('student_alex', doc.id);
      if (data.email === 'emma.wilson@university.edu') userMap.set('student_emma', doc.id);
      if (data.email === 'michael.brown@university.edu') userMap.set('student_michael', doc.id);
      if (data.email === 'sarah.chen@university.edu') userMap.set('prof_chen', doc.id);
      if (data.email === 'david.johnson@university.edu') userMap.set('prof_johnson', doc.id);
      if (data.email === 'liam.morgan@university.edu') userMap.set('prof_morgan', doc.id);
    }
  });

  console.log('User ID mapping:', Object.fromEntries(userMap));

  const meetings: Meeting[] = [
    {
      id: 'meeting_1',
      studentId: userMap.get('student_alex'),
      professorId: userMap.get('prof_chen'),
      classId: 'cs401',
      date: '2025-03-15',
      time: '14:00',
      reason: 'Discuss project proposal',
      status: 'pending',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      id: 'meeting_2',
      studentId: userMap.get('student_emma'),
      professorId: userMap.get('prof_johnson'),
      classId: 'math301',
      date: '2025-03-18',
      time: '13:30',
      reason: 'Career guidance discussion',
      status: 'rejected',
      responseMessage: 'I have a faculty meeting at this time. Please reschedule for next week.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
      id: 'meeting_3',
      studentId: userMap.get('student_michael'),
      professorId: userMap.get('prof_chen'),
      classId: 'cs271',
      date: '2025-03-20',
      time: '15:00',
      reason: 'Discuss research methodology',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: 'meeting_4',
      studentId: userMap.get('student_alex'),
      professorId: userMap.get('prof_johnson'),
      classId: 'math301',
      date: '2025-03-16',
      time: '11:00',
      reason: 'Review assignment feedback',
      status: 'accepted',
      responseMessage: 'Looking forward to our meeting!',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
    }
  ];
  
  for (const meeting of meetings) {
    if (!meeting.studentId || !meeting.professorId) {
      console.error('Missing user ID for meeting:', meeting);
      continue;
    }
    
    await setDoc(doc(db, 'meetings', meeting.id), {
      ...meeting,
      createdAt: Timestamp.fromDate(meeting.createdAt)
    });
  }
  
  console.log('Meetings seeded successfully:', meetings.length);
  
  return meetings;
};

// Seed chat conversations and messages
export const seedChats = async () => {
  // Create chat conversations
  const chats: Chat[] = [
    {
      id: 'chat_1',
      participants: ['student_alex', 'prof_chen'],
      lastMessage: {
        senderId: 'student_alex',
        text: 'Thank you for the feedback on my project proposal!',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
    },
    {
      id: 'chat_2',
      participants: ['student_emma', 'prof_johnson'],
      lastMessage: {
        senderId: 'prof_johnson',
        text: 'Please submit your assignment by Friday.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
    }
  ];
  
  for (const chat of chats) {
    await setDoc(doc(db, 'chats', chat.id), {
      ...chat,
      lastMessage: chat.lastMessage ? {
        ...chat.lastMessage,
        timestamp: Timestamp.fromDate(chat.lastMessage.timestamp)
      } : null,
      createdAt: Timestamp.fromDate(chat.createdAt)
    });
  }
  
  // Create messages
  const messages: Message[] = [
    // Chat 1 messages
    {
      id: 'msg_1_1',
      chatId: 'chat_1',
      senderId: 'student_alex',
      text: 'Hello Professor, I wanted to discuss my project proposal for the data science class.',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      read: true
    },
    {
      id: 'msg_1_2',
      chatId: 'chat_1',
      senderId: 'prof_chen',
      text: 'Hi Alex, I have reviewed your proposal and have some feedback for you.',
      timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
      read: true
    },
    {
      id: 'msg_1_3',
      chatId: 'chat_1',
      senderId: 'prof_chen',
      text: 'Your topic is interesting, but I suggest narrowing the scope a bit to make it more manageable.',
      timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 60000), // 9 days ago + 1 minute
      read: true
    },
    {
      id: 'msg_1_4',
      chatId: 'chat_1',
      senderId: 'student_alex',
      text: 'Thank you for the feedback on my project proposal!',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: false
    },
    
    // Chat 2 messages
    {
      id: 'msg_2_1',
      chatId: 'chat_2',
      senderId: 'student_emma',
      text: 'Professor Johnson, I have a question about the last homework assignment.',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      read: true
    },
    {
      id: 'msg_2_2',
      chatId: 'chat_2',
      senderId: 'prof_johnson',
      text: 'What is your question, Emma?',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      read: true
    },
    {
      id: 'msg_2_3',
      chatId: 'chat_2',
      senderId: 'student_emma',
      text: 'I am having trouble with problem 5. Could you provide some hints on how to approach it?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true
    },
    {
      id: 'msg_2_4',
      chatId: 'chat_2',
      senderId: 'prof_johnson',
      text: 'Please submit your assignment by Friday.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: false
    }
  ];
  
  for (const message of messages) {
    await setDoc(doc(db, 'messages', message.id), {
      ...message,
      timestamp: Timestamp.fromDate(message.timestamp)
    });
  }
  
  console.log('Chats and messages seeded successfully:', {
    chats: chats.length,
    messages: messages.length
  });
  
  return { chats, messages };
};

// Seed notifications
export const seedNotifications = async () => {
  const notifications: Notification[] = [
    {
      id: 'notif_1',
      userId: 'student_alex',
      title: 'Meeting Request Status',
      message: 'Professor Johnson has accepted your meeting request.',
      read: false,
      type: 'meeting',
      relatedId: 'meeting_4',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
      id: 'notif_2',
      userId: 'student_emma',
      title: 'Meeting Request Status',
      message: 'Professor Johnson has rejected your meeting request. Please reschedule.',
      read: true,
      type: 'meeting',
      relatedId: 'meeting_2',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
    },
    {
      id: 'notif_3',
      userId: 'student_michael',
      title: 'New Assignment',
      message: 'A new assignment has been posted in Software Engineering 271.',
      read: false,
      type: 'class',
      relatedId: 'cs271',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: 'notif_4',
      userId: 'student_alex',
      title: 'New Message',
      message: 'You have a new message from Professor Chen.',
      read: false,
      type: 'chat',
      relatedId: 'chat_1',
      timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) // 9 days ago
    },
    {
      id: 'notif_5',
      userId: 'prof_chen',
      title: 'New Meeting Request',
      message: 'Alex Johnson has requested a meeting.',
      read: true,
      type: 'meeting',
      relatedId: 'meeting_1',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      id: 'notif_6',
      userId: 'prof_chen',
      title: 'New Meeting Request',
      message: 'Michael Brown has requested a meeting.',
      read: false,
      type: 'meeting',
      relatedId: 'meeting_3',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }
  ];
  
  for (const notification of notifications) {
    await setDoc(doc(db, 'notifications', notification.id), {
      ...notification,
      timestamp: Timestamp.fromDate(notification.timestamp)
    });
  }
  
  console.log('Notifications seeded successfully:', notifications.length);
  
  return notifications;
};

// Run all seed functions
export const seedAll = async () => {
  console.log('Starting database seeding...');
  
  // Option to clear existing data first
  await clearDatabase();
  
  const userMap = await seedUsers();
  const classes = await seedClasses();
  const meetings = await seedMeetings();
  const { chats, messages } = await seedChats();
  const notifications = await seedNotifications();
  
  console.log('Database seeding completed successfully!');
  
  return {
    userMap,
    classes,
    meetings,
    chats,
    messages,
    notifications
  };
}; 