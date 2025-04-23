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
    const snap = await getDocs(q);
    setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleAddOrUpdate = async (type) => {
    if (!amount || !category) return;
    if (editingTransaction) {
      await updateDoc(doc(db, "transactions", editingTransaction.id), {
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

  const handleEdit = txn => {
    setEditingTransaction(txn);
    setAmount(txn.amount);
    setCategory(txn.category);
    if (txn.type === "income") {
      setShowIncomeForm(true);
      setShowExpenseForm(false);
    } else {
      setShowExpenseForm(true);
      setShowIncomeForm(false);
    }
  };

  const handleDelete = async id => {
    await deleteDoc(doc(db, "transactions", id));
    fetchTransactions();
  };

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  const expenseByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  const barData = [
    { name: "Income", amount: income },
    { name: "Expenses", amount: expenses },
  ];

  if (!user || !profile) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-900">
            Welcome, {profile.firstName} 👋
          </h1>
          <button
            onClick={() =>
              firebaseSignOut().then(() => router.push("/"))
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-green-300 bg-white text-green-700 hover:bg-green-50 transition-shadow shadow-sm"
          >
            {/* logout icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            Sign Out
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Income", value: income, color: "text-green-600" },
            { label: "Expenses", value: expenses, color: "text-red-500" },
            {
              label: "Balance",
              value: balance,
              color: balance >= 0 ? "text-green-600" : "text-red-500",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white shadow p-6 rounded text-center"
            >
              <h2 className={`font-semibold ${color}`}>{label}</h2>
              <p className="text-2xl text-black">${value.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Add Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setShowIncomeForm(true);
              setShowExpenseForm(false);
              setEditingTransaction(null);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:shadow-md transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Income
          </button>
          <button
            onClick={() => {
              setShowExpenseForm(true);
              setShowIncomeForm(false);
              setEditingTransaction(null);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:shadow-md transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Expense
          </button>
        </div>

        {/* Add / Edit Form */}
        {(showIncomeForm || showExpenseForm) && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <h3 className="text-lg font-semibold">
              {editingTransaction
                ? "Edit Transaction"
                : showIncomeForm
                ? "Add Income"
                : "Add Expense"}
            </h3>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Category</option>
              {(showIncomeForm ? incomeCategories : expenseCategories).map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                handleAddOrUpdate(showIncomeForm ? "income" : "expense")
              }
              className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition"
            >
              {editingTransaction ? "Update" : "Submit"}
            </button>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-green-900 font-semibold mb-4">
              Expenses by Category
            </h2>
            {pieData.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={categoryColors[entry.name] || "#ddd"}
                      />
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
            <h2 className="text-green-900 font-semibold mb-4">
              Income vs Expenses
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#333" />
                <YAxis stroke="#333" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                  }}
                />
                <Bar dataKey="amount">
                  {barData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.name === "Income" ? "#4ade80" : "#f87171"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-green-900 font-semibold">Recent Transactions</h2>
          <div className="space-y-2">
            {transactions.slice(0, 5).map(txn => (
              <div
                key={txn.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor:
                        categoryColors[txn.category] || "#ddd",
                      color: "#000",
                    }}
                  >
                    {txn.category}
                  </span>
                  <span
                    className={`font-semibold ${
                      txn.type === "income"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {txn.type === "income" ? "+" : "-"}$
                    {txn.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(txn)}
                    className="p-1 text-gray-500 hover:text-blue-600"
                  >
                    {/* edit icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(txn.id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    {/* delete icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => router.push("/transactions")}
              className="text-green-700 hover:underline"
            >
              See all transactions →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
