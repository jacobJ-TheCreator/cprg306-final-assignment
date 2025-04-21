"use client";

import { useUserAuth } from "../_utils/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignedInPage() {
    const { user, profile, firebaseSignOut } = useUserAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user]);

    if (!user || !profile) return null;

    const handleSignOut = async () => {
        await firebaseSignOut();
        router.push("/login");
    };

    return (
        <main className="flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-6">Welcome, {profile.firstName}!</h1>
            <p className="mb-6 text-center">Manage your finances like a pro 🚀</p>
            <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
                Sign Out
            </button>
        </main>
    );
}
