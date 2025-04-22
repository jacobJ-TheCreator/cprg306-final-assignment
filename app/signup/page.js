"use client";

import { useUserAuth } from "../_utils/authContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const { emailSignUp } = useUserAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { email, password, firstName, lastName, phone } = formData;
        try {
            await emailSignUp(email, password, firstName, lastName, phone);
            router.push("/signedIn");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <main className="flex flex-col items-center p-8 min-h-screen">
            <div className="w-full max-w-sm space-y-6">
                <button
                    onClick={() => router.push("/")}
                    className="text-sm text-blue-600 hover:underline mb-4"
                >
                    ← Back to Home
                </button>

                <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
                <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="border p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </main>
    );
}
