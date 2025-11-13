import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodBoard AI',
  description: 'An AI-powered platform that generates personalized mental wellness content and productivity workflows based on real-time mood analysis and work patterns. Combines community support with automated coaching to help professionals optimize their daily performance and emotional well-being.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodBoard AI</h1>
      <p className="mt-4 text-lg">An AI-powered platform that generates personalized mental wellness content and productivity workflows based on real-time mood analysis and work patterns. Combines community support with automated coaching to help professionals optimize their daily performance and emotional well-being.</p>
    </main>
  )
}
