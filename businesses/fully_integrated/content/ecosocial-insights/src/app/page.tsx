import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoSocial Insights',
  description: 'AI-powered sustainability marketing intelligence platform that helps e-commerce brands identify trending eco-conscious consumer behaviors and create viral green content. Combines real-time social sentiment analysis with carbon footprint data to generate weekly content strategies that boost both sales and environmental impact scores.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoSocial Insights</h1>
      <p className="mt-4 text-lg">AI-powered sustainability marketing intelligence platform that helps e-commerce brands identify trending eco-conscious consumer behaviors and create viral green content. Combines real-time social sentiment analysis with carbon footprint data to generate weekly content strategies that boost both sales and environmental impact scores.</p>
    </main>
  )
}
