import { adminDb } from '../lib/firebase-admin.ts';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoUrl?: string) {
  try {
    const userRef = adminDb.collection('users').doc(uid);
    const snap = await userRef.get();

    const now = new Date().toISOString();
    const data = {
      uid,
      email,
      displayName: displayName || (snap.exists ? snap.data()?.displayName : '') || '',
      photoUrl: photoUrl || (snap.exists ? snap.data()?.photoUrl : '') || '',
      updatedAt: now,
      ...(!snap.exists ? { createdAt: now } : {}),
    };

    await userRef.set(data, { merge: true });
    return data;
  } catch (error) {
    console.error('Firestore query failed in getOrCreateUser:', error);
    throw new Error('Database operation failed. Unable to authenticate user profile.', { cause: error });
  }
}

export async function getUserState(uid: string) {
  try {
    const progressRef = adminDb.collection('users').doc(uid).collection('progress').doc('state');
    const snap = await progressRef.get();
    if (!snap.exists) return null;

    const data = snap.data();
    return {
      userId: uid,
      xp: data?.xp ?? 0,
      stateJson: typeof data?.state === 'string' ? data.state : JSON.stringify(data?.state ?? {}),
      updatedAt: data?.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Firestore query failed in getUserState:', error);
    throw new Error('Database operation failed. Unable to load user state.', { cause: error });
  }
}

export async function saveUserState(uid: string, xp: number, stateJson: string) {
  try {
    const progressRef = adminDb.collection('users').doc(uid).collection('progress').doc('state');
    const parsedState = typeof stateJson === 'string' ? JSON.parse(stateJson) : stateJson;
    const now = new Date().toISOString();

    const progressData = {
      userId: uid,
      xp: Number(xp) || 0,
      state: parsedState,
      updatedAt: now,
    };

    await progressRef.set(progressData, { merge: true });

    // Also update parent user document's updatedAt
    await adminDb.collection('users').doc(uid).set({ updatedAt: now }, { merge: true });

    return {
      userId: uid,
      xp: Number(xp) || 0,
      updatedAt: now,
    };
  } catch (error) {
    console.error('Firestore query failed in saveUserState:', error);
    throw new Error('Database operation failed. Unable to save user state.', { cause: error });
  }
}

export async function getCertifications(uid: string) {
  try {
    const progress = await getUserState(uid);
    if (!progress) return [];
    const state = JSON.parse(progress.stateJson);
    return state.certs || [];
  } catch (error) {
    console.error('Firestore query failed in getCertifications:', error);
    throw new Error('Database operation failed. Unable to fetch certifications.', { cause: error });
  }
}

export async function getProjects(uid: string) {
  try {
    const progress = await getUserState(uid);
    if (!progress) return [];
    const state = JSON.parse(progress.stateJson);
    return state.pl || [];
  } catch (error) {
    console.error('Firestore query failed in getProjects:', error);
    throw new Error('Database operation failed. Unable to fetch projects.', { cause: error });
  }
}
