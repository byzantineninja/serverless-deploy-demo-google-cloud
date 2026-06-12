import { auth } from './lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect('/tasks');

  return (
    <main>
      <h1>Task Manager</h1>
      <p>Architecture demo — Next.js BFF + NestJS + Firestore</p>
      <a href="/api/auth/sign-in/google">
        <button style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}>
          使用 Google 帳號登入
        </button>
      </a>
    </main>
  );
}
