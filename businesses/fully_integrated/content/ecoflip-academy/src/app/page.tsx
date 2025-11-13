import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlip Academy',
  description: 'AI-powered educational platform that teaches sustainable product sourcing and reselling strategies through interactive courses and real-time market analysis. Combines sustainability education with profitable e-commerce skills, targeting the growing eco-conscious entrepreneur market.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlip Academy</h1>
      <p className="mt-4 text-lg">AI-powered educational platform that teaches sustainable product sourcing and reselling strategies through interactive courses and real-time market analysis. Combines sustainability education with profitable e-commerce skills, targeting the growing eco-conscious entrepreneur market.</p>
    </main>
  )
}
