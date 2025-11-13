import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Climate Budget',
  description: 'AI-powered platform that generates personalized sustainability action plans for small businesses, combining carbon tracking with financial impact analysis. Transforms complex climate data into simple, profitable green initiatives that save money while building brand reputation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Climate Budget</h1>
      <p className="mt-4 text-lg">AI-powered platform that generates personalized sustainability action plans for small businesses, combining carbon tracking with financial impact analysis. Transforms complex climate data into simple, profitable green initiatives that save money while building brand reputation.</p>
    </main>
  )
}
