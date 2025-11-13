import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creator Compliance',
  description: 'AI-powered platform that automatically generates legal disclaimers, terms of service, and compliance documentation for content creators and small e-commerce businesses. Eliminates the need for expensive lawyers while ensuring creators stay legally protected across different platforms and jurisdictions.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Creator Compliance</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates legal disclaimers, terms of service, and compliance documentation for content creators and small e-commerce businesses. Eliminates the need for expensive lawyers while ensuring creators stay legally protected across different platforms and jurisdictions.</p>
    </main>
  )
}
