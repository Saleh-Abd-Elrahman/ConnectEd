import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { loginUser, logoutUser, getCurrentUser } from '../services/authService';
import { User } from '../models/types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle login
  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log('Attempting login with:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user.email);
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!userDoc.exists()) {
        console.error('User document not found in Firestore');
        throw new Error('User data not found');
      }
      
      const userData = userDoc.data();
      console.log('User data retrieved:', userData);
      console.log('User ID:', userCredential.user.uid);
      console.log('User role:', userData.role);
      
      const user: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        role: userData.role,
        createdAt: userData.createdAt
      };
      
      console.log('Created user object:', user);
      setCurrentUser(user);
      
      // Update last active
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastActive: serverTimestamp()
      });
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        if (error.message.includes('auth/invalid-credential')) {
          throw new Error('Invalid email or password');
        } else if (error.message.includes('auth/too-many-requests')) {
          throw new Error('Too many failed attempts. Please try again later');
        } else if (error.message.includes('auth/user-not-found')) {
          throw new Error('No account found with this email');
        }
      }
      throw new Error('Failed to log in. Please try again.');
    }
  };

  // Handle logout
  const logout = async (): Promise<void> => {
    try {
      setError(null);
      await logoutUser();
      setCurrentUser(null);
    } catch (err) {
      setError('Failed to log out.');
      throw err;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          // User is signed in
          const userData = await getCurrentUser(firebaseUser);
          setCurrentUser(userData);
        } else {
          // User is signed out
          setCurrentUser(null);
        }
      } catch (err) {
        setError('An error occurred while fetching user data.');
        console.error('Auth state change error:', err);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 