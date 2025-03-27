// Seed script to manually populate the Firebase database
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { seedAll } from './src/utils/seedDatabase';

// Your Firebase configuration
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
initializeApp(firebaseConfig);

// Run the seed
async function runSeed() {
  console.log('Starting database seeding...');
  
  try {
    await seedAll();
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
  
  process.exit(0);
}

runSeed(); 