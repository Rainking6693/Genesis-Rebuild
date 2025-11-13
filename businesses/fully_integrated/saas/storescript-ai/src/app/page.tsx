import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoreScript AI',
  description: 'AI-powered no-code platform that automatically generates and optimizes product descriptions, email sequences, and social media content for e-commerce stores based on product images and basic details. Small e-commerce businesses get professional copywriting at scale without hiring expensive agencies or spending hours writing content.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoreScript AI</h1>
      <p className="mt-4 text-lg">AI-powered no-code platform that automatically generates and optimizes product descriptions, email sequences, and social media content for e-commerce stores based on product images and basic details. Small e-commerce businesses get professional copywriting at scale without hiring expensive agencies or spending hours writing content.</p>
    </main>
  )
}
