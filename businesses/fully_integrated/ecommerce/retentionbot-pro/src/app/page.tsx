import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetentionBot Pro',
  description: 'AI-powered micro-SaaS that automatically generates personalized win-back email campaigns for e-commerce stores by analyzing customer purchase patterns and behavioral triggers. It integrates with existing e-commerce platforms to identify at-risk customers and deploys targeted retention sequences that typically recover 15-25% of churning customers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetentionBot Pro</h1>
      <p className="mt-4 text-lg">AI-powered micro-SaaS that automatically generates personalized win-back email campaigns for e-commerce stores by analyzing customer purchase patterns and behavioral triggers. It integrates with existing e-commerce platforms to identify at-risk customers and deploys targeted retention sequences that typically recover 15-25% of churning customers.</p>
    </main>
  )
}
