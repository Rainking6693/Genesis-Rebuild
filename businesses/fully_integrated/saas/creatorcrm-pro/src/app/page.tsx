import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreatorCRM Pro',
  description: 'AI-powered CRM specifically designed for content creators to automatically track brand partnerships, manage sponsor relationships, and optimize collaboration rates. Combines creator economy insights with automated outreach and performance analytics to turn content creation into a scalable business operation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CreatorCRM Pro</h1>
      <p className="mt-4 text-lg">AI-powered CRM specifically designed for content creators to automatically track brand partnerships, manage sponsor relationships, and optimize collaboration rates. Combines creator economy insights with automated outreach and performance analytics to turn content creation into a scalable business operation.</p>
    </main>
  )
}
