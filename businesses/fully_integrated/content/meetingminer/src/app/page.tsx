import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeetingMiner',
  description: 'AI-powered meeting intelligence platform that automatically extracts actionable insights, decisions, and follow-ups from recorded meetings, then generates personalized learning content and process improvements for teams. Transforms boring meeting recordings into valuable knowledge assets and training materials that help teams work smarter.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MeetingMiner</h1>
      <p className="mt-4 text-lg">AI-powered meeting intelligence platform that automatically extracts actionable insights, decisions, and follow-ups from recorded meetings, then generates personalized learning content and process improvements for teams. Transforms boring meeting recordings into valuable knowledge assets and training materials that help teams work smarter.</p>
    </main>
  )
}
