import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ExpenseBot Pro',
  description: 'AI-powered expense management platform that automatically categorizes receipts, tracks business spending patterns, and generates tax-optimized reports for small businesses. Uses computer vision and smart automation to eliminate 90% of manual bookkeeping work while providing actionable financial insights.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ExpenseBot Pro</h1>
      <p className="mt-4 text-lg">AI-powered expense management platform that automatically categorizes receipts, tracks business spending patterns, and generates tax-optimized reports for small businesses. Uses computer vision and smart automation to eliminate 90% of manual bookkeeping work while providing actionable financial insights.</p>
    </main>
  )
}
