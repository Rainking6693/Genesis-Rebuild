import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoreWise AI',
  description: 'AI-powered financial health dashboard that analyzes small business spending patterns across e-commerce platforms and generates personalized cost-optimization content and actionable insights. Combines expense tracking with curated educational content and peer benchmarking to help business owners make smarter purchasing decisions.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoreWise AI</h1>
      <p className="mt-4 text-lg">AI-powered financial health dashboard that analyzes small business spending patterns across e-commerce platforms and generates personalized cost-optimization content and actionable insights. Combines expense tracking with curated educational content and peer benchmarking to help business owners make smarter purchasing decisions.</p>
    </main>
  )
}
