import { NextRequest } from 'next/server';
import { proxyToApi } from '@/app/lib/api-proxy';

// 公開端點 — 不需登入即可查看功德排行榜
export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get('limit') ?? '20';
  return proxyToApi(`/merit/leaderboard?limit=${encodeURIComponent(limit)}`, {
    headers: { 'Content-Type': 'application/json' },
  });
}
