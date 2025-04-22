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
        <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-6">
            <h1 className="text-3xl font-bold mb-6">Sign In</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border p-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Login
                </button>
            </form>

            <button
                onClick={async () => {
                    try {
                        await googleSignIn();
                        router.push("/signedIn");
                    } catch (error) {
                        alert(error.message);
                    }
                }}
                className="bg-white text-black border border-gray-300 rounded px-4 py-2 mt-4 hover:bg-gray-100"
            >
                Continue with Gmail 📩
            </button>

            <button
                onClick={() => router.push("/")}
                className="mt-6 text-green-700 hover:underline"
            >
                ← Back to Home
            </button>
        </main>
    );
}
