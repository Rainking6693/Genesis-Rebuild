import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeetingMind AI',
  description: 'AI-powered platform that transforms chaotic meeting recordings into actionable business intelligence, automatically generating follow-up tasks, risk assessments, and strategic insights. Unlike basic transcription tools, it creates a searchable knowledge base that identifies patterns, tracks commitments, and predicts project outcomes across your entire organization.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MeetingMind AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that transforms chaotic meeting recordings into actionable business intelligence, automatically generating follow-up tasks, risk assessments, and strategic insights. Unlike basic transcription tools, it creates a searchable knowledge base that identifies patterns, tracks commitments, and predicts project outcomes across your entire organization.</p>
    </main>
  )
}
