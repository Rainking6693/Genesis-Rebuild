import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow Creator',
  description: 'AI-powered sustainability content automation platform that helps small businesses create compliant ESG reports, green marketing content, and carbon footprint dashboards using no-code workflows. Transforms complex climate data into engaging content that drives customer acquisition and regulatory compliance.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow Creator</h1>
      <p className="mt-4 text-lg">AI-powered sustainability content automation platform that helps small businesses create compliant ESG reports, green marketing content, and carbon footprint dashboards using no-code workflows. Transforms complex climate data into engaging content that drives customer acquisition and regulatory compliance.</p>
    </main>
  )
}
