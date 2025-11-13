import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TeamPulse AI',
  description: 'AI-powered mental health and productivity platform that automatically analyzes team communication patterns (Slack, email, meetings) to predict burnout risk and suggest personalized wellness interventions. Combines anonymous sentiment analysis with actionable remote work optimization recommendations for managers and HR teams.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">TeamPulse AI</h1>
      <p className="mt-4 text-lg">AI-powered mental health and productivity platform that automatically analyzes team communication patterns (Slack, email, meetings) to predict burnout risk and suggest personalized wellness interventions. Combines anonymous sentiment analysis with actionable remote work optimization recommendations for managers and HR teams.</p>
    </main>
  )
}
