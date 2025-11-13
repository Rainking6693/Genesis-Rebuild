import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ShopScript AI',
  description: 'AI-powered platform that automatically generates personalized product demo scripts and video outlines for e-commerce brands based on customer data and trending content formats. Transforms boring product listings into engaging, conversion-optimized content that speaks directly to different customer segments.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ShopScript AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized product demo scripts and video outlines for e-commerce brands based on customer data and trending content formats. Transforms boring product listings into engaging, conversion-optimized content that speaks directly to different customer segments.</p>
    </main>
  )
}
