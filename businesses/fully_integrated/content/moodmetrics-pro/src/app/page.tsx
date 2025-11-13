import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodMetrics Pro',
  description: 'AI-powered workplace wellness platform that automatically tracks team emotional health through Slack/Teams conversations and generates actionable mental health insights for managers. Combines sentiment analysis with personalized wellness content delivery to prevent burnout before it happens.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodMetrics Pro</h1>
      <p className="mt-4 text-lg">AI-powered workplace wellness platform that automatically tracks team emotional health through Slack/Teams conversations and generates actionable mental health insights for managers. Combines sentiment analysis with personalized wellness content delivery to prevent burnout before it happens.</p>
    </main>
  )
}
