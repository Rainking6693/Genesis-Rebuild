import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow AI',
  description: 'AI-powered sustainability content generator that creates personalized carbon reduction action plans and engaging social media content for small businesses to showcase their green initiatives. Turns complex climate data into viral-ready content while providing actionable sustainability roadmaps that actually reduce costs and boost brand reputation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered sustainability content generator that creates personalized carbon reduction action plans and engaging social media content for small businesses to showcase their green initiatives. Turns complex climate data into viral-ready content while providing actionable sustainability roadmaps that actually reduce costs and boost brand reputation.</p>
    </main>
  )
}
