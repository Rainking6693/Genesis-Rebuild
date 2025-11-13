import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreatorCRM',
  description: 'An AI-powered customer relationship management platform specifically designed for content creators to automatically organize, nurture, and monetize their audience across multiple platforms. It transforms scattered followers into paying customers through intelligent audience segmentation and automated outreach workflows.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CreatorCRM</h1>
      <p className="mt-4 text-lg">An AI-powered customer relationship management platform specifically designed for content creators to automatically organize, nurture, and monetize their audience across multiple platforms. It transforms scattered followers into paying customers through intelligent audience segmentation and automated outreach workflows.</p>
    </main>
  )
}
