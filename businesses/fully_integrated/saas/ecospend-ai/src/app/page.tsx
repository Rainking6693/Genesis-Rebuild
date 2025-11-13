import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoSpend AI',
  description: 'AI-powered expense tracking that automatically categorizes business purchases by their carbon footprint and suggests eco-friendly alternatives to reduce costs and environmental impact. Combines personal finance automation with climate action insights, helping small businesses save money while meeting sustainability goals.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoSpend AI</h1>
      <p className="mt-4 text-lg">AI-powered expense tracking that automatically categorizes business purchases by their carbon footprint and suggests eco-friendly alternatives to reduce costs and environmental impact. Combines personal finance automation with climate action insights, helping small businesses save money while meeting sustainability goals.</p>
    </main>
  )
}
