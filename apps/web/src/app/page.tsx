import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "./lib/firebase-admin";
import { LoginForm } from "./login-form";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;

  if (token) {
    try {
      await adminAuth.verifyIdToken(token);
      redirect("/tasks");
    } catch {
      // Token invalid — fall through to login page
    }
  }

  return (
    <main>
      <h1>Task Manager</h1>
      <p>Architecture overview — Next.js BFF + NestJS + Firestore</p>
      <LoginForm />
    </main>
  );
}
