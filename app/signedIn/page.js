"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "@/app/_utils/authContext";
import { db } from "@/app/_utils/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#8884d8", "#FF6666", "#4ade80", "#facc15"];
const incomeCategories = ["Job", "Investments", "Tax refunds", "MISC"];
const expenseCategories = ["Mortgage/Rent", "Groceries", "Entertainment", "Insurance", "Gas", "MISC"];

const categoryColors = {
    Job: "#4ade80",
    Investments: "#60a5fa",
    "Tax refunds": "#fbbf24",
    MISC: "#a78bfa",
    "Mortgage/Rent": "#f87171",
    Groceries: "#34d399",
    Entertainment: "#facc15",
    Insurance: "#60a5fa",
    Gas: "#fb923c",
};

export default function SignedInPage() {
    const { user, profile, firebaseSignOut } = useUserAuth();
    const router = useRouter();

    const [transactions, setTransactions] = useState([]);
    const [showIncomeForm, setShowIncomeForm] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [editingTransaction, setEditingTransaction] = useState(null);

    useEffect(() => {
        if (!user) router.push("/login");
        else fetchTransactions();
    }, [user]);

    const fetchTransactions = async () => {
        const q = query(collection(db, "transactions"), where("userId", "==", user.uid), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);
    };

    const handleAddOrUpdate = async (type) => {
        if (!amount || !category) return;

        if (editingTransaction) {
            const docRef = doc(db, "transactions", editingTransaction.id);
            await updateDoc(docRef, {
                amount: parseFloat(amount),
                category,
                timestamp: new Date(),
            });
        } else {
            await addDoc(collection(db, "transactions"), {
                userId: user.uid,
                type,
                amount: parseFloat(amount),
                category,
                timestamp: new Date(),
            });
        }

        setAmount("");
        setCategory("");
        setShowIncomeForm(false);
        setShowExpenseForm(false);
        setEditingTransaction(null);
        fetchTransactions();
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setAmount(transaction.amount);
        setCategory(transaction.category);
        if (transaction.type === "income") {
            setShowIncomeForm(true);
            setShowExpenseForm(false);
        } else {
            setShowExpenseForm(true);
            setShowIncomeForm(false);
        }
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "transactions", id));
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
                <h1 className="text-3xl font-bold text-green-900">Welcome, {profile.firstName} 👋</h1>
                <button onClick={() => firebaseSignOut().then(() => router.push("/"))} className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
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
                    <p className={`text-2xl ${balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        ${balance.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <button onClick={() => { setShowIncomeForm(true); setShowExpenseForm(false); setEditingTransaction(null); }} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Income
                </button>
                <button onClick={() => { setShowExpenseForm(true); setShowIncomeForm(false); setEditingTransaction(null); }} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Expense
                </button>
            </div>

            {(showIncomeForm || showExpenseForm) && (
                <div className="bg-white p-6 rounded shadow mb-8">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingTransaction ? "Edit Transaction" : showIncomeForm ? "Add Income" : "Add Expense"}
                    </h3>
                    <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="border p-2 rounded mb-4 w-full" />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded mb-4 w-full">
                        <option value="">Select Category</option>
                        {(showIncomeForm ? incomeCategories : expenseCategories).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button onClick={() => handleAddOrUpdate(showIncomeForm ? "income" : "expense")} className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700 w-full">
                        {editingTransaction ? "Update" : "Submit"}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-green-900 font-semibold mb-4">Expenses by Category</h2>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-center text-black">No expense data</p>}
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
                                    <Cell key={`bar-${index}`} fill={entry.name === "Income" ? "#4ade80" : "#f87171"} />
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
                        <div key={transaction.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: categoryColors[transaction.category] || "#ddd", color: "#000" }}>
                                    {transaction.category}
                                </span>
                                <span className={`${transaction.type === "income" ? "text-green-600" : "text-red-500"} font-semibold`}>
                                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleEdit(transaction)} 
                                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(transaction.id)} 
                                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => router.push("/transactions")} className="mt-4 text-green-700 hover:underline flex-between">
                    See all transactions →
                </button>
            </div>
        </main>
    );
}
