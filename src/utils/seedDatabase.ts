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
    'cllorente@faculty.ie.edu',
    'vbarbier.ieu2021@student.ie.edu',
    'lbrudniakber.ieu2021@student.ie.edu',
    'ncajiao.ieu2021@student.ie.edu',
    'rdantasmarti.ieu2021@student.ie.edu',
    'cdecarcer.ieu2021@student.ie.edu',
    'mroriz.ieu2021@student.ie.edu',
    'jgarcia.ieu2021@student.ie.edu',
    'dgrechezelko.ieu2021@student.ie.edu',
    'tvonhabsburg.ieu2021@student.ie.edu',
    'nkravchuk.ieu2021@student.ie.edu',
    'clopez.ieu2021@student.ie.edu',
    'elozoya.ieu2021@student.ie.edu',
    'amartin.ieu2021@student.ie.edu',
    'amasquelierp.ieu2021@student.ie.edu',
    'imoral.ieu2021@student.ie.edu',
    'jmorenoz.ieu2021@student.ie.edu',
    'amory.ieu2021@student.ie.edu',
    'rmosconikatc.ieu2021@student.ie.edu',
    'qnguyen.ieu2021@student.ie.edu',
    'aperin.ieu2021@student.ie.edu',
    'mrestrepo.ieu2021@student.ie.edu',
    'asafie.ieu2021@student.ie.edu',
    'ssalinero.ieu2021@student.ie.edu',
    'aschiavolin.ieu2021@student.ie.edu',
    'ssella.ieu2021@student.ie.edu',
    'rsiddiqui.ieu2021@student.ie.edu',
    'atopalovic.ieu2021@student.ie.edu',
    'murunuela.ieu2021@student.ie.edu',
    'avalencia.ieu2021@student.ie.edu',
    'cvelasco.ieu2021@student.ie.edu',
    'tyadav.ieu2021@student.ie.edu',
    'etakimoto.ieu2021@student.ie.edu'
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
      id: 'prof_llorente',
      email: 'cllorente@faculty.ie.edu',
      displayName: 'Professor Carlos Llorente',
      role: 'professor',
      department: 'Computer Science',
      officeHours: 'Mondays 3-5pm, Thursdays 2-4pm',
      teachingClasses: ['cs401', 'cs271', 'math301', 'bus271'],
      createdAt: new Date()
    }
  ];
  
  // Students
  const students: Student[] = [
    {
      id: 'student_vbarbier',
      email: 'vbarbier.ieu2021@student.ie.edu',
      displayName: 'Victor Barbier',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301', 'bus271'],
      createdAt: new Date()
    },
    {
      id: 'student_lbrudniakber',
      email: 'lbrudniakber.ieu2021@student.ie.edu',
      displayName: 'Lea Brudniak',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_ncajiao',
      email: 'ncajiao.ieu2021@student.ie.edu',
      displayName: 'Nicolas Cajiao',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'cs271'],
      createdAt: new Date()
    },
    {
      id: 'student_rdantasmarti',
      email: 'rdantasmarti.ieu2021@student.ie.edu',
      displayName: 'Ricardo Dantas',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_cdecarcer',
      email: 'cdecarcer.ieu2021@student.ie.edu',
      displayName: 'Carlos de Carcer',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'bus271'],
      createdAt: new Date()
    },
    {
      id: 'student_mroriz',
      email: 'mroriz.ieu2021@student.ie.edu',
      displayName: 'Manuel Rodriguez',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_jgarcia',
      email: 'jgarcia.ieu2021@student.ie.edu',
      displayName: 'Jorge Garcia',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs271', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_dgrechezelko',
      email: 'dgrechezelko.ieu2021@student.ie.edu',
      displayName: 'Daria Grechezelko',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_tvonhabsburg',
      email: 'tvonhabsburg.ieu2021@student.ie.edu',
      displayName: 'Tamara von Habsburg',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'bus271'],
      createdAt: new Date()
    },
    {
      id: 'student_nkravchuk',
      email: 'nkravchuk.ieu2021@student.ie.edu',
      displayName: 'Nikita Kravchuk',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_clopez',
      email: 'clopez.ieu2021@student.ie.edu',
      displayName: 'Carlos Lopez',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'cs271'],
      createdAt: new Date()
    },
    {
      id: 'student_elozoya',
      email: 'elozoya.ieu2021@student.ie.edu',
      displayName: 'Eduardo Lozoya',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_amartin',
      email: 'amartin.ieu2021@student.ie.edu',
      displayName: 'Alvaro Martin',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'bus271'],
      createdAt: new Date()
    },
    {
      id: 'student_amasquelierp',
      email: 'amasquelierp.ieu2021@student.ie.edu',
      displayName: 'Alexandre Masquelier',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_imoral',
      email: 'imoral.ieu2021@student.ie.edu',
      displayName: 'Ignacio Moral',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'cs271'],
      createdAt: new Date()
    },
    {
      id: 'student_jmorenoz',
      email: 'jmorenoz.ieu2021@student.ie.edu',
      displayName: 'Javier Moreno',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_amory',
      email: 'amory.ieu2021@student.ie.edu',
      displayName: 'Alexandre Mory',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'bus271'],
      createdAt: new Date()
    },
    {
      id: 'student_rmosconikatc',
      email: 'rmosconikatc.ieu2021@student.ie.edu',
      displayName: 'Riccardo Mosconi',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_qnguyen',
      email: 'qnguyen.ieu2021@student.ie.edu',
      displayName: 'Quoc Nguyen',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'cs271'],
      createdAt: new Date()
    },
    {
      id: 'student_aperin',
      email: 'aperin.ieu2021@student.ie.edu',
      displayName: 'Alvaro Perin',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_mrestrepo',
      email: 'mrestrepo.ieu2021@student.ie.edu',
      displayName: 'Maria Restrepo',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'bus271'],
      createdAt: new Date()
    },
    {
      id: 'student_asafie',
      email: 'asafie.ieu2021@student.ie.edu',
      displayName: 'Alexandru Safie',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_ssalinero',
      email: 'ssalinero.ieu2021@student.ie.edu',
      displayName: 'Sofia Salinero',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'cs271'],
      createdAt: new Date()
    },
    {
      id: 'student_aschiavolin',
      email: 'aschiavolin.ieu2021@student.ie.edu',
      displayName: 'Alberto Schiavolin',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_ssella',
      email: 'ssella.ieu2021@student.ie.edu',
      displayName: 'Sara Sella',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'bus271'],
      createdAt: new Date()
    },
    {
      id: 'student_rsiddiqui',
      email: 'rsiddiqui.ieu2021@student.ie.edu',
      displayName: 'Raza Siddiqui',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_atopalovic',
      email: 'atopalovic.ieu2021@student.ie.edu',
      displayName: 'Aleksa Topalovic',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'cs271'],
      createdAt: new Date()
    },
    {
      id: 'student_murunuela',
      email: 'murunuela.ieu2021@student.ie.edu',
      displayName: 'Marcos Urunuela',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_avalencia',
      email: 'avalencia.ieu2021@student.ie.edu',
      displayName: 'Alejandro Valencia',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'bus271'],
      createdAt: new Date()
    },
    {
      id: 'student_cvelasco',
      email: 'cvelasco.ieu2021@student.ie.edu',
      displayName: 'Carmen Velasco',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
      createdAt: new Date()
    },
    {
      id: 'student_tyadav',
      email: 'tyadav.ieu2021@student.ie.edu',
      displayName: 'Tanay Yadav',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'cs271'],
      createdAt: new Date()
    },
    {
      id: 'student_etakimoto',
      email: 'etakimoto.ieu2021@student.ie.edu',
      displayName: 'Emilie Takimoto',
      role: 'student',
      major: 'Computer Science',
      year: 3,
      enrolledClasses: ['cs401', 'math301'],
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
  // Collect all student IDs
  const studentIds = [
    'student_vbarbier',
    'student_lbrudniakber',
    'student_ncajiao',
    'student_rdantasmarti',
    'student_cdecarcer',
    'student_mroriz',
    'student_jgarcia',
    'student_dgrechezelko',
    'student_tvonhabsburg',
    'student_nkravchuk',
    'student_clopez',
    'student_elozoya',
    'student_amartin',
    'student_amasquelierp',
    'student_imoral',
    'student_jmorenoz',
    'student_amory',
    'student_rmosconikatc',
    'student_qnguyen',
    'student_aperin',
    'student_mrestrepo',
    'student_asafie',
    'student_ssalinero',
    'student_aschiavolin',
    'student_ssella',
    'student_rsiddiqui',
    'student_atopalovic',
    'student_murunuela',
    'student_avalencia',
    'student_cvelasco',
    'student_tyadav',
    'student_etakimoto'
  ];

  const classes: Class[] = [
    {
      id: 'conflicts101',
      name: 'Conflicts Business and Law',
      instructorId: 'prof_llorente',
      schedule: 'Tue, 10:00AM - 12:00PM',
      description: 'Study of conflicts between business interests and legal frameworks',
      enrolledStudents: studentIds,
      subgroups: [
        {
          id: 'conflicts101_sg_1',
          name: 'Research Group A',
          classId: 'conflicts101',
          lastMessage: 'Please check the new reading materials',
          dueDate: '2025-04-25',
          color: 'bg-blue-500',
          members: studentIds.slice(0, 8) // First 8 students
        },
        {
          id: 'conflicts101_sg_2',
          name: 'Research Group B',
          classId: 'conflicts101',
          lastMessage: 'Case study presentation next week',
          dueDate: '2025-04-27',
          color: 'bg-purple-500',
          members: studentIds.slice(8, 16) // Next 8 students
        },
        {
          id: 'conflicts101_sg_3',
          name: 'Research Group C',
          classId: 'conflicts101',
          lastMessage: 'Draft of final paper due soon',
          dueDate: '2025-04-30',
          color: 'bg-green-500',
          members: studentIds.slice(16, 24) // Next 8 students
        },
        {
          id: 'conflicts101_sg_4',
          name: 'Research Group D',
          classId: 'conflicts101',
          lastMessage: 'Meeting with professor on Thursday',
          dueDate: '2025-05-02',
          color: 'bg-pink-500',
          members: studentIds.slice(24) // Remaining students
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
  const studentIds = [];
  let professorId = '';
  
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.email) {
      // Store professor ID
      if (data.email === 'cllorente@faculty.ie.edu') {
        professorId = doc.id;
        userMap.set('prof_llorente', doc.id);
      }
      
      // Store all student IDs
      if (data.email.includes('@student.ie.edu')) {
        studentIds.push(doc.id);
        
        // Map a few specific students for meetings
        if (data.email === 'vbarbier.ieu2021@student.ie.edu') userMap.set('student_vbarbier', doc.id);
        if (data.email === 'lbrudniakber.ieu2021@student.ie.edu') userMap.set('student_lbrudniakber', doc.id);
        if (data.email === 'ncajiao.ieu2021@student.ie.edu') userMap.set('student_ncajiao', doc.id);
        if (data.email === 'rdantasmarti.ieu2021@student.ie.edu') userMap.set('student_rdantasmarti', doc.id);
      }
    }
  });

  console.log('User ID mapping:', Object.fromEntries(userMap));
  
  // Skip creating meetings if professor not found
  if (!professorId) {
    console.error('Professor ID not found, skipping meeting creation');
    return [];
  }

  const meetings: Meeting[] = [
    {
      id: 'meeting_1',
      studentId: userMap.get('student_vbarbier'),
      professorId: professorId,
      classId: 'conflicts101',
      date: '2025-03-15',
      time: '14:00',
      reason: 'Discuss case study analysis',
      status: 'pending',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      id: 'meeting_2',
      studentId: userMap.get('student_lbrudniakber'),
      professorId: professorId,
      classId: 'conflicts101',
      date: '2025-03-18',
      time: '13:30',
      reason: 'Review research proposal',
      status: 'rejected',
      responseMessage: 'I have a faculty meeting at this time. Please reschedule for next week.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
      id: 'meeting_3',
      studentId: userMap.get('student_ncajiao'),
      professorId: professorId,
      classId: 'conflicts101',
      date: '2025-03-20',
      time: '15:00',
      reason: 'Discuss research methodology',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: 'meeting_4',
      studentId: userMap.get('student_rdantasmarti'),
      professorId: professorId,
      classId: 'conflicts101',
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
  // Get user IDs
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const userMap = new Map<string, string>();
  const userEmails = new Map<string, string>();
  const userNames = new Map<string, string>();
  const allStudentIds: string[] = [];
  
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.email) {
      // Store the user ID, display name and map by email
      userMap.set(data.email, doc.id);
      userNames.set(doc.id, data.displayName);
      
      if (data.email === 'cllorente@faculty.ie.edu') {
        userMap.set('prof_llorente', doc.id);
      }
      
      // Collect student IDs for student-to-student chats
      if (data.email.includes('@student.ie.edu')) {
        allStudentIds.push(doc.id);
        userEmails.set(doc.id, data.email);
      }
    }
  });
  
  const professorId = userMap.get('cllorente@faculty.ie.edu') || '';
  
  if (!professorId || allStudentIds.length < 5) {
    console.error('Missing user IDs for chats, skipping chat creation');
    return { chats: [], messages: [] };
  }
  
  // Create all chats
  const chats = [];
  const messages = [];
  
  // 1. Create AI chat for each student
  for (const studentId of allStudentIds) {
    const studentName = userNames.get(studentId) || 'Student';
    const chatId = `ai_chat_${studentId}`;
    
    chats.push({
      id: chatId,
      participants: [studentId, 'AI_ASSISTANT'],
      lastMessage: {
        senderId: 'AI_ASSISTANT',
        text: `Hello ${studentName}, I'm Ed AI. How can I help you today?`,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      type: 'ai'
    });
    
    messages.push({
      id: `${chatId}_msg_1`,
      chatId: chatId,
      senderId: 'AI_ASSISTANT',
      text: `Hello ${studentName}, I'm Ed AI. How can I help you today?`,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: true
    });
  }
  
  // 2. Create student-to-professor chats (at least 5)
  const studentsForProfessorChats = allStudentIds.slice(0, 10);
  for (let i = 0; i < studentsForProfessorChats.length; i++) {
    const studentId = studentsForProfessorChats[i];
    const studentName = userNames.get(studentId) || 'Student';
    const chatId = `prof_student_${i}`;
    const timeOffset = (i + 1) * 24 * 60 * 60 * 1000; // Different times for each chat
    
    chats.push({
      id: chatId,
      participants: [studentId, professorId],
      lastMessage: {
        senderId: i % 2 === 0 ? professorId : studentId,
        text: i % 2 === 0 
          ? `Please submit your assignment by Friday.`
          : `Thank you for the feedback on my research proposal!`,
        timestamp: new Date(Date.now() - timeOffset)
      },
      createdAt: new Date(Date.now() - (timeOffset + 5 * 24 * 60 * 60 * 1000)),
      type: 'direct'
    });
    
    // Add a few messages to each chat
    const msgCount = Math.floor(Math.random() * 3) + 2; // 2-4 messages per chat
    for (let j = 0; j < msgCount; j++) {
      const isSentByProfessor = j % 2 === 0;
      messages.push({
        id: `${chatId}_msg_${j}`,
        chatId: chatId,
        senderId: isSentByProfessor ? professorId : studentId,
        text: isSentByProfessor 
          ? ["How is your project going?", "Please submit your assignment by Friday.", "Would you like to schedule a meeting?"][j % 3]
          : ["I'm making good progress!", "Thank you for the feedback on my research proposal!", "Yes, I would like to schedule a meeting."][j % 3],
        timestamp: new Date(Date.now() - timeOffset + (j * 60 * 60 * 1000)), // Spread out by hours
        read: true
      });
    }
  }
  
  // 3. Create student-to-student chats
  // Create a few group chats for subgroups
  const subgroupIds = ['conflicts101_sg_1', 'conflicts101_sg_2', 'conflicts101_sg_3', 'conflicts101_sg_4'];
  
  for (let i = 0; i < subgroupIds.length; i++) {
    const subgroupId = subgroupIds[i];
    const startIdx = i * 8;
    const endIdx = Math.min(startIdx + 8, allStudentIds.length);
    const subgroupStudents = allStudentIds.slice(startIdx, endIdx);
    
    const chatId = `group_${subgroupId}`;
    const randomStudentIdx = Math.floor(Math.random() * subgroupStudents.length);
    const randomStudentId = subgroupStudents[randomStudentIdx];
    
    if (subgroupStudents.length > 1) {
      chats.push({
        id: chatId,
        participants: subgroupStudents,
        lastMessage: {
          senderId: randomStudentId,
          text: ["Everyone ready for the presentation?", "I've uploaded the latest files", "Don't forget the meeting tomorrow", "Has anyone started on the case study?"][i % 4],
          timestamp: new Date(Date.now() - (i + 1) * 12 * 60 * 60 * 1000) // Different times
        },
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        type: 'group',
        groupName: `Research Group ${String.fromCharCode(65 + i)}`, // A, B, C, D
        classId: 'conflicts101'
      });
      
      // Add some messages to the group chat
      for (let j = 0; j < 5; j++) {
        const randomSenderIdx = Math.floor(Math.random() * subgroupStudents.length);
        const senderId = subgroupStudents[randomSenderIdx];
        
        messages.push({
          id: `${chatId}_msg_${j}`,
          chatId: chatId,
          senderId: senderId,
          text: [
            "Hi everyone, how's the project going?",
            "I've added my section to the document",
            "Can we meet tomorrow to discuss the next steps?",
            "Has anyone found any good sources for the research?",
            "I'm having trouble with the analysis part, can someone help?"
          ][j],
          timestamp: new Date(Date.now() - (i * 24 * 60 * 60 * 1000) - (j * 3 * 60 * 60 * 1000)),
          read: j < 3 // Older messages are read
        });
      }
    }
  }
  
  // 4. Create some direct student-to-student chats
  for (let i = 0; i < 15; i++) {
    const student1Idx = Math.floor(Math.random() * allStudentIds.length);
    let student2Idx = Math.floor(Math.random() * allStudentIds.length);
    
    // Make sure we don't create a chat with yourself
    while (student2Idx === student1Idx) {
      student2Idx = Math.floor(Math.random() * allStudentIds.length);
    }
    
    const student1Id = allStudentIds[student1Idx];
    const student2Id = allStudentIds[student2Idx];
    
    const chatId = `student_direct_${i}`;
    const timeOffset = Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000;
    
    chats.push({
      id: chatId,
      participants: [student1Id, student2Id],
      lastMessage: {
        senderId: Math.random() > 0.5 ? student1Id : student2Id,
        text: [
          "See you in class tomorrow!",
          "Thanks for your help with the assignment",
          "Did you understand the professor's explanation?",
          "Can you share your notes from today's lecture?",
          "Are you going to the study group later?"
        ][i % 5],
        timestamp: new Date(Date.now() - timeOffset)
      },
      createdAt: new Date(Date.now() - (timeOffset + 15 * 24 * 60 * 60 * 1000)),
      type: 'direct'
    });
    
    // Add a few messages to each direct chat
    const msgCount = Math.floor(Math.random() * 4) + 2; // 2-5 messages
    for (let j = 0; j < msgCount; j++) {
      const senderId = j % 2 === 0 ? student1Id : student2Id;
      
      messages.push({
        id: `${chatId}_msg_${j}`,
        chatId: chatId,
        senderId: senderId,
        text: [
          "Hey, how's it going?",
          "Do you have time to review my part of the project?",
          "Are you going to the lecture tomorrow?",
          "I found a great resource for our research",
          "Let's meet at the library to study",
          "Did you understand what the professor meant about the case study?"
        ][Math.floor(Math.random() * 6)],
        timestamp: new Date(Date.now() - timeOffset + (j * 30 * 60 * 1000)), // Spread out by 30 minutes
        read: j < msgCount - (Math.floor(Math.random() * 2)) // Some recent messages might be unread
      });
    }
  }
  
  // Save all chats and messages to Firestore
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
  // Get user IDs
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const userMap = new Map();
  
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.email) {
      if (data.email === 'cllorente@faculty.ie.edu') {
        userMap.set('prof_llorente', doc.id);
      }
      if (data.email === 'vbarbier.ieu2021@student.ie.edu') {
        userMap.set('student_vbarbier', doc.id);
      }
      if (data.email === 'lbrudniakber.ieu2021@student.ie.edu') {
        userMap.set('student_lbrudniakber', doc.id);
      }
      if (data.email === 'ncajiao.ieu2021@student.ie.edu') {
        userMap.set('student_ncajiao', doc.id);
      }
      if (data.email === 'rdantasmarti.ieu2021@student.ie.edu') {
        userMap.set('student_rdantasmarti', doc.id);
      }
    }
  });
  
  const professorId = userMap.get('prof_llorente') || '';
  const student1Id = userMap.get('student_vbarbier') || '';
  const student2Id = userMap.get('student_lbrudniakber') || '';
  const student3Id = userMap.get('student_ncajiao') || '';
  const student4Id = userMap.get('student_rdantasmarti') || '';
  
  if (!professorId || !student1Id || !student2Id || !student3Id || !student4Id) {
    console.error('Missing user IDs for notifications, skipping notification creation');
    return [];
  }
  
  const notifications: Notification[] = [
    {
      id: 'notif_1',
      userId: student4Id,
      title: 'Meeting Request Status',
      message: 'Professor Llorente has accepted your meeting request.',
      read: false,
      type: 'meeting',
      relatedId: 'meeting_4',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
      id: 'notif_2',
      userId: student2Id,
      title: 'Meeting Request Status',
      message: 'Professor Llorente has rejected your meeting request. Please reschedule.',
      read: true,
      type: 'meeting',
      relatedId: 'meeting_2',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
    },
    {
      id: 'notif_3',
      userId: student3Id,
      title: 'New Assignment',
      message: 'A new assignment has been posted in Conflicts Business and Law.',
      read: false,
      type: 'class',
      relatedId: 'conflicts101',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: 'notif_4',
      userId: student1Id,
      title: 'New Message',
      message: 'You have a new message from Professor Llorente.',
      read: false,
      type: 'chat',
      relatedId: 'chat_1',
      timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) // 9 days ago
    },
    {
      id: 'notif_5',
      userId: professorId,
      title: 'New Meeting Request',
      message: 'Victor Barbier has requested a meeting.',
      read: true,
      type: 'meeting',
      relatedId: 'meeting_1',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      id: 'notif_6',
      userId: professorId,
      title: 'New Meeting Request',
      message: 'Nicolas Cajiao has requested a meeting.',
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