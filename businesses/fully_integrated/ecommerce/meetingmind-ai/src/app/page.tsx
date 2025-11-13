import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeetingMind AI',
  description: 'AI-powered meeting intelligence platform that automatically generates actionable insights, tracks commitment follow-through, and creates personalized productivity reports for remote teams. Transforms chaotic meeting cultures into accountability-driven workflows that actually move business forward.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MeetingMind AI</h1>
      <p className="mt-4 text-lg">AI-powered meeting intelligence platform that automatically generates actionable insights, tracks commitment follow-through, and creates personalized productivity reports for remote teams. Transforms chaotic meeting cultures into accountability-driven workflows that actually move business forward.</p>
    </main>
  )
}
