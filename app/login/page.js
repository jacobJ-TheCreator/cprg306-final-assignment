"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../_utils/authService";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
        </form>
    );
}
