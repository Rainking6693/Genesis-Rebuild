import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoProfit Analytics',
  description: 'AI-powered sustainability tracking platform that helps small businesses automatically calculate their carbon footprint from financial transactions and convert eco-improvements into tax credits and cost savings. Turn your business expenses into environmental insights and profit opportunities through automated ESG reporting and green incentive discovery.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoProfit Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability tracking platform that helps small businesses automatically calculate their carbon footprint from financial transactions and convert eco-improvements into tax credits and cost savings. Turn your business expenses into environmental insights and profit opportunities through automated ESG reporting and green incentive discovery.</p>
    </main>
  )
}
