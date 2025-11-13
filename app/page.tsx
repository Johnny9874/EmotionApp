"use client"
import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">💭 Ce que je ressens...</h1>
      <textarea
        className="border p-2 w-80 h-32 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écris librement ici..."
      />
      <button
        onClick={handleAnalyze}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Analyse...' : 'Analyser'}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded w-80 text-center">
          <p>Émotion détectée : <strong>{result.emotion}</strong></p>
          <p className="text-gray-600 mt-2">{result.feedback}</p>
        </div>
      )}
    </main>
  )
}
