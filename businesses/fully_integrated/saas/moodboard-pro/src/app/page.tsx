import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodBoard Pro',
  description: 'AI-powered employee sentiment analytics platform that automatically detects team mood patterns through Slack/Teams communications and provides actionable mental health interventions for remote managers. Combines real-time emotional intelligence with personalized wellness recommendations to prevent burnout before it happens.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodBoard Pro</h1>
      <p className="mt-4 text-lg">AI-powered employee sentiment analytics platform that automatically detects team mood patterns through Slack/Teams communications and provides actionable mental health interventions for remote managers. Combines real-time emotional intelligence with personalized wellness recommendations to prevent burnout before it happens.</p>
    </main>
  )
}
