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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-6">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-green-800 text-center mb-6">
          Create Your Account
        </h1>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="p-3 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="p-3 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="p-3 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-3 rounded border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6">
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
