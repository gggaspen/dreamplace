/**
 * Firebase Configuration
 * Initializes Firebase services for authentication
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA913BIgo1rvgH-iZ3n_o_qgVIwIpjwEk0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dreamplace-front.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dreamplace-front",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dreamplace-front.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "379558549848",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:379558549848:web:6c64b4e39fc3cdda43ad2d",
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  // Connect to emulator in development
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
    if (useEmulator && !auth.config.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw error;
}

export { app as firebaseApp, auth as firebaseAuth };

// Re-export Firebase auth types for convenience
export type { User as FirebaseUser, Auth } from 'firebase/auth';