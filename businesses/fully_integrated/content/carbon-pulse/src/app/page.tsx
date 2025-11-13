import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Pulse',
  description: 'AI-powered platform that creates personalized carbon tracking content and automated sustainability reports for small businesses to meet ESG requirements and attract eco-conscious customers. Combines real-time carbon footprint analysis with viral sustainability challenges and automated compliance documentation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Pulse</h1>
      <p className="mt-4 text-lg">AI-powered platform that creates personalized carbon tracking content and automated sustainability reports for small businesses to meet ESG requirements and attract eco-conscious customers. Combines real-time carbon footprint analysis with viral sustainability challenges and automated compliance documentation.</p>
    </main>
  )
}
