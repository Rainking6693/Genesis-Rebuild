import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodFlow Analytics',
  description: 'AI-powered employee wellness dashboard that automatically tracks team mood patterns through Slack/Teams interactions and provides actionable mental health insights for remote managers. Combines sentiment analysis with productivity metrics to prevent burnout before it happens and optimize team performance.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodFlow Analytics</h1>
      <p className="mt-4 text-lg">AI-powered employee wellness dashboard that automatically tracks team mood patterns through Slack/Teams interactions and provides actionable mental health insights for remote managers. Combines sentiment analysis with productivity metrics to prevent burnout before it happens and optimize team performance.</p>
    </main>
  )
}
