import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/app/lib/firebase-admin";
import { proxyToApi } from "@/app/lib/api-proxy";
import { ProfileSetupForm } from "./profile-setup-form";

export default async function ProfileSetupPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;
  if (!token) redirect("/");

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    redirect("/");
  }

  try {
    const res = await proxyToApi("/users/me", {
      headers: { "x-user-id": uid! },
    });
    if (res.ok) {
      const user = await res.json();
      if (user.displayName) redirect("/merit");
    }
  } catch {
    // If backend is unreachable, show the setup form anyway
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="kicker">歡迎加入</p>
        <h1>設定個人資料</h1>
        <p className="hero-subtitle">完成後即可開始使用</p>
      </section>
      <ProfileSetupForm />
    </main>
  );
}
