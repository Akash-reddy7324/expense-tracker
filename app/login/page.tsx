"use client";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      router.push("/dashboard"); // redirect after login
    } catch (err: any) {
      console.error("Login failed:", err.message);
      alert("Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-sm w-full border rounded-lg p-6 space-y-4 shadow-md">
        <h1 className="text-xl font-semibold text-center">Expense Tracker</h1>
        <p className="text-sm text-gray-600 text-center">Sign in to continue</p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 flex items-center justify-center gap-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : (
            <>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}
