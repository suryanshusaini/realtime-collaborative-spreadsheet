"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={loading}
      className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Signing in..." : "Sign in with Google"}
    </button>
  );
}
