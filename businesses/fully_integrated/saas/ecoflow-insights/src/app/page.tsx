import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow Insights',
  description: 'AI-powered carbon footprint tracking and sustainability automation platform that helps small businesses automatically calculate, reduce, and report their environmental impact while generating cost savings. Combines real-time expense monitoring with climate action recommendations, turning sustainability compliance into a profit center through tax incentives and operational efficiencies.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow Insights</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking and sustainability automation platform that helps small businesses automatically calculate, reduce, and report their environmental impact while generating cost savings. Combines real-time expense monitoring with climate action recommendations, turning sustainability compliance into a profit center through tax incentives and operational efficiencies.</p>
    </main>
  )
}
