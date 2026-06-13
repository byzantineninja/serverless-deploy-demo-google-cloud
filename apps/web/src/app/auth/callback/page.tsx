"use client";

import { useEffect, useState } from "react";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { getFirebaseAuth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

const EMAIL_STORAGE_KEY = "emailLinkSignIn";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"pending" | "needEmail" | "error">("pending");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function complete(emailAddress: string) {
    try {
      const auth = await getFirebaseAuth();
      const credential = await signInWithEmailLink(
        auth,
        emailAddress,
        window.location.href,
      );
      const token = await credential.user.getIdToken();
      document.cookie = `firebase-token=${token}; path=/; SameSite=Strict; max-age=3600`;
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: null }),
      });
      const backendUser = res.ok ? await res.json() : null;
      window.localStorage.removeItem(EMAIL_STORAGE_KEY);
      router.replace(backendUser?.displayName ? "/tasks" : "/profile/setup");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "連結無效或已過期，請重新索取");
      setStatus("error");
    }
  }

  useEffect(() => {
    getFirebaseAuth().then((auth) => {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        router.replace("/");
        return;
      }
      const saved = window.localStorage.getItem(EMAIL_STORAGE_KEY);
      if (saved) {
        complete(saved);
      } else {
        setStatus("needEmail");
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "pending") {
    return (
      <main className="page-shell">
        <p style={{ color: "var(--muted)" }}>正在驗證連結⋯</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="page-shell">
        <p className="auth-error">{errorMsg}</p>
        <a href="/" className="control-button" style={{ display: "inline-block", marginTop: "0.8rem" }}>
          返回登入
        </a>
      </main>
    );
  }

  // needEmail: user opened link on a different device / browser
  return (
    <main className="page-shell">
      <p style={{ color: "var(--muted)", marginBottom: "0.8rem" }}>
        請再次輸入您的電子郵件以完成登入
      </p>
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          complete(email);
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="電子郵件"
          required
          className="auth-input"
        />
        <button type="submit" className="control-button login-button">
          確認
        </button>
      </form>
    </main>
  );
}
