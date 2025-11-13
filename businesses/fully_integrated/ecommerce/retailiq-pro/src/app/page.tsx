import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetailIQ Pro',
  description: 'AI-powered competitive intelligence platform that automatically tracks competitor pricing, inventory, and marketing strategies for small e-commerce businesses. Delivers actionable insights through automated reports and real-time alerts to help online retailers stay competitive and maximize profits.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetailIQ Pro</h1>
      <p className="mt-4 text-lg">AI-powered competitive intelligence platform that automatically tracks competitor pricing, inventory, and marketing strategies for small e-commerce businesses. Delivers actionable insights through automated reports and real-time alerts to help online retailers stay competitive and maximize profits.</p>
    </main>
  )
}
