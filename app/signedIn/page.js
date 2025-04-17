"use client";

import { useUserAuth } from "../_utils/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignedInPage() {
    const { user, profile } = useUserAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (!user.emailVerified) {
            router.push("/verifyEmail");
        }
    }, [user]);

    if (!user || !profile) return null;

    return (
        <main className="flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-6">Welcome, {profile.firstName}!</h1>
            <p className="text-center">Manage your finances like a pro 🚀</p>
        </main>
    );
}
