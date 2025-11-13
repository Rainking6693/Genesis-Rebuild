import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoSpend Tracker',
  description: 'AI-powered platform that tracks your spending's carbon footprint in real-time and provides personalized climate-friendly alternatives to reduce both costs and environmental impact. Users get detailed sustainability reports, community challenges, and automated recommendations for eco-friendly purchases that often cost less.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoSpend Tracker</h1>
      <p className="mt-4 text-lg">AI-powered platform that tracks your spending's carbon footprint in real-time and provides personalized climate-friendly alternatives to reduce both costs and environmental impact. Users get detailed sustainability reports, community challenges, and automated recommendations for eco-friendly purchases that often cost less.</p>
    </main>
  )
}
