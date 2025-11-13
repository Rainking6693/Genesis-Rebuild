import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creator Pulse',
  description: 'AI-powered analytics platform that tracks and predicts creator economy trends, helping small businesses identify the perfect micro-influencers before they go viral. Combines real-time social media data with predictive algorithms to score creators on growth potential, audience authenticity, and brand alignment.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Creator Pulse</h1>
      <p className="mt-4 text-lg">AI-powered analytics platform that tracks and predicts creator economy trends, helping small businesses identify the perfect micro-influencers before they go viral. Combines real-time social media data with predictive algorithms to score creators on growth potential, audience authenticity, and brand alignment.</p>
    </main>
  )
}
