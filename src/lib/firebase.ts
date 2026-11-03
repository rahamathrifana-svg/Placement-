import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import firebaseConfig from '../../firebase-applet-config.json';

const configWithRtdb = {
  ...firebaseConfig,
  databaseURL:
    (firebaseConfig as any).databaseURL ||
    `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com`,
};

const app = !getApps().length ? initializeApp(configWithRtdb) : getApps()[0];
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

let rtdbInstance: Database | null = null;
try {
  rtdbInstance = getDatabase(app);
} catch (e) {
  console.warn('Realtime database initialization notice:', e);
}

export const rtdb = rtdbInstance;
