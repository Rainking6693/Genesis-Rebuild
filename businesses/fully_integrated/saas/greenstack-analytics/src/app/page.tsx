import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GreenStack Analytics',
  description: 'AI-powered sustainability tracking platform that automatically calculates and optimizes carbon footprints for e-commerce businesses while turning eco-achievements into customer acquisition tools. Combines real-time environmental impact monitoring with automated green marketing campaigns that boost sales and customer loyalty.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">GreenStack Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability tracking platform that automatically calculates and optimizes carbon footprints for e-commerce businesses while turning eco-achievements into customer acquisition tools. Combines real-time environmental impact monitoring with automated green marketing campaigns that boost sales and customer loyalty.</p>
    </main>
  )
}
