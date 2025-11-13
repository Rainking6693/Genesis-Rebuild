import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonCred',
  description: 'AI-powered carbon credit marketplace that automatically calculates, purchases, and manages carbon offsets for small businesses based on their actual operational data. We transform climate compliance from a burden into a competitive advantage by providing transparent, automated carbon neutrality with detailed impact reporting.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonCred</h1>
      <p className="mt-4 text-lg">AI-powered carbon credit marketplace that automatically calculates, purchases, and manages carbon offsets for small businesses based on their actual operational data. We transform climate compliance from a burden into a competitive advantage by providing transparent, automated carbon neutrality with detailed impact reporting.</p>
    </main>
  )
}
