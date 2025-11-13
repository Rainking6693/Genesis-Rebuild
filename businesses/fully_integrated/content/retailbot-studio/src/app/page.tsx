import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetailBot Studio',
  description: 'AI-powered platform that automatically generates personalized product demonstration videos and interactive shopping content for e-commerce brands. Combines community-driven templates with automated video creation to help online retailers increase conversion rates through engaging, scalable content.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetailBot Studio</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized product demonstration videos and interactive shopping content for e-commerce brands. Combines community-driven templates with automated video creation to help online retailers increase conversion rates through engaging, scalable content.</p>
    </main>
  )
}
