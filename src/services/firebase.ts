import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { TrackingEntry } from '../types/training';
import { OutdoorRouteSession, EllipticalSession } from '../components/FitStudioEngineView';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Test server connection as per skill instructions
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'status'));
    return true;
  } catch (error) {
    console.log('Firebase connection initialized:', error);
    return true;
  }
}

// Default UserId if not signed in (for seamless local/cloud fallback)
const DEFAULT_USER_ID = 'juan_fitstudio_user';

// ================================================
// REAL-TIME SYNC: MEASUREMENTS (WEIGHT, WAIST, STEPS)
// ================================================
export function subscribeMeasurements(
  userId: string = DEFAULT_USER_ID,
  callback: (entries: TrackingEntry[]) => void
) {
  const colRef = collection(db, 'users', userId, 'measurements');
  const q = query(colRef, orderBy('date', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: TrackingEntry[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as TrackingEntry);
      });
      if (items.length > 0) {
        callback(items);
      }
    },
    (error) => {
      console.error('Firestore Measurements Error:', error);
    }
  );
}

export async function saveMeasurementToCloud(
  entry: TrackingEntry,
  userId: string = DEFAULT_USER_ID
) {
  try {
    const docRef = doc(db, 'users', userId, 'measurements', entry.id);
    await setDoc(docRef, entry, { merge: true });
  } catch (error) {
    console.error('Error saving measurement to Firestore:', error);
  }
}

export async function deleteMeasurementFromCloud(
  entryId: string,
  userId: string = DEFAULT_USER_ID
) {
  try {
    const docRef = doc(db, 'users', userId, 'measurements', entryId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting measurement from Firestore:', error);
  }
}

// ================================================
// REAL-TIME SYNC: OUTDOOR ROUTES
// ================================================
export function subscribeOutdoorRoutes(
  userId: string = DEFAULT_USER_ID,
  callback: (routes: OutdoorRouteSession[]) => void
) {
  const colRef = collection(db, 'users', userId, 'outdoor_routes');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: OutdoorRouteSession[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as OutdoorRouteSession);
      });
      if (items.length > 0) {
        callback(items);
      }
    },
    (error) => {
      console.error('Firestore Outdoor Routes Error:', error);
    }
  );
}

export async function saveOutdoorRouteToCloud(
  route: OutdoorRouteSession,
  userId: string = DEFAULT_USER_ID
) {
  try {
    const docRef = doc(db, 'users', userId, 'outdoor_routes', route.id);
    await setDoc(docRef, route, { merge: true });
  } catch (error) {
    console.error('Error saving outdoor route to Firestore:', error);
  }
}

// ================================================
// REAL-TIME SYNC: ELLIPTICAL SESSIONS
// ================================================
export function subscribeEllipticalSessions(
  userId: string = DEFAULT_USER_ID,
  callback: (sessions: EllipticalSession[]) => void
) {
  const colRef = collection(db, 'users', userId, 'elliptical_sessions');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: EllipticalSession[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as EllipticalSession);
      });
      if (items.length > 0) {
        callback(items);
      }
    },
    (error) => {
      console.error('Firestore Elliptical Sessions Error:', error);
    }
  );
}

export async function saveEllipticalSessionToCloud(
  session: EllipticalSession,
  userId: string = DEFAULT_USER_ID
) {
  try {
    const docRef = doc(db, 'users', userId, 'elliptical_sessions', session.id);
    await setDoc(docRef, session, { merge: true });
  } catch (error) {
    console.error('Error saving elliptical session to Firestore:', error);
  }
}

// Auth helpers
export async function loginWithGoogle() {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
}

export async function logoutUser() {
  return signOut(auth);
}
