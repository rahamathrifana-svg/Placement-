import { db } from './index.ts';
import { users, userState, certifications, projects } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoUrl?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          photoUrl: photoUrl || null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Database operation failed. Unable to authenticate user profile.', { cause: error });
  }
}

export async function getUserState(uid: string) {
  try {
    const records = await db.select().from(userState).where(eq(userState.userId, uid));
    if (records.length === 0) return null;
    return records[0];
  } catch (error) {
    console.error('Database query failed in getUserState:', error);
    throw new Error('Database operation failed. Unable to load user state.', { cause: error });
  }
}

export async function saveUserState(uid: string, xp: number, stateJson: string) {
  try {
    const result = await db.insert(userState)
      .values({
        userId: uid,
        xp,
        stateJson,
        version: 1,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userState.userId,
        set: {
          xp,
          stateJson,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in saveUserState:', error);
    throw new Error('Database operation failed. Unable to save user state.', { cause: error });
  }
}

export async function getCertifications(uid: string) {
  try {
    return await db.select().from(certifications).where(eq(certifications.userId, uid));
  } catch (error) {
    console.error('Database query failed in getCertifications:', error);
    throw new Error('Database operation failed. Unable to fetch certifications.', { cause: error });
  }
}

export async function getProjects(uid: string) {
  try {
    return await db.select().from(projects).where(eq(projects.userId, uid));
  } catch (error) {
    console.error('Database query failed in getProjects:', error);
    throw new Error('Database operation failed. Unable to fetch projects.', { cause: error });
  }
}
