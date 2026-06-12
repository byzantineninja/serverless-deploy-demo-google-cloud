import { NextRequest, NextResponse } from 'next/server';
import { requireSession, internalHeaders, proxyToApi } from '@/app/lib/api-proxy';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  return proxyToApi(`/tasks/${id}`, {
    method: 'PATCH',
    headers: internalHeaders(session.user.id),
    body: JSON.stringify(body),
  });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  return proxyToApi(`/tasks/${id}`, {
    method: 'DELETE',
    headers: internalHeaders(session.user.id),
  });
}
