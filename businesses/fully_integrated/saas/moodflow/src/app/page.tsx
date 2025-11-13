import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodFlow',
  description: 'AI-powered mental wellness automation platform that monitors team emotional health through Slack/Teams integration and automatically triggers personalized wellness interventions. Combines real-time sentiment analysis with automated mental health resources to prevent burnout before it happens.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodFlow</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness automation platform that monitors team emotional health through Slack/Teams integration and automatically triggers personalized wellness interventions. Combines real-time sentiment analysis with automated mental health resources to prevent burnout before it happens.</p>
    </main>
  )
}
