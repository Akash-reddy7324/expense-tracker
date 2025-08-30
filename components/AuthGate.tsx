"use client";
import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase/client";
import Link from "next/link";

export default function AuthGate({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUid(u?.uid ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;

  if (!uid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-sm w-full border rounded-lg p-6 space-y-4">
          <h1 className="text-xl font-semibold">Sign in required</h1>
          <p className="text-sm text-gray-400">Please sign in to continue.</p>

          <button
            onClick={() => signInWithPopup(auth, provider)}
            className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
          >
            Continue with Google
          </button>

          <Link
            href="/login"
            className="block text-center text-blue-400 hover:text-blue-300 underline text-sm"
          >
            Go to login page
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
