"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "@/app/_utils/authContext";
import { db } from "@/app/_utils/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#8884d8", "#FF6666"];

export default function SignedInPage() {
    const { user, profile, firebaseSignOut } = useUserAuth();
    const router = useRouter();

    const [transactions, setTransactions] = useState([]);
    const [showIncomeForm, setShowIncomeForm] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");

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
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);
    };

    const handleAddTransaction = async (type) => {
        if (!amount || !category) return;
        await addDoc(collection(db, "transactions"), {
            userId: user.uid,
            type,
            amount: parseFloat(amount),
            category,
            timestamp: new Date(),
        });
        setAmount("");
        setCategory("");
        setShowIncomeForm(false);
        setShowExpenseForm(false);
        fetchTransactions();
    };

    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    const expenseByCategory = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

    const pieData = Object.keys(expenseByCategory).map((cat) => ({
        name: cat,
        value: expenseByCategory[cat],
    }));

    const barData = [
        { name: "Income", amount: income },
        { name: "Expenses", amount: expenses },
    ];

    if (!user || !profile) return null;

    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-green-900">
                    Welcome, {profile.firstName} 👋
                </h1>
                <button
                    onClick={() => firebaseSignOut().then(() => router.push("/"))}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Sign Out
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white shadow p-4 rounded text-center">
                    <h2 className="text-green-600 font-semibold">Income</h2>
                    <p className="text-gray-400 text-2xl">${income.toFixed(2)}</p>
                </div>
                <div className="bg-white shadow p-4 rounded text-center">
                    <h2 className="text-red-500 font-semibold">Expenses</h2>
                    <p className="text-gray-400 text-2xl">${expenses.toFixed(2)}</p>
                </div>
                <div className="bg-white shadow p-4 rounded text-center">
                    <h2 className="text-gray-700 font-semibold">Balance</h2>
                    <p className="text-gray-400 text-2xl">${balance.toFixed(2)}</p>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => {
                        setShowIncomeForm(true);
                        setShowExpenseForm(false);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Add Income
                </button>
                <button
                    onClick={() => {
                        setShowExpenseForm(true);
                        setShowIncomeForm(false);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Add Expense
                </button>
            </div>

            {(showIncomeForm || showExpenseForm) && (
                <div className="bg-white p-6 rounded shadow mb-8">
                    <h3 className="text-lg font-semibold mb-4">
                        {showIncomeForm ? "Add Income" : "Add Expense"}
                    </h3>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border p-2 rounded mb-4 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border p-2 rounded mb-4 w-full"
                    />
                    <button
                        onClick={() =>
                            handleAddTransaction(showIncomeForm ? "income" : "expense")
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                    >
                        Submit
                    </button>
                </div>
            )}

            {/* Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-green-900 font-semibold mb-4">Expenses by Category</h2>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={100}
                                    fill="#82ca9d"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-400">No expense data</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-green-900 font-semibold mb-4">Income vs Expenses</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount">
                                {barData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.name === "Income" ? "#00C49F" : "#FF6666"} // ✅ Green for Income, Red for Expenses
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white p-6 rounded shadow mt-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-green-900 font-semibold text-lg">Recent Transactions</h2>
                    <button
                        onClick={() => router.push("/transactions")}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        See All
                    </button>

                </div>
                <ul className="divide-y divide-gray-200">
                    {transactions
                        .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()) // newest first
                        .slice(0, 5)
                        .map((t, index) => (
                            <li key={index} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{t.category}</p>
                                    <p className="text-xs text-gray-400">
                                        {t.timestamp?.toDate().toLocaleDateString()}
                                    </p>
                                </div>
                                <div className={`${t.type === "income" ? "text-green-500" : "text-red-500"} font-semibold`}>
                                    {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                                </div>
                            </li>
                        ))}
                </ul>
            </div>

        </main>
    );
}
