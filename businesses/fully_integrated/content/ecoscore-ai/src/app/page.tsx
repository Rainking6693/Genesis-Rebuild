import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoScore AI',
  description: 'AI-powered sustainability analytics platform that automatically generates personalized carbon footprint reports and actionable reduction strategies for small businesses. Combines climate tech with AI productivity tools to transform complex environmental data into simple, branded reports that businesses can share with customers and stakeholders.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoScore AI</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that automatically generates personalized carbon footprint reports and actionable reduction strategies for small businesses. Combines climate tech with AI productivity tools to transform complex environmental data into simple, branded reports that businesses can share with customers and stakeholders.</p>
    </main>
  )
}
