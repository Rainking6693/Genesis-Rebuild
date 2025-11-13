import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreatorCash',
  description: 'AI-powered financial dashboard that automatically tracks, categorizes, and optimizes income streams for content creators across multiple platforms (YouTube, TikTok, Substack, etc.). Provides tax-ready reports, cash flow predictions, and personalized monetization recommendations based on audience analytics.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CreatorCash</h1>
      <p className="mt-4 text-lg">AI-powered financial dashboard that automatically tracks, categorizes, and optimizes income streams for content creators across multiple platforms (YouTube, TikTok, Substack, etc.). Provides tax-ready reports, cash flow predictions, and personalized monetization recommendations based on audience analytics.</p>
    </main>
  )
}
