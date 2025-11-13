import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Review Radar',
  description: 'AI-powered review monitoring and response automation platform that tracks mentions across 50+ review sites, generates personalized responses using brand voice, and creates actionable reputation reports. Transforms overwhelming review management into a 10-minute weekly task for small businesses.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Review Radar</h1>
      <p className="mt-4 text-lg">AI-powered review monitoring and response automation platform that tracks mentions across 50+ review sites, generates personalized responses using brand voice, and creates actionable reputation reports. Transforms overwhelming review management into a 10-minute weekly task for small businesses.</p>
    </main>
  )
}
