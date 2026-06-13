import { auth } from "./lib/auth";
import { GoogleSignInButton } from "./google-sign-in-button";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/tasks");

  return (
    <main>
      <h1>Task Manager</h1>
      <p>Architecture overview — Next.js BFF + NestJS + Firestore</p>
      <GoogleSignInButton />
    </main>
  );
}
