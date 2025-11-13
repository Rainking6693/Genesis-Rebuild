import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodSync',
  description: 'AI-powered platform that automatically adjusts remote team productivity tools and meeting schedules based on real-time collective mood analysis from Slack/Teams communications. Combines mental health awareness with remote work optimization to boost team performance while preventing burnout.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodSync</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically adjusts remote team productivity tools and meeting schedules based on real-time collective mood analysis from Slack/Teams communications. Combines mental health awareness with remote work optimization to boost team performance while preventing burnout.</p>
    </main>
  )
}
