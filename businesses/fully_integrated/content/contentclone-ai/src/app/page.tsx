import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ContentClone AI',
  description: 'AI-powered platform that analyzes your top-performing content across platforms and automatically generates similar high-converting variations for consistent audience growth. Uses machine learning to identify your unique voice patterns and content DNA to create authentic, brand-consistent content at scale.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ContentClone AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that analyzes your top-performing content across platforms and automatically generates similar high-converting variations for consistent audience growth. Uses machine learning to identify your unique voice patterns and content DNA to create authentic, brand-consistent content at scale.</p>
    </main>
  )
}
