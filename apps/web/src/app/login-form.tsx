"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "./lib/firebase";
import { useRouter } from "next/navigation";

// ---------------------------------------------------------------------------
// OAuth provider registry
// To add a new provider (Google, GitHub, …):
//   1. Import the provider's signIn helper from firebase/auth
//   2. Add an entry to OAUTH_PROVIDERS below
//   3. Enable the provider in Identity Platform (Terraform / console)
// ---------------------------------------------------------------------------
type OAuthProvider = {
  id: string;
  label: string;
  signIn: () => Promise<UserCredential>;
};

const OAUTH_PROVIDERS: OAuthProvider[] = [
  // Example — uncomment when Google provider is enabled in Identity Platform:
  // {
  //   id: "google",
  //   label: "以 Google 繼續",
  //   signIn: () => signInWithPopup(firebaseAuth, new GoogleAuthProvider()),
  // },
];

const EMAIL_STORAGE_KEY = "emailLinkSignIn";

async function syncProfile(displayName: string | null): Promise<{ displayName?: string } | null> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ displayName }),
  });
  if (!res.ok) return null;
  return res.json();
}

type AuthMode = "password" | "emailLink";

export function LoginForm() {
  const [authMode, setAuthMode] = useState<AuthMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function switchMode(mode: AuthMode) {
    setAuthMode(mode);
    setError("");
    setEmailLinkSent(false);
  }

  async function handleOAuth(provider: OAuthProvider) {
    setError("");
    setLoading(true);
    try {
      const credential = await provider.signIn();
      const token = await credential.user.getIdToken();
      document.cookie = `firebase-token=${token}; path=/; SameSite=Strict; max-age=3600`;
      const backendUser = await syncProfile(credential.user.displayName);
      router.push(backendUser?.displayName ? "/tasks" : "/profile/setup");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "認證失敗，請再試一次");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailLinkSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/callback`,
        handleCodeInApp: true,
      };
      const auth = await getFirebaseAuth();
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem(EMAIL_STORAGE_KEY, email);
      setEmailLinkSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "傳送失敗，請再試一次");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = await getFirebaseAuth();
      let credential;
      if (isSignUp) {
        credential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        credential = await signInWithEmailAndPassword(auth, email, password);
      }
      const token = await credential.user.getIdToken();
      document.cookie = `firebase-token=${token}; path=/; SameSite=Strict; max-age=3600`;
      const backendUser = await syncProfile(credential.user.displayName);
      router.push(backendUser?.displayName ? "/tasks" : "/profile/setup");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "認證失敗，請再試一次");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      {OAUTH_PROVIDERS.length > 0 && (
        <div className="auth-providers">
          {OAUTH_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              type="button"
              disabled={loading}
              onClick={() => handleOAuth(provider)}
              className="control-button auth-oauth-button"
            >
              {provider.label}
            </button>
          ))}
        </div>
      )}

      <div className="auth-divider">
        <span>
          {OAUTH_PROVIDERS.length > 0 ? "或" : isSignUp ? "以電子郵件註冊" : "以電子郵件登入"}
        </span>
      </div>

      <div className="auth-mode-tabs" role="tablist">
        <button
          role="tab"
          type="button"
          aria-selected={authMode === "password"}
          onClick={() => switchMode("password")}
          className={`auth-mode-tab${authMode === "password" ? " active" : ""}`}
        >
          密碼
        </button>
        <button
          role="tab"
          type="button"
          aria-selected={authMode === "emailLink"}
          onClick={() => switchMode("emailLink")}
          className={`auth-mode-tab${authMode === "emailLink" ? " active" : ""}`}
        >
          無密碼連結
        </button>
      </div>

      {authMode === "emailLink" ? (
        emailLinkSent ? (
          <div className="auth-link-sent">
            <p>連結已發送至 <strong>{email}</strong></p>
            <p className="auth-link-hint">請檢查您的電子郵件並點擊連結完成登入。</p>
            <button
              type="button"
              onClick={() => setEmailLinkSent(false)}
              className="control-button toggle-button"
            >
              重新發送
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailLinkSubmit} className="auth-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="電子郵件"
              required
              className="auth-input"
            />
            {error && <p className="auth-error">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="control-button login-button"
            >
              {loading ? "傳送中..." : "傳送登入連結"}
            </button>
          </form>
        )
      ) : (
        <form onSubmit={handlePasswordSubmit} className="auth-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="電子郵件"
            required
            className="auth-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密碼"
            required
            className="auth-input"
          />
          {error && <p className="auth-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="control-button login-button"
          >
            {loading ? "處理中..." : isSignUp ? "註冊" : "登入"}
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            className="control-button toggle-button"
          >
            {isSignUp ? "已有帳號？登入" : "沒有帳號？註冊"}
          </button>
        </form>
      )}
    </div>
  );
}
