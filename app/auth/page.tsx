"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuthPage() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
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
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      {!session ? (
        <>
          <h1 className="text-2xl font-bold">Connexion / Inscription</h1>
          <button
            onClick={handleGoogleSignIn}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Continuer avec Google
          </button>
          {/* version email simple */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const email = (e.target as any).email.value
              const password = (e.target as any).password.value
              handleEmailSignIn(email, password)
            }}
            className="flex flex-col gap-2"
          >
            <input name="email" placeholder="Email" className="border p-2" />
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              className="border p-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Se connecter
            </button>
          </form>
        </>
      ) : (
        <>
          <h2>Connecté en tant que {session.user.email}</h2>
          <button onClick={handleLogout} className="bg-gray-600 text-white px-4 py-2 rounded">
            Se déconnecter
          </button>
        </>
      )}
    </main>
  )
}
