import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReturnGuard AI',
  description: 'AI-powered micro-SaaS that automatically analyzes customer return patterns and generates personalized retention offers to reduce e-commerce return rates by 40%. Transforms costly returns into revenue opportunities through intelligent intervention campaigns that trigger before customers initiate returns.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReturnGuard AI</h1>
      <p className="mt-4 text-lg">AI-powered micro-SaaS that automatically analyzes customer return patterns and generates personalized retention offers to reduce e-commerce return rates by 40%. Transforms costly returns into revenue opportunities through intelligent intervention campaigns that trigger before customers initiate returns.</p>
    </main>
  )
}
