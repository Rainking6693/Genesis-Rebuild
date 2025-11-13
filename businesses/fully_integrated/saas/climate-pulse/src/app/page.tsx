import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Climate Pulse',
  description: 'AI-powered sustainability automation platform that helps small businesses automatically track, reduce, and monetize their carbon footprint through real-time integrations with their existing tools. Transforms climate compliance from a cost center into a revenue generator by identifying cost-saving opportunities and unlocking green incentives.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Climate Pulse</h1>
      <p className="mt-4 text-lg">AI-powered sustainability automation platform that helps small businesses automatically track, reduce, and monetize their carbon footprint through real-time integrations with their existing tools. Transforms climate compliance from a cost center into a revenue generator by identifying cost-saving opportunities and unlocking green incentives.</p>
    </main>
  )
}
