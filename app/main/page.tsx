"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient'

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/auth');
      }
      setCheckingSession(false);
    };
    checkSession();
  }, [router]);

  const handleAnalyze = async () => {
    setLoading(true);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('auth');
  };

  if (checkingSession) {
    return <div>Loading...</div> 
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-100 to-indigo-200 p-6">
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-indigo-200/60 transition-shadow duration-300 p-10 flex flex-col items-center max-w-lg w-full group">
        <div className="w-full flex justify-end mb-2">
          <Link href="/history" className="">
            <button className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all duration-200 rounded-lg text-white px-4 py-2 font-bold shadow shadow-indigo-200/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center gap-2">
              <span role="img" aria-label="History">📖</span> History
            </button>
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-5 text-center tracking-tight drop-shadow-sm">
          💭 What am I feeling right now...
        </h1>
        <textarea
          className="border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/60 p-3 w-80 h-32 rounded-lg resize-none shadow-sm mb-4 transition-all duration-200 text-indigo-900 bg-white/80 placeholder-indigo-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write freely here..."
        />
        <button
          onClick={handleAnalyze}
          className="w-40 mt-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all duration-200 rounded-lg text-white font-bold text-lg shadow-lg shadow-indigo-200/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>

        <button
            onClick={handleLogout}
            className="w-40 bg-red-500 hover:bg-gray-600 transition text-white px-1 py-2 mt-6 rounded-lg font-semibold shadow"
          >
            Log Out
        </button>

        {result && (
          <div className="mt-8 p-5 border border-indigo-100 bg-indigo-50/60 rounded-xl w-full text-center shadow-sm animate-fade-in">
            <p className="text-indigo-800 text-lg font-semibold">Detected emotion: <span className="font-extrabold">{result.emotion}</span></p>
            <p className="text-indigo-700 mt-2 italic">{result.feedback}</p>
          </div>
        )}
      </div>
    </main>
  );
}
