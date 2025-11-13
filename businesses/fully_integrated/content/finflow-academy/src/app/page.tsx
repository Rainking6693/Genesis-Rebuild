import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FinFlow Academy',
  description: 'AI-powered financial literacy platform that creates personalized learning paths for small business owners, combining bite-sized educational content with automated cash flow management tools. Users learn financial concepts while simultaneously implementing them in their actual business through integrated no-code financial dashboards.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">FinFlow Academy</h1>
      <p className="mt-4 text-lg">AI-powered financial literacy platform that creates personalized learning paths for small business owners, combining bite-sized educational content with automated cash flow management tools. Users learn financial concepts while simultaneously implementing them in their actual business through integrated no-code financial dashboards.</p>
    </main>
  )
}
