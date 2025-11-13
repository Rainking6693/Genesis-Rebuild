import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodFlow Analytics',
  description: 'AI-powered mental wellness platform that automatically tracks team mood patterns through Slack/Teams integration and provides managers with actionable insights to prevent burnout before it happens. Combines real-time sentiment analysis with personalized wellness content recommendations for each team member.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodFlow Analytics</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness platform that automatically tracks team mood patterns through Slack/Teams integration and provides managers with actionable insights to prevent burnout before it happens. Combines real-time sentiment analysis with personalized wellness content recommendations for each team member.</p>
    </main>
  )
}
