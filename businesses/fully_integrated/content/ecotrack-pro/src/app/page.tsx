import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoTrack Pro',
  description: 'AI-powered carbon footprint tracking and ESG reporting platform that automatically generates compliance-ready sustainability reports for small businesses. Combines real-time data collection with expert content templates to help companies meet ESG requirements and attract eco-conscious customers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoTrack Pro</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking and ESG reporting platform that automatically generates compliance-ready sustainability reports for small businesses. Combines real-time data collection with expert content templates to help companies meet ESG requirements and attract eco-conscious customers.</p>
    </main>
  )
}
