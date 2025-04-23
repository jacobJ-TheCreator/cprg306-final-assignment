"use client";

import { useUserAuth } from "@/app/_utils/authContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { emailLogin, googleSignIn } = useUserAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await emailLogin(email, password);
      if (result.user) {
        router.push("/signedIn");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-green-50 to-green-100">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-green-800 text-center">Welcome Back</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
          >
            Login
          </button>
        </form>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={async () => {
              try {
                await googleSignIn();
                router.push("/signedIn");
              } catch (error) {
                alert(error.message);
              }
            }}
            className="bg-white text-green-700 border border-green-300 rounded-lg px-6 py-3 hover:bg-green-50 transition"
          >
            Continue with Gmail 📩
          </button>

          <button
            onClick={() => router.push("/")}
            className="text-sm text-green-700 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
