import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoTrack Commerce',
  description: 'AI-powered sustainability analytics platform that helps e-commerce businesses automatically track, optimize, and market their environmental impact to boost sales with eco-conscious consumers. Small businesses get real-time carbon footprint insights, automated sustainability badges, and conversion-optimized green marketing tools that increase average order value by 15-30%.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoTrack Commerce</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that helps e-commerce businesses automatically track, optimize, and market their environmental impact to boost sales with eco-conscious consumers. Small businesses get real-time carbon footprint insights, automated sustainability badges, and conversion-optimized green marketing tools that increase average order value by 15-30%.</p>
    </main>
  )
}
