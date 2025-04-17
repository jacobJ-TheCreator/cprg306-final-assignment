"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-5xl font-bold mb-6">Welcome to ZenBudget</h1>
      <p className="text-lg mb-10 text-center">
        Track your finances, save smarter, and take control.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/signup")}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Create Account
        </button>
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </main>
  );
}
