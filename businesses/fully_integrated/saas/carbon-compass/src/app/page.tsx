import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Compass',
  description: 'AI-powered carbon footprint tracking and offset marketplace that automatically calculates small business emissions from receipts, invoices, and bank transactions. Gamifies sustainability with team leaderboards and provides automated carbon credit purchasing with verified climate projects.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Compass</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking and offset marketplace that automatically calculates small business emissions from receipts, invoices, and bank transactions. Gamifies sustainability with team leaderboards and provides automated carbon credit purchasing with verified climate projects.</p>
    </main>
  )
}
