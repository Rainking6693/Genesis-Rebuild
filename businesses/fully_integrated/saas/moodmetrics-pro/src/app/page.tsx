import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodMetrics Pro',
  description: 'AI-powered employee wellness analytics platform that transforms anonymous mood data into actionable business intelligence for small-medium businesses. Combines daily micro-check-ins with productivity tracking to predict burnout, optimize team dynamics, and reduce turnover while boosting revenue through data-driven workforce optimization.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodMetrics Pro</h1>
      <p className="mt-4 text-lg">AI-powered employee wellness analytics platform that transforms anonymous mood data into actionable business intelligence for small-medium businesses. Combines daily micro-check-ins with productivity tracking to predict burnout, optimize team dynamics, and reduce turnover while boosting revenue through data-driven workforce optimization.</p>
    </main>
  )
}
