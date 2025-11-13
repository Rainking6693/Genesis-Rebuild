import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoTeam Pulse',
  description: 'AI-powered platform that gamifies workplace sustainability while boosting remote team engagement through collaborative climate challenges and mental wellness tracking. Combines carbon footprint reduction with team building activities that improve employee satisfaction and company ESG scores.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoTeam Pulse</h1>
      <p className="mt-4 text-lg">AI-powered platform that gamifies workplace sustainability while boosting remote team engagement through collaborative climate challenges and mental wellness tracking. Combines carbon footprint reduction with team building activities that improve employee satisfaction and company ESG scores.</p>
    </main>
  )
}
