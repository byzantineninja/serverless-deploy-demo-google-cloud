import { getApp, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getOrCreateApp() {
  try {
    return getApp();
  } catch {
      return initializeApp(
        process.env.FIREBASE_AUTH_EMULATOR_HOST ? { projectId: process.env.FIREBASE_PROJECT_ID ?? 'demo-no-project' } : {},
      );
  }
}

export const adminAuth = getAuth(getOrCreateApp());
