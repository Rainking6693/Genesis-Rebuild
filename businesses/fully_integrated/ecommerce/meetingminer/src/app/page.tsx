import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeetingMiner',
  description: 'AI-powered meeting intelligence platform that automatically extracts actionable insights, tasks, and decisions from video calls, then seamlessly integrates with project management tools. Transforms unproductive meeting culture into data-driven accountability systems for remote and hybrid teams.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MeetingMiner</h1>
      <p className="mt-4 text-lg">AI-powered meeting intelligence platform that automatically extracts actionable insights, tasks, and decisions from video calls, then seamlessly integrates with project management tools. Transforms unproductive meeting culture into data-driven accountability systems for remote and hybrid teams.</p>
    </main>
  )
}
