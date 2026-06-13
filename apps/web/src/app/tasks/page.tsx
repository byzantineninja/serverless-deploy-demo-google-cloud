import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth } from '../lib/firebase-admin';
import { TaskList } from './task-list';
import { SignOutButton } from './sign-out-button';

const API_BASE_URL = process.env.API_BASE_URL!;

export default async function TasksPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('firebase-token')?.value;

  if (!token) redirect('/');

  let uid: string;
  let email: string | undefined;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
    email = decoded.email;
  } catch {
    redirect('/');
  }

  let displayLabel = email ?? uid!;
  try {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: { 'x-user-id': uid! },
    });
    if (res.ok) {
      const user = await res.json();
      displayLabel = user.displayName ?? email ?? uid!;
    }
  } catch {
    // Fall back to email/uid if backend is unreachable
  }

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>我的任務</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>{displayLabel}</span>
          <SignOutButton />
        </div>
      </div>
      <TaskList />
    </main>
  );
}
