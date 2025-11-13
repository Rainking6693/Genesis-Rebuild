import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateScore Pro',
  description: 'AI-powered platform that instantly generates sustainability compliance reports and carbon footprint scores for small businesses, turning complex climate data into actionable insights and certification badges. Businesses get automated ESG reporting while unlocking green marketing opportunities and meeting supplier requirements.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateScore Pro</h1>
      <p className="mt-4 text-lg">AI-powered platform that instantly generates sustainability compliance reports and carbon footprint scores for small businesses, turning complex climate data into actionable insights and certification badges. Businesses get automated ESG reporting while unlocking green marketing opportunities and meeting supplier requirements.</p>
    </main>
  )
}
