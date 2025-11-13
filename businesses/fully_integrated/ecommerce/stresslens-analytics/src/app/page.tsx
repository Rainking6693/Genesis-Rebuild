import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StressLens Analytics',
  description: 'AI-powered workplace mental health platform that analyzes team communication patterns (Slack, emails, meetings) to predict burnout risk and automatically generates personalized wellness interventions. Combines mental health monitoring with productivity analytics to help small businesses retain talent and reduce stress-related turnover.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StressLens Analytics</h1>
      <p className="mt-4 text-lg">AI-powered workplace mental health platform that analyzes team communication patterns (Slack, emails, meetings) to predict burnout risk and automatically generates personalized wellness interventions. Combines mental health monitoring with productivity analytics to help small businesses retain talent and reduce stress-related turnover.</p>
    </main>
  )
}
