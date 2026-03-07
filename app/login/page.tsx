"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-slate-500">
            Trademarkia Assignment
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to Sheets
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Sign in to create and collaborate on spreadsheet documents in real
            time.
          </p>
        </div>

        <GoogleSignInButton />

        <div className="mt-6 rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
          Built with Next.js, TypeScript, Tailwind CSS, and Firebase.
        </div>
      </div>
    </main>
  );
}
