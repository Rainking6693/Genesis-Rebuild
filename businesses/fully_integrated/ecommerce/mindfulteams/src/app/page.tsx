import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindfulTeams',
  description: 'AI-powered mental wellness subscription platform that delivers personalized stress-relief boxes to small business teams while providing data-driven wellness insights to managers. Combines physical wellness products with digital mental health tracking and team-building activities to boost productivity and reduce burnout.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindfulTeams</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness subscription platform that delivers personalized stress-relief boxes to small business teams while providing data-driven wellness insights to managers. Combines physical wellness products with digital mental health tracking and team-building activities to boost productivity and reduce burnout.</p>
    </main>
  )
}
