import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetentionIQ',
  description: 'AI-powered customer retention analytics platform that automatically identifies at-risk customers and generates personalized win-back campaigns for small e-commerce businesses. Combines predictive AI with ready-to-deploy email/SMS templates that increase customer lifetime value by 40%.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetentionIQ</h1>
      <p className="mt-4 text-lg">AI-powered customer retention analytics platform that automatically identifies at-risk customers and generates personalized win-back campaigns for small e-commerce businesses. Combines predictive AI with ready-to-deploy email/SMS templates that increase customer lifetime value by 40%.</p>
    </main>
  )
}
