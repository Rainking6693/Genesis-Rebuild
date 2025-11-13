import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoGrow Advisor',
  description: 'AI-powered sustainability consultant that creates personalized carbon reduction roadmaps and automated compliance reports for small businesses. Combines real-time environmental data with business operations to generate actionable insights and track ROI on green initiatives.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoGrow Advisor</h1>
      <p className="mt-4 text-lg">AI-powered sustainability consultant that creates personalized carbon reduction roadmaps and automated compliance reports for small businesses. Combines real-time environmental data with business operations to generate actionable insights and track ROI on green initiatives.</p>
    </main>
  )
}
