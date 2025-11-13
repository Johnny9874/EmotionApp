# 💭 Emotion Analysis App

A Next.js web application that analyzes emotions in text using Hugging Face AI models and saves results to Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm
- Hugging Face account (free)
- Supabase account (free)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**

Copy `.env.local.example` to `.env.local` and fill in your keys:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:
- `HF_TOKEN`: Hugging Face token (https://huggingface.co/settings/tokens)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anon key

3. **Create the Supabase table**

In your Supabase project's SQL Editor, run:
```sql
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  emotion text,
  created_at timestamp with time zone default timezone('utc', now())
);
```

4. **Start the development server**
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📁 Project Structure

```
my-emotion-app/
├── app/
│   ├── page.tsx              # Home page (analysis form)
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       └── analyze/
│           └── route.ts      # API route for sentiment analysis
├── lib/
│   └── supabaseClient.ts     # Supabase client
├── .env.local.example        # Environment variables template
└── package.json
```

## 🛠️ Technologies

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (PostgreSQL database)
- **Hugging Face** (NLP model inference API)

## 📝 Notes

- The app uses the `cardiffnlp/twitter-xlm-roberta-base-sentiment` model for multilingual sentiment analysis.
- Detected emotions: `positive`, `negative`, `neutral`.
- Entries are automatically saved to Supabase after analysis.

## 🐛 Troubleshooting

- **404 Not Found**: Ensure `app/page.tsx` exists and delete the `.next` cache (`rm -rf .next`)
- **502 Bad Gateway on /api/analyze**: Verify that `HF_TOKEN` is defined and valid in `.env.local`
- **Supabase errors**: Confirm that the `entries` table exists and keys are correct in `.env.local`
