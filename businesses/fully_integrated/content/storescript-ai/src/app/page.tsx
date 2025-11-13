import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoreScript AI',
  description: 'AI-powered platform that automatically generates personalized product descriptions, email sequences, and social media content for e-commerce stores by analyzing competitor data and customer behavior patterns. Small online retailers get enterprise-level marketing copy without hiring expensive copywriters or agencies.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoreScript AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized product descriptions, email sequences, and social media content for e-commerce stores by analyzing competitor data and customer behavior patterns. Small online retailers get enterprise-level marketing copy without hiring expensive copywriters or agencies.</p>
    </main>
  )
}
