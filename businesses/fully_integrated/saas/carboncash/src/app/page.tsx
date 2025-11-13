import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonCash',
  description: 'AI-powered platform that automatically tracks small businesses' carbon footprint across operations and converts sustainability improvements into verified carbon credits they can sell for profit. Transforms environmental responsibility from a cost center into a revenue stream while building customer loyalty through transparent green practices.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonCash</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically tracks small businesses' carbon footprint across operations and converts sustainability improvements into verified carbon credits they can sell for profit. Transforms environmental responsibility from a cost center into a revenue stream while building customer loyalty through transparent green practices.</p>
    </main>
  )
}
