import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFleet Pro',
  description: 'AI-powered SaaS platform that helps small businesses automatically track, optimize, and offset their delivery carbon footprint while providing customers with real-time sustainability scores. Combines climate tech with micro-SaaS tools to turn environmental compliance into a competitive advantage for SMBs.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFleet Pro</h1>
      <p className="mt-4 text-lg">AI-powered SaaS platform that helps small businesses automatically track, optimize, and offset their delivery carbon footprint while providing customers with real-time sustainability scores. Combines climate tech with micro-SaaS tools to turn environmental compliance into a competitive advantage for SMBs.</p>
    </main>
  )
}
