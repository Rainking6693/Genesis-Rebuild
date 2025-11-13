import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ShopMind AI',
  description: 'AI-powered mental wellness marketplace that uses shopping behavior analysis to recommend personalized stress-relief products and micro-coaching sessions. Combines impulse shopping psychology with therapeutic interventions to turn retail therapy into actual therapy.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ShopMind AI</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness marketplace that uses shopping behavior analysis to recommend personalized stress-relief products and micro-coaching sessions. Combines impulse shopping psychology with therapeutic interventions to turn retail therapy into actual therapy.</p>
    </main>
  )
}
