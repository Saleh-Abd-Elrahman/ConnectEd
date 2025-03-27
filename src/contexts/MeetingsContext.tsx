import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  createMeeting, 
  updateMeetingStatus, 
  getStudentMeetings, 
  getProfessorMeetings 
} from '../services/meetingService';
import { Meeting, MeetingStatus } from '../models/types';
import { useAuth } from './AuthContext';

interface MeetingsContextType {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  addMeeting: (meeting: Omit<Meeting, 'id' | 'status' | 'createdAt'>) => Promise<Meeting>;
  updateMeetingStatus: (id: string, status: MeetingStatus, responseMessage?: string) => Promise<void>;
  refreshMeetings: () => Promise<void>;
}

const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined);

export function MeetingsProvider({ children }: { children: React.ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const loadMeetings = useCallback(async () => {
    if (!currentUser) {
      console.log('No current user, skipping meeting load');
      return;
    }

    try {
      console.log('Loading meetings for user:', currentUser.id, 'with role:', currentUser.role);
      setLoading(true);
      setError(null);
      
      let fetchedMeetings: Meeting[] = [];
      
      if (currentUser.role === 'student') {
        console.log('Fetching student meetings...');
        fetchedMeetings = await getStudentMeetings(currentUser.id);
      } else if (currentUser.role === 'professor') {
        console.log('Fetching professor meetings...');
        fetchedMeetings = await getProfessorMeetings(currentUser.id);
      }
      
      console.log('Fetched meetings:', fetchedMeetings);
      setMeetings(fetchedMeetings);
    } catch (err) {
      console.error('Error loading meetings:', err);
      setError('Failed to load meetings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load meetings when the user changes
  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  const addMeeting = useCallback(async (meeting: Omit<Meeting, 'id' | 'status' | 'createdAt'>) => {
    try {
      setError(null);
      const newMeeting = await createMeeting(meeting);
      setMeetings(prevMeetings => [...prevMeetings, newMeeting]);
      return newMeeting;
    } catch (err) {
      console.error('Error adding meeting:', err);
      setError('Failed to add meeting. Please try again.');
      throw err;
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: MeetingStatus, responseMessage?: string) => {
    try {
      setError(null);
      await updateMeetingStatus(id, status, responseMessage);
      
      // Update local state
      setMeetings(prevMeetings =>
        prevMeetings.map(meeting =>
          meeting.id === id
            ? { ...meeting, status, responseMessage }
            : meeting
        )
      );
    } catch (err) {
      console.error('Error updating meeting status:', err);
      setError('Failed to update meeting status. Please try again.');
      throw err;
    }
  }, []);

  const refreshMeetings = useCallback(async () => {
    await loadMeetings();
  }, [loadMeetings]);

  return (
    <MeetingsContext.Provider 
      value={{ 
        meetings, 
        loading, 
        error, 
        addMeeting, 
        updateMeetingStatus: updateStatus,
        refreshMeetings
      }}
    >
      {children}
    </MeetingsContext.Provider>
  );
}

export function useMeetings() {
  const context = useContext(MeetingsContext);
  if (context === undefined) {
    throw new Error('useMeetings must be used within a MeetingsProvider');
  }
  return context;
}