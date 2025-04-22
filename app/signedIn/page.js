"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "@/app/_utils/authContext";
import { db } from "@/app/_utils/firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#8884d8", "#FF6666", "#4ade80", "#facc15"];

const incomeCategories = ["Job", "Investments", "Tax refunds", "MISC"];
const expenseCategories = ["Mortgage/Rent", "Groceries", "Entertainment", "Insurance", "Gas", "MISC"];

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
        const q = query(collection(db, "transactions"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
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

    const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    const expenseByCategory = transactions.filter(t => t.type === "expense").reduce((acc, curr) => {
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
                    <p className="text-black text-2xl">${income.toFixed(2)}</p>
                </div>
                <div className="bg-white shadow p-4 rounded text-center">
                    <h2 className="text-red-500 font-semibold">Expenses</h2>
                    <p className="text-black text-2xl">${expenses.toFixed(2)}</p>
                </div>
                <div className="bg-white shadow p-4 rounded text-center">
                    <h2 className="text-black font-semibold">Balance</h2>
                    <p className="text-black text-2xl">${balance.toFixed(2)}</p>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => {
                        setShowIncomeForm(true);
                        setShowExpenseForm(false);
                    }}
                    className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600"
                >
                    Add Income
                </button>
                <button
                    onClick={() => {
                        setShowExpenseForm(true);
                        setShowIncomeForm(false);
                    }}
                    className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600"
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
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border p-2 rounded mb-4 w-full"
                    >
                        <option value="">Select Category</option>
                        {(showIncomeForm ? incomeCategories : expenseCategories).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => handleAddTransaction(showIncomeForm ? "income" : "expense")}
                        className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 w-full"
                    >
                        Submit
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-black">No expense data</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-green-900 font-semibold mb-4">Income vs Expenses</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <XAxis dataKey="name" stroke="black" />
                            <YAxis stroke="black" />
                            <Tooltip contentStyle={{ backgroundColor: "white", color: "black", border: "1px solid black" }} />
                            <Bar dataKey="amount">
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-bar-${index}`} fill={entry.name === "Income" ? "#4ade80" : "#f87171"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                </div>
            </div>

            <div className="bg-white p-6 rounded shadow mt-8">
                <h2 className="text-green-900 font-semibold mb-4">Recent Transactions</h2>
                <div className="space-y-2">
                    {transactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <span
                                    className="px-2 py-1 rounded text-xs font-semibold"
                                    style={{ backgroundColor: categoryColors[transaction.category] || "#ddd", color: "#000" }}
                                >
                                    {transaction.category}
                                </span>
                                <span className={`${transaction.type === "income" ? "text-green-600" : "text-red-500"} font-semibold`}>
                                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                                </span>
                            </div>
                            <span className="text-black text-sm">
                                {new Date(transaction.timestamp?.seconds * 1000).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => router.push("/transactions")}
                    className="mt-4 text-green-700 hover:underline"
                >
                    See all transactions →
                </button>
            </div>
        </main>
    );
}
