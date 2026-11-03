import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, googleAuthProvider, db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { AppState, INITIAL_STATE } from '../types/index.ts';
import { todayStr } from '../utils/dateUtils.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline' | 'idle';
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  updateState: (updater: (prev: AppState) => AppState, xpReward?: number, message?: string) => void;
  toast: (msg: string) => void;
  toastMessage: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pq_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'idle'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Initialize state from local storage
  const [appState, setAppState] = useState<AppState>(() => {
    const today = todayStr();
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.start = today;
        if (!parsed.checkins || !parsed.checkins.includes(today)) {
          parsed.checkins = [today];
        }
        if (!parsed.ap) parsed.ap = { start: today, ci: [today], d: {}, max: today };
        parsed.ap.start = today;
        if (!parsed.ap.ci || !parsed.ap.ci.includes(today)) {
          parsed.ap.ci = [today];
        }
        if (!parsed.lr) parsed.lr = {};
        if (!parsed.ss) parsed.ss = {};
        if (!parsed.ap.d) parsed.ap.d = {};

        return { ...INITIAL_STATE, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse cached local storage state:', e);
    }
    return INITIAL_STATE;
  });

  const stateRef = useRef(appState);
  stateRef.current = appState;

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced cloud save to Firestore and fallback to /api/progress
  const queueCloudSync = useCallback(async (stateToSave: AppState) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      toast('Local storage full. Free some storage space or clear attached PDFs.');
    }

    if (!auth.currentUser) {
      setSyncStatus('idle');
      return;
    }

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    setSyncStatus('syncing');
    saveTimerRef.current = setTimeout(async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const progressDocRef = doc(db, 'users', currentUser.uid, 'progress', 'state');
        await setDoc(
          progressDocRef,
          {
            userId: currentUser.uid,
            xp: stateToSave.xp,
            state: stateToSave,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        setSyncStatus('synced');
      } catch (firestoreErr) {
        console.warn('Direct Firestore write fallback to API:', firestoreErr);
        try {
          const token = await currentUser.getIdToken();
          if (!token) return;

          const res = await fetch('/api/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              xp: stateToSave.xp,
              state: stateToSave,
            }),
          });

          if (!res.ok) {
            throw new Error(`Sync error: ${res.statusText}`);
          }

          setSyncStatus('synced');
        } catch (apiErr) {
          console.error('Failed to sync state to database:', apiErr);
          setSyncStatus('offline');
        }
      }
    }, 600);
  }, [toast]);

  // General updater that adds XP, triggers level-up notification, and pushes sync
  const updateState = useCallback((updater: (prev: AppState) => AppState, xpReward: number = 0, message?: string) => {
    setAppState((prev) => {
      const oldLevel = Math.floor(prev.xp / 100);
      const next = updater(prev);
      if (xpReward > 0) {
        next.xp += xpReward;
        toast(`+${xpReward} XP ${message || ''}`);
        const newLevel = Math.floor(next.xp / 100);
        if (newLevel > oldLevel) {
          setTimeout(() => {
            toast(`⭐ LEVEL UP! You reached level ${newLevel + 1}!`);
          }, 800);
        }
      }
      queueCloudSync(next);
      return next;
    });
  }, [queueCloudSync, toast]);

  // Listen to Firebase Auth state and Firestore real-time progress
  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (currentUser) {
        setSyncStatus('syncing');

        // Background profile sync
        try {
          const token = await currentUser.getIdToken();
          fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }).catch((err) => console.warn('Background auth sync notice:', err));
        } catch (e) {
          console.warn('Failed to fetch auth sync token:', e);
        }

        // Real-time snapshot listener on Firestore progress document
        const progressDocRef = doc(db, 'users', currentUser.uid, 'progress', 'state');
        unsubscribeFirestore = onSnapshot(
          progressDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data && data.state) {
                const today = todayStr();
                setAppState((prev) => {
                  const merged: AppState = {
                    ...prev,
                    ...data.state,
                    xp: Math.max(prev.xp || 0, data.xp || 0),
                    start: today,
                  };
                  if (!merged.checkins || !merged.checkins.includes(today)) {
                    merged.checkins = [today];
                  }
                  if (!merged.ap) merged.ap = { start: today, ci: [today], d: {}, max: today };
                  merged.ap.start = today;
                  if (!merged.ap.ci || !merged.ap.ci.includes(today)) {
                    merged.ap.ci = [today];
                  }
                  if (!merged.lr) merged.lr = {};
                  if (!merged.ss) merged.ss = {};
                  if (!merged.ap.d) merged.ap.d = {};

                  try {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
                  } catch (e) {}
                  return merged;
                });
                setSyncStatus('synced');
              }
            } else {
              // First time user in Firestore: push state
              queueCloudSync(stateRef.current);
              setSyncStatus('synced');
            }
          },
          (error) => {
            console.error('Firestore onSnapshot error:', error);
            setSyncStatus('offline');
            try {
              handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}/progress/state`);
            } catch (e) {}
          }
        );
      } else {
        setSyncStatus('idle');
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [queueCloudSync]);

  const signInWithGoogle = async () => {
    try {
      googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, googleAuthProvider);
      toast('Signed in successfully! Loading your progress...');
    } catch (e: any) {
      console.error('Google sign-in error:', e);
      if (e.code === 'auth/popup-blocked') {
        toast('Popup blocked. Please allow popups and try again.');
      } else {
        toast(e.message || 'Failed to sign in with Google');
      }
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      toast('Signed out.');
    } catch (e: any) {
      console.error('Sign-out error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        syncStatus,
        signInWithGoogle,
        signOut,
        appState,
        setAppState,
        updateState,
        toast,
        toastMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
