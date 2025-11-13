import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreatorCRM Pro',
  description: 'An AI-powered CRM specifically designed for content creators to manage brand partnerships, track campaign performance, and automate client communications. It combines creator economy tools with micro-SaaS automation to help influencers scale their business operations like professional agencies.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CreatorCRM Pro</h1>
      <p className="mt-4 text-lg">An AI-powered CRM specifically designed for content creators to manage brand partnerships, track campaign performance, and automate client communications. It combines creator economy tools with micro-SaaS automation to help influencers scale their business operations like professional agencies.</p>
    </main>
  )
}
