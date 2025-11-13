import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow Analytics',
  description: 'AI-powered sustainability tracking platform that helps e-commerce businesses automatically calculate, display, and offset their carbon footprint while turning eco-consciousness into a competitive advantage. Combines real-time environmental impact analytics with customer-facing sustainability badges that boost conversion rates by appealing to environmentally conscious shoppers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability tracking platform that helps e-commerce businesses automatically calculate, display, and offset their carbon footprint while turning eco-consciousness into a competitive advantage. Combines real-time environmental impact analytics with customer-facing sustainability badges that boost conversion rates by appealing to environmentally conscious shoppers.</p>
    </main>
  )
}
