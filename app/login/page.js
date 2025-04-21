"use client";

import { useUserAuth } from "../_utils/authContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { emailLogin } = useUserAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await emailLogin(email, password);
            router.push("/signedIn"); // ➔ after login, redirect to signedIn page
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <main className="flex flex-col items-center p-8">
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
                <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                    Sign In
                </button>
            </form>
        </main>
    );
}
