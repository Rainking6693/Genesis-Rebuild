import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreatorSync',
  description: 'AI-powered automation platform that helps content creators automatically manage their subscription box businesses by generating personalized product curation, handling customer segmentation, and optimizing inventory based on audience engagement data. It combines creator economy tools with sustainable e-commerce automation to turn any content creator into a subscription box entrepreneur without operational overhead.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CreatorSync</h1>
      <p className="mt-4 text-lg">AI-powered automation platform that helps content creators automatically manage their subscription box businesses by generating personalized product curation, handling customer segmentation, and optimizing inventory based on audience engagement data. It combines creator economy tools with sustainable e-commerce automation to turn any content creator into a subscription box entrepreneur without operational overhead.</p>
    </main>
  )
}
