"use client";

import { useEffect, useState } from "react";
import { useUserAuth } from "@/app/_utils/authContext";
import { db } from "@/app/_utils/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";

const categoryColors = {
    "Job": "#4ade80", // green
    "Investments": "#60a5fa", // blue
    "Tax refunds": "#fbbf24", // yellow
    "MISC": "#a78bfa", // purple
    "Mortgage/Rent": "#f87171", // red
    "Groceries": "#34d399", // teal
    "Entertainment": "#facc15", // amber
    "Insurance": "#60a5fa", // blue
    "Gas": "#fb923c", // orange
};

export default function TransactionsPage() {
    const { user, profile, firebaseSignOut } = useUserAuth();
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
        const q = query(collection(db, "transactions"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);
    };

    if (!user || !profile) return null;

    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-green-900">All Transactions</h1>
                <button
                    onClick={() => router.push("/signedIn")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Back
                </button>
            </div>

            <div className="bg-white p-6 rounded shadow space-y-4">
                {transactions.length === 0 ? (
                    <p className="text-center text-black">No transactions found</p>
                ) : (
                    transactions.map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                            <div className="flex items-center gap-3">
                                <span
                                    className="px-2 py-1 rounded text-xs font-semibold"
                                    style={{ backgroundColor: categoryColors[transaction.category] || "#ddd", color: "#000" }}
                                >
                                    {transaction.category}
                                </span>
                                <p className="font-semibold">
                                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                                </p>
                            </div>
                            <div className="text-right text-black text-sm whitespace-nowrap">
                                {new Date(transaction.timestamp?.seconds * 1000).toLocaleString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
