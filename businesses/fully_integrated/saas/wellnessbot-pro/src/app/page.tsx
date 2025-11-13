import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessBot Pro',
  description: 'AI-powered employee wellness automation platform that creates personalized mental health check-ins, stress alerts, and team wellness dashboards for small businesses. Combines workplace mental health monitoring with automated intervention suggestions to reduce burnout and increase productivity.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessBot Pro</h1>
      <p className="mt-4 text-lg">AI-powered employee wellness automation platform that creates personalized mental health check-ins, stress alerts, and team wellness dashboards for small businesses. Combines workplace mental health monitoring with automated intervention suggestions to reduce burnout and increase productivity.</p>
    </main>
  )
}
