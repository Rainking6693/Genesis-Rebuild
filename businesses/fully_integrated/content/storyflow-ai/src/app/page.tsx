import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoryFlow AI',
  description: 'AI-powered platform that transforms small business customer data and testimonials into automated, personalized case study content and social proof campaigns. Combines no-code automation with community-driven templates to help businesses create compelling customer success stories at scale.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoryFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that transforms small business customer data and testimonials into automated, personalized case study content and social proof campaigns. Combines no-code automation with community-driven templates to help businesses create compelling customer success stories at scale.</p>
    </main>
  )
}
