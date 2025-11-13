import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Burnout Radar',
  description: 'AI-powered platform that analyzes team communication patterns (Slack, email, calendars) to predict and prevent employee burnout before it happens. Provides personalized wellness interventions and manager dashboards with actionable insights to improve team mental health and productivity.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Burnout Radar</h1>
      <p className="mt-4 text-lg">AI-powered platform that analyzes team communication patterns (Slack, email, calendars) to predict and prevent employee burnout before it happens. Provides personalized wellness interventions and manager dashboards with actionable insights to improve team mental health and productivity.</p>
    </main>
  )
}
