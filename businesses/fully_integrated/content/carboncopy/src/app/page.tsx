import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonCopy',
  description: 'AI-powered platform that automatically generates personalized carbon footprint reduction content and action plans for remote teams, turning climate action into engaging team challenges with measurable impact tracking. Companies get branded sustainability content libraries, employee engagement dashboards, and automated ESG reporting while employees receive gamified carbon reduction missions tailored to their remote work setup.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonCopy</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized carbon footprint reduction content and action plans for remote teams, turning climate action into engaging team challenges with measurable impact tracking. Companies get branded sustainability content libraries, employee engagement dashboards, and automated ESG reporting while employees receive gamified carbon reduction missions tailored to their remote work setup.</p>
    </main>
  )
}
