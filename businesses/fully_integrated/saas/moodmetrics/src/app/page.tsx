import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodMetrics',
  description: 'AI-powered team wellness dashboard that analyzes remote team communication patterns to predict burnout and automatically suggests personalized interventions. Combines mental health monitoring with productivity insights to help managers create healthier remote work environments.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodMetrics</h1>
      <p className="mt-4 text-lg">AI-powered team wellness dashboard that analyzes remote team communication patterns to predict burnout and automatically suggests personalized interventions. Combines mental health monitoring with productivity insights to help managers create healthier remote work environments.</p>
    </main>
  )
}
