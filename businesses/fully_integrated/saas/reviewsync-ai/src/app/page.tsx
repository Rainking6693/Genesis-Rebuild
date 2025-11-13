import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReviewSync AI',
  description: 'AI-powered platform that automatically monitors, analyzes, and responds to customer reviews across all major platforms while generating actionable insights to improve business operations. Combines review management with intelligent business intelligence to help small businesses turn customer feedback into competitive advantages.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReviewSync AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically monitors, analyzes, and responds to customer reviews across all major platforms while generating actionable insights to improve business operations. Combines review management with intelligent business intelligence to help small businesses turn customer feedback into competitive advantages.</p>
    </main>
  )
}
