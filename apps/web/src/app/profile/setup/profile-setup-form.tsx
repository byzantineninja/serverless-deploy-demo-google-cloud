"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { getFirebaseAuth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export function ProfileSetupForm() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    getFirebaseAuth().then((auth) => {
      unsubscribe = onAuthStateChanged(auth, (u) => {
        if (!u) router.replace("/");
        else setUser(u);
      });
    });
    return () => unsubscribe?.();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");
    setLoading(true);
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      router.push("/merit");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "更新失敗，請再試一次");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <p style={{ color: "var(--muted)" }}>載入中⋯</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="法號"
        required
        className="auth-input"
      />
      {error && <p className="auth-error">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="control-button login-button"
      >
        {loading ? "儲存中..." : "開始使用"}
      </button>
    </form>
  );
}
