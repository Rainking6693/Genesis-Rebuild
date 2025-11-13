import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonLedger Pro',
  description: 'AI-powered carbon accounting platform that automatically tracks, calculates, and offsets small business emissions while generating compliance reports for ESG requirements. Transforms complex sustainability reporting into a simple monthly subscription with automated data collection from business tools like accounting software, shipping APIs, and utility bills.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonLedger Pro</h1>
      <p className="mt-4 text-lg">AI-powered carbon accounting platform that automatically tracks, calculates, and offsets small business emissions while generating compliance reports for ESG requirements. Transforms complex sustainability reporting into a simple monthly subscription with automated data collection from business tools like accounting software, shipping APIs, and utility bills.</p>
    </main>
  )
}
