import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { User, UserRole } from '../models/types';

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  displayName: string,
  role: UserRole
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    const userData: Omit<User, 'id'> = {
      email: user.email || email,
      displayName,
      role,
      photoURL: user.photoURL || undefined,
      createdAt: new Date(),
    };
    
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: serverTimestamp()
    });
    
    return {
      id: user.uid,
      ...userData
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return { 
        id: user.uid, 
        ...userDoc.data() as Omit<User, 'id'>,
        createdAt: (userDoc.data().createdAt?.toDate() as Date) || new Date()
      };
    } else {
      throw new Error('User document not found');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Get current user data
export const getCurrentUser = async (user: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return { 
        id: user.uid, 
        ...userDoc.data() as Omit<User, 'id'>,
        createdAt: (userDoc.data().createdAt?.toDate() as Date) || new Date()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
}; 