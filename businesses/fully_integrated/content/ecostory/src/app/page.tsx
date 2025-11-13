import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoStory',
  description: 'AI-powered platform that auto-generates authentic sustainability stories and impact reports for small e-commerce brands using their actual business data. Helps brands build trust with eco-conscious consumers through personalized, data-driven sustainability narratives without greenwashing.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoStory</h1>
      <p className="mt-4 text-lg">AI-powered platform that auto-generates authentic sustainability stories and impact reports for small e-commerce brands using their actual business data. Helps brands build trust with eco-conscious consumers through personalized, data-driven sustainability narratives without greenwashing.</p>
    </main>
  )
}
