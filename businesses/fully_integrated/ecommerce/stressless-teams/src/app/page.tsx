import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StressLess Teams',
  description: 'AI-powered mental health analytics platform that transforms anonymous employee stress data into actionable workplace wellness insights for small business managers. Combines real-time mood tracking with automated intervention recommendations and team wellness subscription boxes.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StressLess Teams</h1>
      <p className="mt-4 text-lg">AI-powered mental health analytics platform that transforms anonymous employee stress data into actionable workplace wellness insights for small business managers. Combines real-time mood tracking with automated intervention recommendations and team wellness subscription boxes.</p>
    </main>
  )
}
