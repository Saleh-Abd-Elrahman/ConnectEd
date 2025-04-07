import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { seedAll } from './seedDatabase';

// Check if a collection has any documents
const isCollectionEmpty = async (collectionName: string): Promise<boolean> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.empty;
  } catch (error) {
    console.error(`Error checking if collection ${collectionName} is empty:`, error);
    throw error;
  }
};

// Check if a specific reference document exists
const doesDocExist = async (collectionName: string, docId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error(`Error checking if document ${docId} exists in ${collectionName}:`, error);
    throw error;
  }
};

// Initialize the application by checking database state and seeding if necessary
export const initializeApp = async (shouldSeedDatabase: boolean = false): Promise<void> => {
  try {
    console.log('Checking database state...');
    
    // Try a simple operation to verify Firebase connection
    try {
      await getDocs(collection(db, 'users'));
      console.log('Successfully connected to Firestore');
    } catch (connError) {
      console.error('Firebase connection error:', connError);
      return Promise.reject(new Error('Failed to connect to database. Check your Firebase configuration.'));
    }
    
    // Check if any of our main collections are empty
    let isUsersEmpty = true;
    let isClassesEmpty = true;
    let studentExists = false;
    let professorExists = false;
    let classExists = false;
    
    try {
      isUsersEmpty = await isCollectionEmpty('users');
      isClassesEmpty = await isCollectionEmpty('classes');
      
      // Check if reference documents exist
      studentExists = await doesDocExist('users', 'student_alex');
      professorExists = await doesDocExist('users', 'prof_chen');
      classExists = await doesDocExist('classes', 'cs401');
    } catch (checkError) {
      console.error('Error checking database state:', checkError);
      // Continue with seeding even if checks fail
    }
    
    const needsSeeding = isUsersEmpty || isClassesEmpty || !studentExists || !professorExists || !classExists;
    
    if (needsSeeding && shouldSeedDatabase) {
      console.log('Database needs initialization. Starting seeding process...');
      try {
        await seedAll();
        console.log('Seeding completed successfully!');
      } catch (seedError) {
        console.error('Error during database seeding:', seedError);
        return Promise.reject(new Error('Failed to seed database. Check console for details.'));
      }
    } else if (needsSeeding) {
      console.log('Database needs initialization but seeding is disabled.');
    } else {
      console.log('Database already initialized!');
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error initializing application:', error);
    return Promise.reject(error);
  }
}; 