import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StressLens AI',
  description: 'AI-powered workplace stress monitoring platform that analyzes team communication patterns across Slack, email, and calendar data to predict burnout risks and automatically suggest personalized wellness interventions. Combines mental health insights with actionable business intelligence to reduce turnover and boost productivity.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StressLens AI</h1>
      <p className="mt-4 text-lg">AI-powered workplace stress monitoring platform that analyzes team communication patterns across Slack, email, and calendar data to predict burnout risks and automatically suggest personalized wellness interventions. Combines mental health insights with actionable business intelligence to reduce turnover and boost productivity.</p>
    </main>
  )
}
