import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SustainableStory',
  description: 'AI-powered platform that generates personalized sustainability impact stories and marketing content for eco-conscious businesses. Transforms boring ESG data into compelling narratives that drive customer engagement and brand loyalty.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SustainableStory</h1>
      <p className="mt-4 text-lg">AI-powered platform that generates personalized sustainability impact stories and marketing content for eco-conscious businesses. Transforms boring ESG data into compelling narratives that drive customer engagement and brand loyalty.</p>
    </main>
  )
}
