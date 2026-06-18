import { NextResponse } from 'next/server';
import { requireSession, internalHeaders, proxyToApi } from '@/app/lib/api-proxy';

export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return proxyToApi('/merit/me', {
    headers: internalHeaders(session.userId),
  });
}
