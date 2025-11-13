import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FlowCheck Pro',
  description: 'AI-powered workflow automation platform that monitors employee burnout signals in real-time and automatically suggests micro-interventions to boost productivity and retention. Combines health & wellness monitoring with productivity optimization through smart calendar analysis, communication patterns, and workload distribution.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">FlowCheck Pro</h1>
      <p className="mt-4 text-lg">AI-powered workflow automation platform that monitors employee burnout signals in real-time and automatically suggests micro-interventions to boost productivity and retention. Combines health & wellness monitoring with productivity optimization through smart calendar analysis, communication patterns, and workload distribution.</p>
    </main>
  )
}
