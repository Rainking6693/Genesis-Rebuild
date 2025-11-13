import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ShopFlow AI',
  description: 'AI-powered automation platform that creates personalized customer journey workflows for small e-commerce businesses, automatically triggering email sequences, discount codes, and retargeting campaigns based on real-time shopping behavior. Unlike generic email tools, ShopFlow AI learns each store's unique customer patterns and creates custom automation recipes that increase conversion rates by 40-60%.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ShopFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered automation platform that creates personalized customer journey workflows for small e-commerce businesses, automatically triggering email sequences, discount codes, and retargeting campaigns based on real-time shopping behavior. Unlike generic email tools, ShopFlow AI learns each store's unique customer patterns and creates custom automation recipes that increase conversion rates by 40-60%.</p>
    </main>
  )
}
