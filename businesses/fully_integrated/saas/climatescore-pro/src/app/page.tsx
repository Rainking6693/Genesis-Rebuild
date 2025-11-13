import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateScore Pro',
  description: 'AI-powered carbon footprint calculator that automatically tracks and scores small businesses' environmental impact through integrated financial data, generating compliance reports and actionable reduction recommendations. Helps SMBs meet ESG requirements while reducing costs through AI-optimized sustainability strategies.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateScore Pro</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint calculator that automatically tracks and scores small businesses' environmental impact through integrated financial data, generating compliance reports and actionable reduction recommendations. Helps SMBs meet ESG requirements while reducing costs through AI-optimized sustainability strategies.</p>
    </main>
  )
}
