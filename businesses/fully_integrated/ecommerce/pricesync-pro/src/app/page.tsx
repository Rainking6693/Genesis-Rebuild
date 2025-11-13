import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PriceSync Pro',
  description: 'AI-powered dynamic pricing automation tool that monitors competitor prices in real-time and automatically adjusts your e-commerce product prices to maximize profit margins while staying competitive. Built specifically for small e-commerce businesses who can't afford enterprise pricing tools but need to compete with larger retailers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">PriceSync Pro</h1>
      <p className="mt-4 text-lg">AI-powered dynamic pricing automation tool that monitors competitor prices in real-time and automatically adjusts your e-commerce product prices to maximize profit margins while staying competitive. Built specifically for small e-commerce businesses who can't afford enterprise pricing tools but need to compete with larger retailers.</p>
    </main>
  )
}
