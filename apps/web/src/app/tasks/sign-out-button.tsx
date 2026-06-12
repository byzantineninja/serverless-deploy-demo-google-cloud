'use client';

import { authClient } from '../lib/auth-client';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push('/');
  }

  return (
    <button onClick={handleSignOut} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
      登出
    </button>
  );
}
