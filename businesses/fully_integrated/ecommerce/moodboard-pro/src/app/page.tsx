import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodBoard Pro',
  description: 'AI-powered employee wellness dashboard that automatically detects team burnout patterns through Slack/Teams integration and provides personalized mental health recommendations. Combines anonymous mood tracking with actionable management insights to prevent turnover and boost productivity.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodBoard Pro</h1>
      <p className="mt-4 text-lg">AI-powered employee wellness dashboard that automatically detects team burnout patterns through Slack/Teams integration and provides personalized mental health recommendations. Combines anonymous mood tracking with actionable management insights to prevent turnover and boost productivity.</p>
    </main>
  )
}
