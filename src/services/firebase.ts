import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { TrackingEntry, TrainingConfiguratorState } from '../types/training';
import { UserProfile } from '../types/nutrition';
import { OutdoorRouteSession, EllipticalSession, StrengthSetLog } from '../components/FitStudioEngineView';

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
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Firebase client appears offline:', error.message);
    }
    return false;
  }
}

// ================================================
// USER PROFILE PERSISTENCE (5-STEP ONBOARDING & UPDATES)
// ================================================
export async function loadUserProfileFromCloud(userId?: string): Promise<UserProfile | null> {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}`;
  try {
    const docRef = doc(db, 'users', targetUid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveUserProfileToCloud(
  profile: UserProfile,
  userId?: string
): Promise<boolean> {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}`;
  try {
    const docRef = doc(db, 'users', targetUid);
    const sanitized = JSON.parse(
      JSON.stringify({
        ...profile,
        uid: targetUid,
        updatedAt: new Date().toISOString()
      })
    );
    await setDoc(docRef, sanitized, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function deleteUserProfileFromCloud(userId?: string): Promise<void> {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}`;
  try {
    await deleteDoc(doc(db, 'users', targetUid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================================================
// TRAINING CONFIGURATOR & CUSTOM 7-DAY SCHEDULE PERSISTENCE
// ================================================
export async function loadTrainingConfigFromCloud(
  userId?: string
): Promise<TrainingConfiguratorState | null> {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}`;
  try {
    const snap = await getDoc(doc(db, 'users', targetUid));
    if (snap.exists()) {
      const data = snap.data() as { trainingConfig?: TrainingConfiguratorState };
      return data.trainingConfig || null;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveTrainingConfigToCloud(
  trainingConfig: TrainingConfiguratorState,
  userId?: string
): Promise<boolean> {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}`;
  try {
    const sanitized = JSON.parse(
      JSON.stringify({
        trainingConfig: {
          ...trainingConfig,
          updatedAt: new Date().toISOString()
        }
      })
    );
    await setDoc(doc(db, 'users', targetUid), sanitized, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
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

export async function deleteOutdoorRouteFromCloud(
  routeId: string,
  userId?: string
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/outdoor_routes/${routeId}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'outdoor_routes', routeId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
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

export async function deleteEllipticalSessionFromCloud(
  sessionId: string,
  userId?: string
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/elliptical_sessions/${sessionId}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'elliptical_sessions', sessionId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================================================
// REAL-TIME SYNC: STRENGTH SESSIONS
// ================================================
export function subscribeStrengthSessions(
  userId?: string,
  callback?: (sessions: StrengthSetLog[]) => void
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/strength_sessions`;
  const colRef = collection(db, 'users', targetUid, 'strength_sessions');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: StrengthSetLog[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as StrengthSetLog);
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

export async function saveStrengthSessionToCloud(
  session: StrengthSetLog,
  userId?: string
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/strength_sessions/${session.id}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'strength_sessions', session.id);
    await setDoc(docRef, session, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStrengthSessionFromCloud(
  sessionId: string,
  userId?: string
) {
  const targetUid = userId || getEffectiveUserId();
  const path = `users/${targetUid}/strength_sessions/${sessionId}`;
  try {
    const docRef = doc(db, 'users', targetUid, 'strength_sessions', sessionId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
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
