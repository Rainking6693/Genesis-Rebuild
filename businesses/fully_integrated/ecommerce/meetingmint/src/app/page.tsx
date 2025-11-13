import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeetingMint',
  description: 'AI-powered SaaS that transforms chaotic remote meetings into actionable business outcomes by automatically generating smart follow-ups, tracking commitments, and creating accountability workflows. Unlike basic transcription tools, MeetingMint focuses on post-meeting execution and team accountability with viral sharing features that drive organic growth.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MeetingMint</h1>
      <p className="mt-4 text-lg">AI-powered SaaS that transforms chaotic remote meetings into actionable business outcomes by automatically generating smart follow-ups, tracking commitments, and creating accountability workflows. Unlike basic transcription tools, MeetingMint focuses on post-meeting execution and team accountability with viral sharing features that drive organic growth.</p>
    </main>
  )
}
