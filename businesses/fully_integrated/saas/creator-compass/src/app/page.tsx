import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creator Compass',
  description: 'AI-powered subscription optimization platform that helps content creators and small businesses automatically test, track, and maximize revenue from multiple subscription tiers across platforms. Combines creator economy tools with personal finance insights to turn one-time followers into recurring revenue streams through smart pricing psychology and retention automation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Creator Compass</h1>
      <p className="mt-4 text-lg">AI-powered subscription optimization platform that helps content creators and small businesses automatically test, track, and maximize revenue from multiple subscription tiers across platforms. Combines creator economy tools with personal finance insights to turn one-time followers into recurring revenue streams through smart pricing psychology and retention automation.</p>
    </main>
  )
}
