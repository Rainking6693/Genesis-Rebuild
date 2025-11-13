import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonSync',
  description: 'AI-powered carbon footprint tracking and offset automation for e-commerce businesses that automatically calculates shipping emissions, purchases verified carbon credits, and generates sustainability marketing content. Transform every order into a competitive advantage by making your business provably carbon-negative while boosting customer loyalty through transparent climate action.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonSync</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking and offset automation for e-commerce businesses that automatically calculates shipping emissions, purchases verified carbon credits, and generates sustainability marketing content. Transform every order into a competitive advantage by making your business provably carbon-negative while boosting customer loyalty through transparent climate action.</p>
    </main>
  )
}
