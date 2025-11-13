import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Copy',
  description: 'AI-powered platform that automatically generates personalized carbon footprint reduction content and action plans for remote teams, turning sustainability goals into engaging workplace challenges. Combines climate action with remote work culture by gamifying eco-friendly habits and measuring collective impact.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Copy</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized carbon footprint reduction content and action plans for remote teams, turning sustainability goals into engaging workplace challenges. Combines climate action with remote work culture by gamifying eco-friendly habits and measuring collective impact.</p>
    </main>
  )
}
