import { auth } from '../lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { TaskList } from './task-list';
import { SignOutButton } from './sign-out-button';

export default async function TasksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/');

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>我的任務</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>{session.user.name}</span>
          <SignOutButton />
        </div>
      </div>
      <TaskList />
    </main>
  );
}
