"use client";

import { useUserAuth } from "../_utils/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";

export default function VerifyEmailPage() {
    const { user } = useUserAuth();
    const router = useRouter();
    const [message, setMessage] = useState("");

    useEffect(() => {
        const checkVerification = setInterval(() => {
            if (user?.emailVerified) {
                router.push("/login"); // ✅ Once verified, move to /login
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(checkVerification);
    }, [user]);

    const handleResendVerification = async () => {
        if (user) {
            try {
                await sendEmailVerification(user);
                setMessage("Verification email resent! Please check your inbox.");
            } catch (error) {
                setMessage(`Error resending email: ${error.message}`);
            }
        }
    };

    return (
        <main className="flex flex-col items-center justify-center p-8">
            <h1 className="text-3xl font-bold mb-4">Verify Your Email</h1>
            <p className="mb-6 text-center">
                Check your email inbox and click the verification link.<br />
                Did not get it? Click below to resend.
            </p>

            <button
                onClick={handleResendVerification}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mb-4"
            >
                Resend Verification Email
            </button>

            {message && (
                <p className="text-green-600 font-semibold">{message}</p>
            )}
        </main>
    );
}