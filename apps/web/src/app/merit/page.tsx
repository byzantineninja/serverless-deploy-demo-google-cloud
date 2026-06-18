import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "../lib/firebase-admin";
import { proxyToApi } from "../lib/api-proxy";
import { MeritMachine } from "./merit-machine";
import { SignOutButton } from "./sign-out-button";

export default async function MeritPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;

  if (!token) redirect("/");

  let uid: string;
  let email: string | undefined;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
    email = decoded.email;
  } catch {
    redirect("/");
  }

  let displayLabel = email ?? uid!;
  try {
    const res = await proxyToApi("/users/me", {
      headers: { "x-user-id": uid! },
    });
    if (res.ok) {
      const user = await res.json();
      displayLabel = user.displayName ?? email ?? uid!;
    }
  } catch {
    // 後端不可達時退回 email/uid
  }

  return (
    <main className="page-shell">
      <div className="merit-header">
        <div>
          <p className="kicker">賽博功德機</p>
          <h1>積功累德 · 功德無量</h1>
        </div>
        <div className="merit-user-meta">
          <span className="pilot-name">{displayLabel}</span>
          <SignOutButton />
        </div>
      </div>
      <MeritMachine uid={uid!} />
    </main>
  );
}
