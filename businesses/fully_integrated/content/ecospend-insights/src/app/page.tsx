import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoSpend Insights',
  description: 'AI-powered platform that analyzes e-commerce purchases to generate personalized sustainability reports and carbon offset recommendations. Helps conscious consumers track their environmental impact while discovering eco-friendly alternatives and earning rewards for sustainable choices.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoSpend Insights</h1>
      <p className="mt-4 text-lg">AI-powered platform that analyzes e-commerce purchases to generate personalized sustainability reports and carbon offset recommendations. Helps conscious consumers track their environmental impact while discovering eco-friendly alternatives and earning rewards for sustainable choices.</p>
    </main>
  )
}
