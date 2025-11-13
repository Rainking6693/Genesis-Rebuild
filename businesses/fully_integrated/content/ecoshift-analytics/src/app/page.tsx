import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoShift Analytics',
  description: 'AI-powered platform that generates personalized sustainability transition reports for e-commerce businesses, combining carbon footprint analysis with actionable profit-boosting recommendations. We turn environmental compliance from a cost center into a revenue driver by identifying eco-friendly optimizations that reduce costs and attract conscious consumers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoShift Analytics</h1>
      <p className="mt-4 text-lg">AI-powered platform that generates personalized sustainability transition reports for e-commerce businesses, combining carbon footprint analysis with actionable profit-boosting recommendations. We turn environmental compliance from a cost center into a revenue driver by identifying eco-friendly optimizations that reduce costs and attract conscious consumers.</p>
    </main>
  )
}
