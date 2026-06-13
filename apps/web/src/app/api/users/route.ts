import { adminAuth } from '@/app/lib/firebase-admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { proxyToApi } from '@/app/lib/api-proxy';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('firebase-token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let decoded: Awaited<ReturnType<typeof adminAuth.verifyIdToken>>;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const displayName: string | undefined = body.displayName ?? decoded.name;

  return proxyToApi('/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': decoded.uid,
    },
    body: JSON.stringify({ email: decoded.email, ...(displayName && { displayName }) }),
  });
}
