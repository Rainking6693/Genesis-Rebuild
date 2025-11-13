import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoTeam Hub',
  description: 'AI-powered platform that gamifies workplace sustainability initiatives by creating team challenges, tracking carbon footprint reduction, and providing automated compliance reporting for small businesses. Combines climate tech with community engagement through competitive leaderboards and automated carbon credit purchasing.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoTeam Hub</h1>
      <p className="mt-4 text-lg">AI-powered platform that gamifies workplace sustainability initiatives by creating team challenges, tracking carbon footprint reduction, and providing automated compliance reporting for small businesses. Combines climate tech with community engagement through competitive leaderboards and automated carbon credit purchasing.</p>
    </main>
  )
}
