import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodFlow Analytics',
  description: 'AI-powered platform that analyzes team communication patterns across Slack, email, and meetings to predict burnout, optimize workload distribution, and boost productivity through automated mental health insights. Combines workplace wellness monitoring with actionable AI recommendations that managers can implement immediately.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodFlow Analytics</h1>
      <p className="mt-4 text-lg">AI-powered platform that analyzes team communication patterns across Slack, email, and meetings to predict burnout, optimize workload distribution, and boost productivity through automated mental health insights. Combines workplace wellness monitoring with actionable AI recommendations that managers can implement immediately.</p>
    </main>
  )
}
