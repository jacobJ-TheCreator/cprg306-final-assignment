"use client";

import { useUserAuth } from "../_utils/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
    const { emailSignUp } = useUserAuth();
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            await emailSignUp(email, password, firstName, lastName, phone);

            alert("Account created! Please verify your email before logging in.");

            router.push("/verifyEmail"); // ✅ IMMEDIATELY push to /verifyEmail after signup
        } catch (error) {
            console.error("Signup Error:", error.message);
            alert(error.message);
        }
    };

    return (
        <main className="flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-6">Create Your ZenBudget Account</h1>
            <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full max-w-sm">
                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="border p-2 rounded" />
                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="border p-2 rounded" />
                <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required className="border p-2 rounded" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border p-2 rounded" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border p-2 rounded" />
                <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">Create Account</button>
            </form>
        </main>
    );
}
