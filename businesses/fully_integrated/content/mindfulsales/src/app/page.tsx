import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindfulSales',
  description: 'AI-powered mental wellness platform specifically designed for sales professionals to manage rejection stress, maintain peak performance, and build resilience through personalized micro-interventions during their workday. Combines sales CRM integration with real-time mood tracking and evidence-based mental health techniques delivered at the moment of need.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindfulSales</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness platform specifically designed for sales professionals to manage rejection stress, maintain peak performance, and build resilience through personalized micro-interventions during their workday. Combines sales CRM integration with real-time mood tracking and evidence-based mental health techniques delivered at the moment of need.</p>
    </main>
  )
}
