import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow Tracker',
  description: 'AI-powered carbon footprint analytics platform that automatically tracks and optimizes supply chain emissions for small e-commerce businesses. Generates compliance-ready sustainability reports and actionable reduction strategies while building customer trust through transparent environmental impact data.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow Tracker</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint analytics platform that automatically tracks and optimizes supply chain emissions for small e-commerce businesses. Generates compliance-ready sustainability reports and actionable reduction strategies while building customer trust through transparent environmental impact data.</p>
    </main>
  )
}
