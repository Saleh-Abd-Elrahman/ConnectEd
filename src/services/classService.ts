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
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Class, Subgroup } from '../models/types';

// Get all classes
export const getAllClasses = async (): Promise<Class[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'classes'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Class, 'id'>
    }));
  } catch (error) {
    console.error('Error getting all classes:', error);
    throw error;
  }
};

// Get classes taught by a professor
export const getProfessorClasses = async (professorId: string): Promise<Class[]> => {
  try {
    const q = query(collection(db, 'classes'), where('instructorId', '==', professorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Class, 'id'>
    }));
  } catch (error) {
    console.error('Error getting professor classes:', error);
    throw error;
  }
};

// Get classes a student is enrolled in
export const getStudentClasses = async (studentId: string): Promise<Class[]> => {
  try {
    const q = query(
      collection(db, 'classes'),
      where('enrolledStudents', 'array-contains', studentId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Class, 'id'>
    }));
  } catch (error) {
    console.error('Error getting student classes:', error);
    throw error;
  }
};

// Create a new class
export const createClass = async (classData: Omit<Class, 'id'>): Promise<Class> => {
  try {
    const docRef = await addDoc(collection(db, 'classes'), {
      ...classData,
      createdAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...classData
    };
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

// Get a single class by ID
export const getClassById = async (classId: string): Promise<Class | null> => {
  try {
    const docRef = doc(db, 'classes', classId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data() as Omit<Class, 'id'>
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting class by ID:', error);
    throw error;
  }
};

// Update a class
export const updateClass = async (classId: string, classData: Partial<Omit<Class, 'id'>>): Promise<void> => {
  try {
    const classRef = doc(db, 'classes', classId);
    await updateDoc(classRef, classData);
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

// Delete a class
export const deleteClass = async (classId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'classes', classId));
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
};

// Add a student to a class
export const enrollStudentInClass = async (classId: string, studentId: string): Promise<void> => {
  try {
    const classRef = doc(db, 'classes', classId);
    await updateDoc(classRef, {
      enrolledStudents: arrayUnion(studentId)
    });
  } catch (error) {
    console.error('Error enrolling student in class:', error);
    throw error;
  }
};

// Remove a student from a class
export const removeStudentFromClass = async (classId: string, studentId: string): Promise<void> => {
  try {
    const classRef = doc(db, 'classes', classId);
    await updateDoc(classRef, {
      enrolledStudents: arrayRemove(studentId)
    });
  } catch (error) {
    console.error('Error removing student from class:', error);
    throw error;
  }
};

// Create a subgroup in a class
export const createSubgroup = async (
  classId: string, 
  subgroupData: Omit<Subgroup, 'id' | 'classId'>
): Promise<Subgroup> => {
  try {
    // Get current class data
    const classRef = doc(db, 'classes', classId);
    const classSnap = await getDoc(classRef);
    
    if (!classSnap.exists()) {
      throw new Error('Class not found');
    }
    
    const classData = classSnap.data() as Omit<Class, 'id'>;
    const newSubgroup: Subgroup = {
      id: `${classId}_sg_${Date.now()}`, // Generate an ID
      classId,
      ...subgroupData
    };
    
    // Add new subgroup to the class
    await updateDoc(classRef, {
      subgroups: [...(classData.subgroups || []), newSubgroup]
    });
    
    return newSubgroup;
  } catch (error) {
    console.error('Error creating subgroup:', error);
    throw error;
  }
};

// Update a subgroup
export const updateSubgroup = async (
  classId: string,
  subgroupId: string,
  subgroupData: Partial<Omit<Subgroup, 'id' | 'classId'>>
): Promise<void> => {
  try {
    // Get current class data
    const classRef = doc(db, 'classes', classId);
    const classSnap = await getDoc(classRef);
    
    if (!classSnap.exists()) {
      throw new Error('Class not found');
    }
    
    const classData = classSnap.data() as Omit<Class, 'id'>;
    const subgroups = classData.subgroups || [];
    
    // Update the specific subgroup
    const updatedSubgroups = subgroups.map(sg => 
      sg.id === subgroupId ? { ...sg, ...subgroupData } : sg
    );
    
    await updateDoc(classRef, { subgroups: updatedSubgroups });
  } catch (error) {
    console.error('Error updating subgroup:', error);
    throw error;
  }
}; 