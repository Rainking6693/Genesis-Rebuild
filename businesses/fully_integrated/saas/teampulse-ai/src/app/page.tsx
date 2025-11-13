import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TeamPulse AI',
  description: 'AI-powered mental wellness dashboard that automatically analyzes team communication patterns (Slack, email, meetings) to predict burnout risk and suggest personalized interventions before problems escalate. Unlike generic wellness apps, it provides actionable insights for managers while protecting employee privacy through anonymized sentiment analysis.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">TeamPulse AI</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness dashboard that automatically analyzes team communication patterns (Slack, email, meetings) to predict burnout risk and suggest personalized interventions before problems escalate. Unlike generic wellness apps, it provides actionable insights for managers while protecting employee privacy through anonymized sentiment analysis.</p>
    </main>
  )
}
