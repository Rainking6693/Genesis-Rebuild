import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFleet Insights',
  description: 'AI-powered platform that automatically tracks, analyzes, and optimizes small businesses' carbon footprint while generating compliance reports and cost-saving recommendations. Combines real-time sustainability scoring with automated workflow suggestions that reduce both environmental impact and operational costs.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFleet Insights</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically tracks, analyzes, and optimizes small businesses' carbon footprint while generating compliance reports and cost-saving recommendations. Combines real-time sustainability scoring with automated workflow suggestions that reduce both environmental impact and operational costs.</p>
    </main>
  )
}
