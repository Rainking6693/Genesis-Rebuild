import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoShift Analytics',
  description: 'AI-powered sustainability compliance platform that automatically tracks, analyzes, and optimizes small businesses' carbon footprint while generating regulatory reports and cost-saving recommendations. Transforms overwhelming climate regulations into actionable insights that save money and ensure compliance.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoShift Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability compliance platform that automatically tracks, analyzes, and optimizes small businesses' carbon footprint while generating regulatory reports and cost-saving recommendations. Transforms overwhelming climate regulations into actionable insights that save money and ensure compliance.</p>
    </main>
  )
}
