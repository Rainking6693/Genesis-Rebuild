import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetailPulse AI',
  description: 'AI-powered micro-learning platform that delivers personalized, bite-sized retail training content based on real-time store performance data and customer feedback. Transforms generic employee training into dynamic, store-specific skill development that directly impacts sales metrics.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetailPulse AI</h1>
      <p className="mt-4 text-lg">AI-powered micro-learning platform that delivers personalized, bite-sized retail training content based on real-time store performance data and customer feedback. Transforms generic employee training into dynamic, store-specific skill development that directly impacts sales metrics.</p>
    </main>
  )
}
