import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HealthyTeam Pulse',
  description: 'AI-powered wellness automation platform that monitors team health metrics through Slack/Teams integration and automatically suggests personalized interventions to reduce burnout and boost productivity. Combines anonymous health check-ins with smart scheduling, break reminders, and team wellness challenges to create healthier remote work cultures.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">HealthyTeam Pulse</h1>
      <p className="mt-4 text-lg">AI-powered wellness automation platform that monitors team health metrics through Slack/Teams integration and automatically suggests personalized interventions to reduce burnout and boost productivity. Combines anonymous health check-ins with smart scheduling, break reminders, and team wellness challenges to create healthier remote work cultures.</p>
    </main>
  )
}
