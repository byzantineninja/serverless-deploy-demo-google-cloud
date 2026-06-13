"use client";

import { authClient } from "./lib/auth-client";

export function GoogleSignInButton() {
  return (
    <button
      type="button"
      style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", cursor: "pointer" }}
      onClick={async () => {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/tasks",
        });
      }}
    >
      使用 Google 帳號登入
    </button>
  );
}
