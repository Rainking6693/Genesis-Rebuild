import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow Builder',
  description: 'A no-code platform that helps small businesses automatically create and optimize their carbon offset workflows while building customer loyalty through transparent sustainability tracking. Businesses can launch branded eco-initiatives in minutes without technical expertise, turning climate action into a competitive advantage.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow Builder</h1>
      <p className="mt-4 text-lg">A no-code platform that helps small businesses automatically create and optimize their carbon offset workflows while building customer loyalty through transparent sustainability tracking. Businesses can launch branded eco-initiatives in minutes without technical expertise, turning climate action into a competitive advantage.</p>
    </main>
  )
}
