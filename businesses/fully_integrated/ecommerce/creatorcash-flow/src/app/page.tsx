import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreatorCash Flow',
  description: 'AI-powered financial planning SaaS specifically designed for content creators and freelancers with irregular income streams. Automatically tracks earnings across platforms, predicts cash flow patterns, and provides personalized budgeting recommendations to help creators achieve financial stability.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CreatorCash Flow</h1>
      <p className="mt-4 text-lg">AI-powered financial planning SaaS specifically designed for content creators and freelancers with irregular income streams. Automatically tracks earnings across platforms, predicts cash flow patterns, and provides personalized budgeting recommendations to help creators achieve financial stability.</p>
    </main>
  )
}
