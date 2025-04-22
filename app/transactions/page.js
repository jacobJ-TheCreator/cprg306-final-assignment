"use client";

import { useState, useEffect } from "react";
import { db } from "@/app/_utils/firebase";
import { useUserAuth } from "@/app/_utils/authContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
    const { user } = useUserAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else {
            fetchTransactions();
        }
    }, [user]);

    const fetchTransactions = async () => {
        if (!user) return;
        const q = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid),
            orderBy("timestamp", "desc") // ✅ Order directly from Firestore
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Local sort backup (optional, for 100% accuracy)
        const sortedData = data.sort((a, b) => {
            const dateA = a.timestamp.toDate();
            const dateB = b.timestamp.toDate();
            return dateB - dateA; // ✅ Newest first
        });

        setTransactions(sortedData);
    };

    const formatDate = (timestamp) => {
        const date = timestamp.toDate();
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!user) return null;

    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
            <h1 className="text-3xl font-bold text-green-900 mb-6">All Transactions</h1>

            <div className="bg-white p-6 rounded shadow mb-8">
                {transactions.length === 0 ? (
                    <p className="text-center text-gray-400">No transactions yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {transactions.map((t) => (
                            <li key={t.id} className="flex justify-between py-4">
                                <div>
                                    <p className="font-semibold">{t.category}</p>
                                    <p className="text-sm text-gray-500">{formatDate(t.timestamp)}</p>
                                </div>
                                <div
                                    className={`font-semibold ${t.type === "income" ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                onClick={() => router.push("/signedIn")}
                className="text-blue-600 hover:underline"
            >
                ← Back to Dashboard
            </button>
        </main>
    );
}
