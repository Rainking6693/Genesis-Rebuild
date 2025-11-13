import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GreenGrowth AI',
  description: 'AI-powered sustainability content platform that automatically generates customized climate action plans, ESG reports, and green marketing content for small businesses. Helps companies quickly create professional sustainability documentation while building their eco-friendly brand presence.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">GreenGrowth AI</h1>
      <p className="mt-4 text-lg">AI-powered sustainability content platform that automatically generates customized climate action plans, ESG reports, and green marketing content for small businesses. Helps companies quickly create professional sustainability documentation while building their eco-friendly brand presence.</p>
    </main>
  )
}
