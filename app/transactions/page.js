"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "@/app/_utils/authContext";
import { db } from "@/app/_utils/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const categoryColors = {
    "Job": "#4ade80",
    "Investments": "#60a5fa",
    "Tax refunds": "#fbbf24",
    "MISC": "#a78bfa",
    "Mortgage/Rent": "#f87171",
    "Groceries": "#34d399",
    "Entertainment": "#facc15",
    "Insurance": "#60a5fa",
    "Gas": "#fb923c",
};

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
        const q = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid),
            orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setTransactions(data);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this transaction?")) {
            await deleteDoc(doc(db, "transactions", id));
            fetchTransactions();
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-green-900">All Transactions</h1>
                <button
                    onClick={() => router.push("/signedIn")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="bg-white p-6 rounded shadow space-y-4">
                {transactions.length === 0 ? (
                    <p className="text-black">No transactions found.</p>
                ) : (
                    transactions.map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span
                                    className="px-2 py-1 rounded text-xs font-semibold"
                                    style={{
                                        backgroundColor: categoryColors[transaction.category] || "#ddd",
                                        color: "#000",
                                    }}
                                >
                                    {transaction.category}
                                </span>
                                <span
                                    className={`${transaction.type === "income" ? "text-green-600" : "text-red-500"
                                        } font-semibold`}
                                >
                                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex gap-4 items-center">
                                <span className="text-black text-sm">
                                    {new Date(transaction.timestamp?.seconds * 1000).toLocaleString()}
                                </span>
                                <button
                                    onClick={() => alert("Edit coming soon!")}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(transaction.id)}
                                    className="text-red-600 hover:underline text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
