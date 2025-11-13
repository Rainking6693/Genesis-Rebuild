import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodMetrics AI',
  description: 'AI-powered workplace wellness dashboard that analyzes team communication patterns to predict burnout risks and provides personalized mental health interventions. Transforms Slack/Teams data into actionable wellness insights for small business managers who want to prevent employee turnover before it happens.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodMetrics AI</h1>
      <p className="mt-4 text-lg">AI-powered workplace wellness dashboard that analyzes team communication patterns to predict burnout risks and provides personalized mental health interventions. Transforms Slack/Teams data into actionable wellness insights for small business managers who want to prevent employee turnover before it happens.</p>
    </main>
  )
}
