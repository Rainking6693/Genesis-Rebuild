import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindFlow Pro',
  description: 'AI-powered mental wellness platform that creates personalized stress management micro-courses for remote teams and small businesses. Combines real-time stress detection through work patterns with bite-sized, scientifically-backed wellness content delivered at optimal moments throughout the workday.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindFlow Pro</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness platform that creates personalized stress management micro-courses for remote teams and small businesses. Combines real-time stress detection through work patterns with bite-sized, scientifically-backed wellness content delivered at optimal moments throughout the workday.</p>
    </main>
  )
}
