import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodSync Pro',
  description: 'AI-powered workplace wellness platform that analyzes team communication patterns to predict burnout risks and automatically generates personalized mental health content and interventions. Combines sentiment analysis of Slack/Teams messages with curated wellness resources to create a proactive mental health safety net for remote teams.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodSync Pro</h1>
      <p className="mt-4 text-lg">AI-powered workplace wellness platform that analyzes team communication patterns to predict burnout risks and automatically generates personalized mental health content and interventions. Combines sentiment analysis of Slack/Teams messages with curated wellness resources to create a proactive mental health safety net for remote teams.</p>
    </main>
  )
}
