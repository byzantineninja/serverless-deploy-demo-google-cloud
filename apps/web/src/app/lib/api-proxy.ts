import { auth } from './auth';
import { headers as nextHeaders } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL!;
const INTERNAL_SERVICE_TOKEN = process.env.INTERNAL_SERVICE_TOKEN!;

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await nextHeaders() });
  return session ?? null;
}

export function internalHeaders(userId: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-internal-token': INTERNAL_SERVICE_TOKEN,
    'x-user-id': userId,
  };
}

export async function proxyToApi(
  path: string,
  options: RequestInit,
): Promise<NextResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  if (res.status === 204) return new NextResponse(null, { status: 204 });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
