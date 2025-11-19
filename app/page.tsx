"use client"
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-emerald-100 to-emerald-300 p-6">
      <div className="bg-white/80 rounded-xl shadow-lg p-10 flex flex-col items-center max-w-lg w-full">
        <img
          src="https://cdn-icons-png.flaticon.com/512/616/616494.png"
          alt="Émotion Logo"
          className="w-24 h-24 mb-6 drop-shadow-lg"
        />
        <h1 className="text-4xl font-extrabold text-emerald-800 mb-2 text-center">Welcome on EmotionApp</h1>
        <p className="text-lg text-emerald-900 mb-8 text-center">
          Analyze, track, and understand your emotions daily.<br />
          Log in to start your journey towards emotional well-being.
        </p>
        <Link href="/auth" className="w-full">
          <button className="w-full bg-emerald-700 hover:bg-emerald-800 transition rounded-lg text-white p-3 font-bold text-lg shadow-md">
            Sign In / Sign Up
          </button>
        </Link>
      </div>
      <footer className="mt-10 text-emerald-800/70 text-sm">© {new Date().getFullYear()} EmotionApp. All rights reserved.</footer>
    </main>
  );
}
