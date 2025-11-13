import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PriceSync Pro',
  description: 'AI-powered dynamic pricing automation for small e-commerce businesses that monitors competitors, market trends, and inventory levels to optimize prices in real-time for maximum profit margins. Combines the power of AI automation with personal finance insights for business owners to track revenue impact and profit optimization.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">PriceSync Pro</h1>
      <p className="mt-4 text-lg">AI-powered dynamic pricing automation for small e-commerce businesses that monitors competitors, market trends, and inventory levels to optimize prices in real-time for maximum profit margins. Combines the power of AI automation with personal finance insights for business owners to track revenue impact and profit optimization.</p>
    </main>
  )
}
