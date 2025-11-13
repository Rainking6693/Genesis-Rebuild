import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodBoost Academy',
  description: 'AI-powered micro-learning platform that delivers personalized 3-minute mental wellness courses based on real-time mood tracking and workplace stress patterns. Combines bite-sized educational content with mood analytics to help professionals build resilience skills during their actual workday stress moments.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodBoost Academy</h1>
      <p className="mt-4 text-lg">AI-powered micro-learning platform that delivers personalized 3-minute mental wellness courses based on real-time mood tracking and workplace stress patterns. Combines bite-sized educational content with mood analytics to help professionals build resilience skills during their actual workday stress moments.</p>
    </main>
  )
}
