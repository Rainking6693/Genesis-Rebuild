import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community Pulse',
  description: 'AI-powered community health analytics that transforms Discord/Slack conversations into actionable business insights for remote teams and creator communities. Automatically detects engagement patterns, sentiment shifts, and revenue opportunities hidden in your community chatter.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Community Pulse</h1>
      <p className="mt-4 text-lg">AI-powered community health analytics that transforms Discord/Slack conversations into actionable business insights for remote teams and creator communities. Automatically detects engagement patterns, sentiment shifts, and revenue opportunities hidden in your community chatter.</p>
    </main>
  )
}
