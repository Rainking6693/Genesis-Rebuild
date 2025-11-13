import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonStory',
  description: 'AI-powered platform that automatically generates personalized sustainability impact reports and shareable content for e-commerce purchases, helping consumers track their carbon footprint while enabling brands to showcase their green initiatives. Transforms boring ESG data into engaging, viral-ready stories that drive both consumer awareness and brand loyalty.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonStory</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized sustainability impact reports and shareable content for e-commerce purchases, helping consumers track their carbon footprint while enabling brands to showcase their green initiatives. Transforms boring ESG data into engaging, viral-ready stories that drive both consumer awareness and brand loyalty.</p>
    </main>
  )
}
