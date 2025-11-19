import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-xlm-roberta-base-sentiment',
      {
        headers: { 
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ inputs: text }),
      }
    )

    const contentType = response.headers.get('content-type') || ''

    if (!response.ok) {
      const bodyText = await response.text()
      console.error('Hugging Face API returned error', response.status, bodyText)
      return NextResponse.json(
        { error: `Hugging Face API error ${response.status}: ${bodyText.slice(0, 200)}` },
        { status: 502 }
      )
    }

    let data: any
    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.warn('Hugging Face returned non-JSON response:', text.slice(0, 200))
      return NextResponse.json({ error: 'Hugging Face returned non-JSON response', body: text }, { status: 502 })
    }

    // The format are: [[{label: "LABEL_0", score: 0.1}, {label: "LABEL_1", score: 0.2}, ...]]
    const labelMapping: Record<string, string> = {
      'negative': 'negative',
      'Negative': 'negative',
      'LABEL_0': 'negative',
      'neutral': 'neutral',
      'Neutral': 'neutral', 
      'LABEL_1': 'neutral',
      'positive': 'positive',
      'Positive': 'positive',
      'LABEL_2': 'positive',
    }

    // Find the label with the highest score
    const results = data?.[0] || []
    if (!Array.isArray(results) || results.length === 0) {
      console.error('Unexpected API response format:', data)
      return NextResponse.json({ error: 'Unexpected API response format' }, { status: 500 })
    }

    const topResult = results.reduce((max: any, curr: any) => 
      (curr.score > max.score ? curr : max), results[0])
    
    const emotion = labelMapping[topResult.label] || 'neutral'

    const feedbacks: Record<string, string> = {
      positive: "Feels like you are relaxed, keep going ! 🌞",
      negative: "You seem tense or sad. It's okay, take a minute to breathe 💛",
      neutral: "You seem calm. Nothing to change for now ✨",
    }

    // Register in Supabase with error handling
    try {
      await createClient().from('entries').insert({
        text,
        emotion,
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      // does not block the main response
      console.error('Supabase insert failed', err)
    }

    return NextResponse.json({ emotion, feedback: feedbacks[emotion] || '...' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
