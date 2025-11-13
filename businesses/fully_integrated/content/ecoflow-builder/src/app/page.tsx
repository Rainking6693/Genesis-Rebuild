import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow Builder',
  description: 'AI-powered no-code platform that generates personalized sustainability workflows and carbon tracking automations for small businesses. Creates branded educational content and compliance reports that businesses can share with customers to demonstrate their environmental impact and build trust.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow Builder</h1>
      <p className="mt-4 text-lg">AI-powered no-code platform that generates personalized sustainability workflows and carbon tracking automations for small businesses. Creates branded educational content and compliance reports that businesses can share with customers to demonstrate their environmental impact and build trust.</p>
    </main>
  )
}
