//Authors Jacob, Noah, Jazib
//Version 2025-04-22 
//Description: CPRG 306- E Budget tracking app, with login and signup functionality, and a transactions page to view and manage transactions. Connected to firebase database, and deployed through vercel.

"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-green-50 to-green-100">
      <h1 className="text-5xl font-bold text-green-800 mb-4">ZenBudget</h1>
      <p className="text-lg text-green-700 mb-8 text-center max-w-md">
        Track your finances, save smarter, and take control of your future.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/signup")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
        >
          Create Account
        </button>
        <button
          onClick={() => router.push("/login")}
          className="border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-6 rounded-lg shadow"
        >
          Login
        </button>
      </div>
    </main>
  );
}
