import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow Pulse',
  description: 'AI-powered automation platform that helps small e-commerce businesses optimize their supply chain for sustainability while reducing costs through intelligent vendor matching and carbon footprint tracking. Transforms complex sustainability compliance into automated workflows with real-time cost savings alerts and eco-certification generation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow Pulse</h1>
      <p className="mt-4 text-lg">AI-powered automation platform that helps small e-commerce businesses optimize their supply chain for sustainability while reducing costs through intelligent vendor matching and carbon footprint tracking. Transforms complex sustainability compliance into automated workflows with real-time cost savings alerts and eco-certification generation.</p>
    </main>
  )
}
