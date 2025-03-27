import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Meeting, MeetingStatus } from '../models/types';

// Get all meetings for a student
export const getStudentMeetings = async (studentId: string): Promise<Meeting[]> => {
  try {
    console.log('Starting getStudentMeetings with studentId:', studentId);
    
    // Log the query construction
    const meetingsRef = collection(db, 'meetings');
    console.log('Created meetings collection reference');
    
    const q = query(
      meetingsRef, 
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    console.log('Created query with index requirements:', {
      collection: 'meetings',
      filters: {
        studentId: studentId,
        orderBy: 'createdAt desc'
      }
    });
    
    // Execute query with index monitoring
    console.log('Executing query...');
    const querySnapshot = await getDocs(q);
    console.log('Query executed successfully');
    console.log('Results:', {
      totalDocuments: querySnapshot.size,
      empty: querySnapshot.empty,
      metadata: querySnapshot.metadata
    });
    
    const meetings = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data as Omit<Meeting, 'id' | 'createdAt'>,
        createdAt: (data.createdAt as Timestamp).toDate()
      };
    });
    
    console.log('Successfully processed meetings:', meetings.length);
    return meetings;
  } catch (error) {
    console.error('Error in getStudentMeetings:', error);
    if (error instanceof Error && error.message.includes('indexes?create_composite=')) {
      console.error('Missing index detected. Please ensure indexes are properly deployed.');
    }
    throw error;
  }
};

// Get all meetings for a professor
export const getProfessorMeetings = async (professorId: string): Promise<Meeting[]> => {
  try {
    const q = query(
      collection(db, 'meetings'), 
      where('professorId', '==', professorId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Meeting, 'id' | 'createdAt'>,
      createdAt: (doc.data().createdAt as Timestamp).toDate()
    }));
  } catch (error) {
    console.error('Error getting professor meetings:', error);
    throw error;
  }
};

// Create a new meeting request
export const createMeeting = async (meetingData: Omit<Meeting, 'id' | 'status' | 'createdAt'>): Promise<Meeting> => {
  try {
    const docRef = await addDoc(collection(db, 'meetings'), {
      ...meetingData,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...meetingData,
      status: 'pending',
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

// Update meeting status
export const updateMeetingStatus = async (
  meetingId: string, 
  status: MeetingStatus, 
  responseMessage?: string
): Promise<void> => {
  try {
    const meetingRef = doc(db, 'meetings', meetingId);
    const updateData: Partial<Meeting> = { status };
    
    if (responseMessage) {
      updateData.responseMessage = responseMessage;
    }
    
    await updateDoc(meetingRef, updateData);
  } catch (error) {
    console.error('Error updating meeting status:', error);
    throw error;
  }
};

// Delete a meeting
export const deleteMeeting = async (meetingId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'meetings', meetingId));
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw error;
  }
};

// Get a single meeting by ID
export const getMeetingById = async (meetingId: string): Promise<Meeting | null> => {
  try {
    const docRef = doc(db, 'meetings', meetingId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data() as Omit<Meeting, 'id' | 'createdAt'>,
        createdAt: (docSnap.data().createdAt as Timestamp).toDate()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting meeting by ID:', error);
    throw error;
  }
}; 