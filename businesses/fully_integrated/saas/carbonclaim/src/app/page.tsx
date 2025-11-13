import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonClaim',
  description: 'AI-powered platform that automatically tracks e-commerce businesses' carbon footprint across their supply chain and generates verified sustainability reports for customers at checkout. Transforms climate compliance from a cost center into a competitive advantage by enabling real-time carbon transparency that drives customer loyalty and premium pricing.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonClaim</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically tracks e-commerce businesses' carbon footprint across their supply chain and generates verified sustainability reports for customers at checkout. Transforms climate compliance from a cost center into a competitive advantage by enabling real-time carbon transparency that drives customer loyalty and premium pricing.</p>
    </main>
  )
}
