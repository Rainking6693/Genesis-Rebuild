import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessSync Pro',
  description: 'AI-powered employee wellness automation platform that integrates with workplace tools to predict burnout, suggest personalized interventions, and track team mental health metrics in real-time. Combines micro-wellness check-ins with automated coaching recommendations to prevent productivity drops before they happen.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessSync Pro</h1>
      <p className="mt-4 text-lg">AI-powered employee wellness automation platform that integrates with workplace tools to predict burnout, suggest personalized interventions, and track team mental health metrics in real-time. Combines micro-wellness check-ins with automated coaching recommendations to prevent productivity drops before they happen.</p>
    </main>
  )
}
