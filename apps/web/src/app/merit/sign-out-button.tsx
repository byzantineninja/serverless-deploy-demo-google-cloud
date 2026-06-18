"use client";

import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const auth = await getFirebaseAuth();
    await signOut(auth);
    document.cookie = "firebase-token=; path=/; max-age=0";
    router.push("/");
  }

  return (
    <button onClick={handleSignOut} className="control-button signout-button">
      登出
    </button>
  );
}
