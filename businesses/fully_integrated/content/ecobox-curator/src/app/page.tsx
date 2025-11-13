import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoBox Curator',
  description: 'AI-powered platform that helps eco-conscious consumers discover and curate personalized sustainable product collections from verified green brands. Creates automated subscription boxes and gift sets based on lifestyle preferences, budget, and environmental impact goals.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoBox Curator</h1>
      <p className="mt-4 text-lg">AI-powered platform that helps eco-conscious consumers discover and curate personalized sustainable product collections from verified green brands. Creates automated subscription boxes and gift sets based on lifestyle preferences, budget, and environmental impact goals.</p>
    </main>
  )
}
