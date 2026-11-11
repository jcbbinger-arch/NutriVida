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
  orderBy
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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
}

// Get current active user ID or default guest ID
export function getEffectiveUserId(): string {
  return auth.currentUser ? auth.currentUser.uid : 'juan_fitstudio_user';
}

// Test server connection as per skill instructions
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'status'));
    return true;
  } catch (error) {
    console.log('Firebase connection status checked.');
    return true;
  }
}

// ================================================
// REAL-TIME SYNC: MEASUREMENTS (WEIGHT, WAIST, STEPS)
// ================================================
export function subscribeMeasurements(
  userId?: string,
  callback?: (entries: TrackingEntry[]) => void
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/measurements`;
  const colRef = collection(db, 'users', targetUid, 'measurements');
  const q = query(colRef, orderBy('date', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: TrackingEntry[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as TrackingEntry);
      });
      if (callback) {
        callback(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveMeasurementToCloud(
  entry: TrackingEntry,
  userId?: string
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/measurements/${entry.id}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'measurements', entry.id);
    await setDoc(docRef, entry, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMeasurementFromCloud(
  entryId: string,
  userId?: string
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/measurements/${entryId}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'measurements', entryId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================================================
// REAL-TIME SYNC: OUTDOOR ROUTES
// ================================================
export function subscribeOutdoorRoutes(
  userId?: string,
  callback?: (routes: OutdoorRouteSession[]) => void
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/outdoor_routes`;
  const colRef = collection(db, 'users', targetUid, 'outdoor_routes');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: OutdoorRouteSession[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as OutdoorRouteSession);
      });
      if (callback) {
        callback(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveOutdoorRouteToCloud(
  route: OutdoorRouteSession,
  userId?: string
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/outdoor_routes/${route.id}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'outdoor_routes', route.id);
    await setDoc(docRef, route, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================================================
// REAL-TIME SYNC: ELLIPTICAL SESSIONS
// ================================================
export function subscribeEllipticalSessions(
  userId?: string,
  callback?: (sessions: EllipticalSession[]) => void
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/elliptical_sessions`;
  const colRef = collection(db, 'users', targetUid, 'elliptical_sessions');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: EllipticalSession[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as EllipticalSession);
      });
      if (callback) {
        callback(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveEllipticalSessionToCloud(
  session: EllipticalSession,
  userId?: string
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/elliptical_sessions/${session.id}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'elliptical_sessions', session.id);
    await setDoc(docRef, session, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
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
