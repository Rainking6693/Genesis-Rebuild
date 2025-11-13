import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StressLens Pro',
  description: 'AI-powered workplace wellness platform that analyzes team communication patterns (Slack, email, calendar) to predict burnout risks and automatically generates personalized mental health interventions. Combines real-time stress detection with actionable wellness recommendations specifically designed for small business teams.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StressLens Pro</h1>
      <p className="mt-4 text-lg">AI-powered workplace wellness platform that analyzes team communication patterns (Slack, email, calendar) to predict burnout risks and automatically generates personalized mental health interventions. Combines real-time stress detection with actionable wellness recommendations specifically designed for small business teams.</p>
    </main>
  )
}
