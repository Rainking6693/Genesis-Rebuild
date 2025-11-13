import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodSync Pro',
  description: 'AI-powered workplace mental health platform that analyzes team communication patterns to predict burnout risks and automatically suggests personalized wellness interventions. Combines sentiment analysis of Slack/Teams messages with productivity metrics to create actionable mental health dashboards for managers and HR teams.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodSync Pro</h1>
      <p className="mt-4 text-lg">AI-powered workplace mental health platform that analyzes team communication patterns to predict burnout risks and automatically suggests personalized wellness interventions. Combines sentiment analysis of Slack/Teams messages with productivity metrics to create actionable mental health dashboards for managers and HR teams.</p>
    </main>
  )
}
