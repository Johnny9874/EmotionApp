"use client"
import { useEffect, useState } from "react"
import { createClient } from '@/lib/supabaseClient'


export default function AuthPage() {
  const supabase = createClient()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
     })
  }

  const handleEmailSignIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }

  const handleEmailSignUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-emerald-100 to-emerald-300 p-6">
      <div className="bg-white/80 rounded-xl shadow-lg p-10 flex flex-col items-center max-w-md w-full">
        {!session ? (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616494.png"
              alt="Connexion EmotionApp"
              className="w-16 h-16 mb-4 drop-shadow-lg"
            />
            <h1 className="text-3xl font-extrabold text-emerald-800 mb-2 text-center">Sign In / Sign Up</h1>
            <p className="text-emerald-900 mb-6 text-center text-base">Access your personal space to track your emotions.</p>
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg font-semibold mb-4 shadow"
            >
              Continue with Google
            </button>
            {/* simple email version */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const email = (e.target as any).email.value
                const password = (e.target as any).password.value
                handleEmailSignIn(email, password)
              }}
              className="flex flex-col gap-3 w-full"
            >
              <input name="email" placeholder="Email" className="border border-emerald-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-black" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="border border-emerald-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-black"
              />
              <button className="w-full bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-lg font-semibold mt-2 shadow">
                Log In
              </button>
            </form>
            <div className="mt-4 text-sm text-emerald-800/80 text-center">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-emerald-700 font-semibold hover:underline cursor-pointer"
              >
                Sign up
              </a>
            </div>
          </>
        ) : (
          <>
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616494.png"
              alt="Bienvenue EmotionApp"
              className="w-16 h-16 mb-4 drop-shadow-lg"
            />
            <h1 className="text-3xl font-extrabold text-emerald-800 mb-2 text-center">Welcome !</h1>
            <p className="text-emerald-900 mb-6 text-center text-base">You are logged in to EmotionApp.</p>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-500 hover:bg-gray-600 transition text-white px-4 py-2 rounded-lg font-semibold shadow"
            >
              Log Out
            </button>
          </>
        )}
      </div>
      <footer className="mt-10 text-emerald-800/70 text-sm">© {new Date().getFullYear()} EmotionApp. Tous droits réservés.</footer>
    </main>
  )
}
