import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoTrace Supply',
  description: 'AI-powered carbon footprint tracking and supplier sustainability scoring platform that helps small e-commerce businesses automatically calculate, display, and offset their products' environmental impact while building customer trust. Combines climate tech with micro-SaaS tools to turn sustainability compliance into a competitive advantage and revenue driver.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoTrace Supply</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking and supplier sustainability scoring platform that helps small e-commerce businesses automatically calculate, display, and offset their products' environmental impact while building customer trust. Combines climate tech with micro-SaaS tools to turn sustainability compliance into a competitive advantage and revenue driver.</p>
    </main>
  )
}
