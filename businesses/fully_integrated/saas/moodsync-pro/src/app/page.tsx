import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodSync Pro',
  description: 'AI-powered team mood analytics platform that tracks employee mental wellness through Slack/Teams integration and automatically generates personalized wellness recommendations for managers. Combines real-time sentiment analysis with proactive mental health interventions to reduce burnout and boost remote team productivity.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodSync Pro</h1>
      <p className="mt-4 text-lg">AI-powered team mood analytics platform that tracks employee mental wellness through Slack/Teams integration and automatically generates personalized wellness recommendations for managers. Combines real-time sentiment analysis with proactive mental health interventions to reduce burnout and boost remote team productivity.</p>
    </main>
  )
}
