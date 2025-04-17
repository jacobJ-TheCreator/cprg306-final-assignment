"use client";

import { useUserAuth } from "./_utils/authContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, googleSignIn, firebaseSignOut } = useUserAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await googleSignIn();
      router.push("/overview");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      {!user ? (
        <>
          <h1 className="text-4xl font-bold mb-4">Welcome to ZenBudget</h1>
          <p className="text-lg mb-6 text-center max-w-md">
            Take control of your finances effortlessly.
          </p>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login with Google
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl mb-2">Welcome, {user.displayName || user.email}!</h1>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
            <a
              href="/overview"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Overview
            </a>
          </div>
        </>
      )}
    </main>
  );
}
