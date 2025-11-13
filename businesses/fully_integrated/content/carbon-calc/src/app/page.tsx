import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Calc',
  description: 'AI-powered carbon footprint calculator and reduction planner specifically designed for small e-commerce businesses to track, reduce, and market their sustainability efforts. Combines real-time shipping data, inventory tracking, and automated ESG reporting with customer-facing sustainability badges and marketing content.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Calc</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint calculator and reduction planner specifically designed for small e-commerce businesses to track, reduce, and market their sustainability efforts. Combines real-time shipping data, inventory tracking, and automated ESG reporting with customer-facing sustainability badges and marketing content.</p>
    </main>
  )
}
