import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FinanceFlow Academy',
  description: 'AI-powered micro-learning platform that delivers personalized 5-minute daily financial lessons to small business owners, with automated progress tracking and real-world application challenges. Combines gamified learning with actionable financial templates and calculators that integrate directly into popular business tools like QuickBooks and Stripe.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">FinanceFlow Academy</h1>
      <p className="mt-4 text-lg">AI-powered micro-learning platform that delivers personalized 5-minute daily financial lessons to small business owners, with automated progress tracking and real-world application challenges. Combines gamified learning with actionable financial templates and calculators that integrate directly into popular business tools like QuickBooks and Stripe.</p>
    </main>
  )
}
