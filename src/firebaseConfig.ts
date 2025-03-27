import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAd-VQioOK8zv01w57uy776qRBe_fIJKd8",
    authDomain: "connected-7256c.firebaseapp.com",
    projectId: "connected-7256c",
    storageBucket: "connected-7256c.firebasestorage.app",
    messagingSenderId: "581519409408",
    appId: "1:581519409408:web:02d026f6a349b3074073e5",
    measurementId: "G-6CG9KWPJZD"
};
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app; 