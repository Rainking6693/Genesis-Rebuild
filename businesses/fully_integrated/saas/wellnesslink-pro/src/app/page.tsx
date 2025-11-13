import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessLink Pro',
  description: 'AI-powered employee wellness platform that automatically creates personalized health challenges and tracks team engagement through Slack/Teams integration. Combines gamified wellness tracking with community-driven accountability to reduce healthcare costs and boost productivity for small businesses.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessLink Pro</h1>
      <p className="mt-4 text-lg">AI-powered employee wellness platform that automatically creates personalized health challenges and tracks team engagement through Slack/Teams integration. Combines gamified wellness tracking with community-driven accountability to reduce healthcare costs and boost productivity for small businesses.</p>
    </main>
  )
}
