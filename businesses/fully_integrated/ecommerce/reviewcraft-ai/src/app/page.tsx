import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReviewCraft AI',
  description: 'AI-powered platform that automatically generates authentic, compliant product reviews and testimonials for e-commerce businesses by analyzing actual customer data, purchase patterns, and feedback sentiment. Eliminates the time-consuming manual process of collecting and formatting customer testimonials while ensuring authenticity and compliance with platform guidelines.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReviewCraft AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates authentic, compliant product reviews and testimonials for e-commerce businesses by analyzing actual customer data, purchase patterns, and feedback sentiment. Eliminates the time-consuming manual process of collecting and formatting customer testimonials while ensuring authenticity and compliance with platform guidelines.</p>
    </main>
  )
}
