import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoMetrics Pro',
  description: 'AI-powered sustainability reporting platform that automatically generates compliance-ready ESG reports and carbon footprint dashboards for small businesses. Transforms complex environmental data into investor-ready content and regulatory documentation within minutes.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoMetrics Pro</h1>
      <p className="mt-4 text-lg">AI-powered sustainability reporting platform that automatically generates compliance-ready ESG reports and carbon footprint dashboards for small businesses. Transforms complex environmental data into investor-ready content and regulatory documentation within minutes.</p>
    </main>
  )
}
