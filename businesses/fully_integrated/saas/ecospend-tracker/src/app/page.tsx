import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoSpend Tracker',
  description: 'AI-powered personal finance app that automatically tracks your carbon footprint through spending patterns and rewards eco-friendly purchases with cashback and community challenges. Combines financial wellness with climate action by turning sustainable spending into a gamified social experience with real monetary rewards.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoSpend Tracker</h1>
      <p className="mt-4 text-lg">AI-powered personal finance app that automatically tracks your carbon footprint through spending patterns and rewards eco-friendly purchases with cashback and community challenges. Combines financial wellness with climate action by turning sustainable spending into a gamified social experience with real monetary rewards.</p>
    </main>
  )
}
