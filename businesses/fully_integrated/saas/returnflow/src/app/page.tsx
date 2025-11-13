import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReturnFlow',
  description: 'AI-powered returns automation platform that transforms e-commerce returns from cost centers into profit centers by intelligently routing returned items to resale, donation, or recycling channels. Small e-commerce businesses reduce return processing costs by 60% while generating new revenue streams from previously wasted inventory.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReturnFlow</h1>
      <p className="mt-4 text-lg">AI-powered returns automation platform that transforms e-commerce returns from cost centers into profit centers by intelligently routing returned items to resale, donation, or recycling channels. Small e-commerce businesses reduce return processing costs by 60% while generating new revenue streams from previously wasted inventory.</p>
    </main>
  )
}
