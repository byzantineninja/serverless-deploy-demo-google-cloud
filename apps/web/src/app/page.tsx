import Link from "next/link";
import { cookies } from "next/headers";
import { adminAuth } from "./lib/firebase-admin";
import { LoginForm } from "./login-form";
import { Leaderboard } from "./merit/leaderboard";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;

  let loggedIn = false;
  if (token) {
    try {
      await adminAuth.verifyIdToken(token);
      loggedIn = true;
    } catch {
      // Token 失效 — 顯示登入表單
    }
  }

  return (
    <main className="page-shell home-shell">
      <section className="hero-panel">
        <p className="kicker">一念清淨 · 功德自生</p>
        <h1 className="hero-title">賽博功德機</h1>
        <p className="hero-subtitle">
          輕觸積德，功德無量 — 於一觸一念之間，靜心累積你的功德。
        </p>
        {loggedIn ? (
          <Link href="/merit" className="control-button enter-button">
            進入功德機 · 開始積德
          </Link>
        ) : (
          <LoginForm />
        )}
      </section>

      <Leaderboard />
    </main>
  );
}
