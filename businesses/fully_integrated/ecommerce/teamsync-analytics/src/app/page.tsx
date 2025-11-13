import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TeamSync Analytics',
  description: 'AI-powered micro-SaaS that automatically tracks and optimizes remote team productivity by analyzing communication patterns across Slack, email, and project tools. Provides actionable insights and automated workflow suggestions to reduce meeting overhead and improve team efficiency by 30%.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">TeamSync Analytics</h1>
      <p className="mt-4 text-lg">AI-powered micro-SaaS that automatically tracks and optimizes remote team productivity by analyzing communication patterns across Slack, email, and project tools. Provides actionable insights and automated workflow suggestions to reduce meeting overhead and improve team efficiency by 30%.</p>
    </main>
  )
}
