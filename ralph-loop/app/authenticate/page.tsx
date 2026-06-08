"use client";

import { useState } from "react";
import SignUpForm from "@/components/SignUpForm";
import LoginForm from "@/components/LoginForm";

export default function AuthenticatePage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">NoteApp</h1>
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
          <div className="flex mb-6 border-b border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                mode === "login"
                  ? "border-b-2 border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "border-b-2 border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              Sign up
            </button>
          </div>
          {mode === "login" ? <LoginForm /> : <SignUpForm />}
        </div>
      </div>
    </main>
  );
}
