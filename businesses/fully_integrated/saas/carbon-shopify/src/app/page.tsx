import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Shopify',
  description: 'AI-powered carbon footprint tracking and offset automation for e-commerce stores that calculates environmental impact per order and automatically purchases verified carbon credits. Transforms climate anxiety into purchase confidence by showing customers their positive environmental impact in real-time.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Shopify</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking and offset automation for e-commerce stores that calculates environmental impact per order and automatically purchases verified carbon credits. Transforms climate anxiety into purchase confidence by showing customers their positive environmental impact in real-time.</p>
    </main>
  )
}
