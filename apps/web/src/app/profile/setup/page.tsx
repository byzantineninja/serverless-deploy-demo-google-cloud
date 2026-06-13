import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/app/lib/firebase-admin";
import { ProfileSetupForm } from "./profile-setup-form";

const API_BASE_URL = process.env.API_BASE_URL!;

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
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: { "x-user-id": uid! },
    });
    if (res.ok) {
      const user = await res.json();
      if (user.displayName) redirect("/tasks");
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
