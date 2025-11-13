import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodFlow AI',
  description: 'AI-powered wellness automation platform that creates personalized daily mental health content and micro-interventions based on team mood analytics for small businesses. Combines anonymous employee sentiment tracking with automated delivery of targeted wellness resources, meditation scripts, and productivity tips.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered wellness automation platform that creates personalized daily mental health content and micro-interventions based on team mood analytics for small businesses. Combines anonymous employee sentiment tracking with automated delivery of targeted wellness resources, meditation scripts, and productivity tips.</p>
    </main>
  )
}
