import { adminAuth } from './firebase-admin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const API_BASE_URL = process.env.API_BASE_URL!;

const auth = new GoogleAuth();

export async function requireSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('firebase-token')?.value;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return { userId: decoded.uid };
  } catch {
    return null;
  }
}

export function internalHeaders(userId: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-user-id': userId,
  };
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  if (!process.env.K_SERVICE) return {}; // not on Cloud Run
  try {
    const client = await auth.getIdTokenClient(API_BASE_URL);
    const token = await client.idTokenProvider.fetchIdToken(API_BASE_URL);
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

export async function proxyToApi(
  path: string,
  options: RequestInit = {},
): Promise<NextResponse> {
  const authHeaders = await getAuthHeaders();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    ...authHeaders,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (res.status === 204) return new NextResponse(null, { status: 204 });

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error(`Backend returned non-JSON (${res.status}):`, text.slice(0, 300));
    return NextResponse.json({ error: 'Backend service error' }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
