import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoScript Pro',
  description: 'AI-powered content creation platform that generates climate-conscious marketing copy, product descriptions, and brand messaging for sustainable businesses. Helps eco-friendly companies communicate their impact authentically while building customer trust through verified sustainability claims.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoScript Pro</h1>
      <p className="mt-4 text-lg">AI-powered content creation platform that generates climate-conscious marketing copy, product descriptions, and brand messaging for sustainable businesses. Helps eco-friendly companies communicate their impact authentically while building customer trust through verified sustainability claims.</p>
    </main>
  )
}
