import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodBoard Analytics',
  description: 'AI-powered platform that analyzes team communication patterns (Slack, email, meetings) to predict burnout risks and automatically suggest personalized wellness interventions before productivity drops. Think of it as a 'check engine light' for team mental health that integrates seamlessly into existing remote work tools.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodBoard Analytics</h1>
      <p className="mt-4 text-lg">AI-powered platform that analyzes team communication patterns (Slack, email, meetings) to predict burnout risks and automatically suggest personalized wellness interventions before productivity drops. Think of it as a 'check engine light' for team mental health that integrates seamlessly into existing remote work tools.</p>
    </main>
  )
}
