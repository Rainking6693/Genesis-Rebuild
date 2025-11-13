import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetentionGenius',
  description: 'AI-powered subscription analytics platform that automatically generates personalized retention content and campaigns for SaaS businesses. It analyzes user behavior patterns and creates targeted email sequences, in-app messages, and educational content to reduce churn and increase customer lifetime value.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetentionGenius</h1>
      <p className="mt-4 text-lg">AI-powered subscription analytics platform that automatically generates personalized retention content and campaigns for SaaS businesses. It analyzes user behavior patterns and creates targeted email sequences, in-app messages, and educational content to reduce churn and increase customer lifetime value.</p>
    </main>
  )
}
