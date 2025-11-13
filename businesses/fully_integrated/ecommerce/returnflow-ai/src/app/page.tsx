import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReturnFlow AI',
  description: 'AI-powered return management SaaS that automatically processes product returns, generates smart shipping labels, and creates personalized retention offers to convert returns into exchanges or store credit. We transform the costly return experience into a profit center by using machine learning to predict return reasons and proactively offer solutions before customers hit 'return'.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReturnFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered return management SaaS that automatically processes product returns, generates smart shipping labels, and creates personalized retention offers to convert returns into exchanges or store credit. We transform the costly return experience into a profit center by using machine learning to predict return reasons and proactively offer solutions before customers hit 'return'.</p>
    </main>
  )
}
