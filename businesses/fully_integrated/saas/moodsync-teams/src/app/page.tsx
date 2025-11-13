import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodSync Teams',
  description: 'AI-powered emotional intelligence platform that analyzes team communication patterns across Slack/Teams to predict burnout, optimize meeting schedules, and suggest personalized wellness interventions. Combines remote work optimization with proactive mental health support through automated sentiment analysis and behavioral pattern recognition.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodSync Teams</h1>
      <p className="mt-4 text-lg">AI-powered emotional intelligence platform that analyzes team communication patterns across Slack/Teams to predict burnout, optimize meeting schedules, and suggest personalized wellness interventions. Combines remote work optimization with proactive mental health support through automated sentiment analysis and behavioral pattern recognition.</p>
    </main>
  )
}
