import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoCreator Hub',
  description: 'AI-powered platform that helps content creators monetize sustainability expertise by generating data-driven climate impact content and connecting them with eco-conscious brands for sponsored partnerships. Creators upload their sustainability knowledge once, and our AI transforms it into multiple content formats while tracking real environmental impact metrics for brand collaborations.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoCreator Hub</h1>
      <p className="mt-4 text-lg">AI-powered platform that helps content creators monetize sustainability expertise by generating data-driven climate impact content and connecting them with eco-conscious brands for sponsored partnerships. Creators upload their sustainability knowledge once, and our AI transforms it into multiple content formats while tracking real environmental impact metrics for brand collaborations.</p>
    </main>
  )
}
