import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Compass',
  description: 'AI-powered carbon footprint tracking and offset marketplace specifically designed for remote-first small businesses to automatically monitor, reduce, and offset their distributed team's environmental impact. Combines real-time emissions tracking with curated sustainability actions and verified carbon offset purchases, turning climate responsibility into a competitive advantage for modern businesses.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Compass</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking and offset marketplace specifically designed for remote-first small businesses to automatically monitor, reduce, and offset their distributed team's environmental impact. Combines real-time emissions tracking with curated sustainability actions and verified carbon offset purchases, turning climate responsibility into a competitive advantage for modern businesses.</p>
    </main>
  )
}
