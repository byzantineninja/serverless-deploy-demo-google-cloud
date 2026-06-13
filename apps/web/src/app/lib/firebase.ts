import { initializeApp, getApps } from 'firebase/app';
import { connectAuthEmulator, getAuth, Auth } from 'firebase/auth';

let authInstance: Auth | null = null;

export async function getFirebaseAuth(): Promise<Auth> {
  if (authInstance) return authInstance;

  const res = await fetch('/api/config');
  const config = await res.json();

  const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
  authInstance = getAuth(app);

  if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST) {
    connectAuthEmulator(
      authInstance,
      `http://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST}`,
      { disableWarnings: true },
    );
  }

  return authInstance;
}
