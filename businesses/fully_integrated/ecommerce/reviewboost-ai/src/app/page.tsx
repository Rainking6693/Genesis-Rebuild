import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReviewBoost AI',
  description: 'AI-powered platform that helps small e-commerce businesses automatically generate personalized follow-up campaigns to increase customer reviews and repeat purchases. Combines review management with smart customer retention automation to boost revenue by 25-40% through targeted post-purchase engagement.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReviewBoost AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that helps small e-commerce businesses automatically generate personalized follow-up campaigns to increase customer reviews and repeat purchases. Combines review management with smart customer retention automation to boost revenue by 25-40% through targeted post-purchase engagement.</p>
    </main>
  )
}
