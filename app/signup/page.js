"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "../../_utils/authService";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await signUp(email, password);
            router.push("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Sign Up</button>
        </form>
    );
}
