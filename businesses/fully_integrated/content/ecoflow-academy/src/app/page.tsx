import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow Academy',
  description: 'AI-powered sustainability training platform that creates personalized learning paths for small business teams to implement profitable green practices. Combines expert-curated content with AI coaching to transform environmental compliance from a cost center into a competitive advantage.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow Academy</h1>
      <p className="mt-4 text-lg">AI-powered sustainability training platform that creates personalized learning paths for small business teams to implement profitable green practices. Combines expert-curated content with AI coaching to transform environmental compliance from a cost center into a competitive advantage.</p>
    </main>
  )
}
