import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getAllClasses, 
  getStudentClasses, 
  getProfessorClasses,
  getClassById
} from '../services/classService';
import { Class } from '../models/types';

interface ClassContextType {
  classes: Class[];
  loading: boolean;
  error: string | null;
  refreshClasses: () => Promise<void>;
  getClassDetails: (classId: string) => Promise<Class | null>;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export function ClassProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchClasses = async () => {
    if (!currentUser) {
      console.log('No user signed in, skipping class fetch');
      setClasses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let fetchedClasses: Class[] = [];
      
      console.log('Fetching classes for user:', currentUser.id, 'with role:', currentUser.role);
      
      if (currentUser.role === 'student') {
        fetchedClasses = await getStudentClasses(currentUser.id);
      } else if (currentUser.role === 'professor') {
        fetchedClasses = await getProfessorClasses(currentUser.id);
      } else {
        // Default to fetching all classes if role is not recognized
        fetchedClasses = await getAllClasses();
      }
      
      console.log('Fetched classes:', fetchedClasses);
      setClasses(fetchedClasses);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [currentUser]);

  const refreshClasses = async () => {
    await fetchClasses();
  };

  const getClassDetails = async (classId: string): Promise<Class | null> => {
    try {
      return await getClassById(classId);
    } catch (err) {
      console.error('Error fetching class details:', err);
      setError('Failed to load class details');
      return null;
    }
  };

  const value = {
    classes,
    loading,
    error,
    refreshClasses,
    getClassDetails
  };

  return (
    <ClassContext.Provider value={value}>
      {children}
    </ClassContext.Provider>
  );
}

export function useClasses() {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClasses must be used within a ClassProvider');
  }
  return context;
} 