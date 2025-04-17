"use client";

import { useUserAuth } from "../../_utils/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OverviewPage() {
    const { user } = useUserAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">ZenBudget Overview</h1>
            <p className="text-lg">
                Track your income, expenses, and financial health all in one place.
            </p>
            {/* Later add your charts, stats, and receipts here */}
        </div>
    );
}
