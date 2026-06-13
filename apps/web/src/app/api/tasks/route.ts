import { NextRequest, NextResponse } from 'next/server';
import { requireSession, internalHeaders, proxyToApi } from '@/app/lib/api-proxy';

export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return proxyToApi('/tasks', {
    headers: internalHeaders(session.userId),
  });
}

export async function POST(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  return proxyToApi('/tasks', {
    method: 'POST',
    headers: internalHeaders(session.userId),
    body: JSON.stringify(body),
  });
}
