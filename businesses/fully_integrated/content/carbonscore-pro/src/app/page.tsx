import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonScore Pro',
  description: 'AI-powered carbon footprint calculator and sustainability content platform that generates personalized climate action plans for remote teams and small businesses. Creates automated ESG reports, team challenges, and actionable sustainability content to help companies reduce their environmental impact while boosting employee engagement.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonScore Pro</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint calculator and sustainability content platform that generates personalized climate action plans for remote teams and small businesses. Creates automated ESG reports, team challenges, and actionable sustainability content to help companies reduce their environmental impact while boosting employee engagement.</p>
    </main>
  )
}
