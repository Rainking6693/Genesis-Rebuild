import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeetingMind AI',
  description: 'AI-powered meeting intelligence platform that automatically captures, analyzes, and transforms team meetings into actionable insights, mental health check-ins, and productivity recommendations. It combines remote work optimization with proactive team wellness monitoring to prevent burnout while maximizing collaboration effectiveness.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MeetingMind AI</h1>
      <p className="mt-4 text-lg">AI-powered meeting intelligence platform that automatically captures, analyzes, and transforms team meetings into actionable insights, mental health check-ins, and productivity recommendations. It combines remote work optimization with proactive team wellness monitoring to prevent burnout while maximizing collaboration effectiveness.</p>
    </main>
  )
}
