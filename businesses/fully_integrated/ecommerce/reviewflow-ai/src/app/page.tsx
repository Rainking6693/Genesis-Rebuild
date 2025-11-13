import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReviewFlow AI',
  description: 'AI-powered review management platform that automatically generates personalized video responses to customer reviews across all platforms. Transforms negative reviews into trust-building opportunities while amplifying positive feedback through smart automation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReviewFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered review management platform that automatically generates personalized video responses to customer reviews across all platforms. Transforms negative reviews into trust-building opportunities while amplifying positive feedback through smart automation.</p>
    </main>
  )
}
