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
        try {
            await emailSignUp(
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName,
                formData.phone
            );
            router.push("/login"); // ➔ after signup, redirect to login
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <main className="flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
            <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Sign Up
                </button>
            </form>
        </main>
    );
}
