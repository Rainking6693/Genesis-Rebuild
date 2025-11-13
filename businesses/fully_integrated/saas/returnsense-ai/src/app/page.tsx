import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReturnSense AI',
  description: 'AI-powered returns management platform that automatically categorizes returned products, generates sustainability reports, and creates personalized retention campaigns to reduce future returns. Transforms e-commerce returns from pure cost centers into customer retention and sustainability optimization opportunities.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReturnSense AI</h1>
      <p className="mt-4 text-lg">AI-powered returns management platform that automatically categorizes returned products, generates sustainability reports, and creates personalized retention campaigns to reduce future returns. Transforms e-commerce returns from pure cost centers into customer retention and sustainability optimization opportunities.</p>
    </main>
  )
}
