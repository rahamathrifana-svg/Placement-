import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { AppState, INITIAL_STATE } from '../types/index.ts';
import { todayStr, addDays } from '../utils/dateUtils.ts';

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

  // Debounced cloud save to Cloud SQL via /api/progress
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
      try {
        const token = await auth.currentUser?.getIdToken();
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
      } catch (err) {
        console.error('Failed to sync state to database:', err);
        setSyncStatus('offline');
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

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setSyncStatus('syncing');
        try {
          const token = await currentUser.getIdToken();
          const res = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.state) {
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

                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
                return merged;
              });

            } else {
              // New user in DB - push local state to DB
              queueCloudSync(stateRef.current);
            }
            setSyncStatus('synced');
          } else {
            console.warn('API sync response not OK:', res.status);
            setSyncStatus('offline');
          }
        } catch (e) {
          console.error('Initial DB sync failed:', e);
          setSyncStatus('offline');
        }
      } else {
        setSyncStatus('idle');
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
