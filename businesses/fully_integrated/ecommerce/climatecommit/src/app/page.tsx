import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateCommit',
  description: 'AI-powered platform that automatically tracks small businesses' carbon footprint through their existing tools (Shopify, QuickBooks, etc.) and creates verified sustainability reports for customers while connecting them to a marketplace of vetted carbon offset projects. Turns environmental compliance from a burden into a competitive advantage and revenue driver for SMBs.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateCommit</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically tracks small businesses' carbon footprint through their existing tools (Shopify, QuickBooks, etc.) and creates verified sustainability reports for customers while connecting them to a marketplace of vetted carbon offset projects. Turns environmental compliance from a burden into a competitive advantage and revenue driver for SMBs.</p>
    </main>
  )
}
