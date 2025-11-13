import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creator Compass',
  description: 'AI-powered content intelligence platform that analyzes trending topics across 50+ platforms and generates personalized content briefs with viral hooks for creators and small business marketers. Combines real-time trend analysis with automated content strategy recommendations to help users create high-performing content consistently.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Creator Compass</h1>
      <p className="mt-4 text-lg">AI-powered content intelligence platform that analyzes trending topics across 50+ platforms and generates personalized content briefs with viral hooks for creators and small business marketers. Combines real-time trend analysis with automated content strategy recommendations to help users create high-performing content consistently.</p>
    </main>
  )
}
