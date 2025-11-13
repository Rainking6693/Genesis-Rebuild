import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeetingMind',
  description: 'AI-powered meeting intelligence platform that automatically generates actionable insights, tracks decision patterns, and creates searchable meeting knowledge bases for remote teams. Transforms scattered meeting content into a strategic business asset with automated follow-ups and team performance analytics.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MeetingMind</h1>
      <p className="mt-4 text-lg">AI-powered meeting intelligence platform that automatically generates actionable insights, tracks decision patterns, and creates searchable meeting knowledge bases for remote teams. Transforms scattered meeting content into a strategic business asset with automated follow-ups and team performance analytics.</p>
    </main>
  )
}
