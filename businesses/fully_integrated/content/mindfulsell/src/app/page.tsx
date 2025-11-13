import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindfulSell',
  description: 'AI-powered platform that helps e-commerce brands create mental wellness-focused product content and community experiences to boost customer loyalty and reduce return rates. Combines sustainable shopping psychology with AI-generated wellness content that positions products as mindful lifestyle choices rather than impulse purchases.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindfulSell</h1>
      <p className="mt-4 text-lg">AI-powered platform that helps e-commerce brands create mental wellness-focused product content and community experiences to boost customer loyalty and reduce return rates. Combines sustainable shopping psychology with AI-generated wellness content that positions products as mindful lifestyle choices rather than impulse purchases.</p>
    </main>
  )
}
