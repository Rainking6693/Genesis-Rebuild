import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoContent Studio',
  description: 'AI-powered content creation platform that automatically generates sustainability-focused marketing content for eco-conscious brands, complete with carbon impact tracking and green certification badges. Combines climate tech data with creator economy tools to help businesses authentically communicate their environmental initiatives through automated, compliant content workflows.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoContent Studio</h1>
      <p className="mt-4 text-lg">AI-powered content creation platform that automatically generates sustainability-focused marketing content for eco-conscious brands, complete with carbon impact tracking and green certification badges. Combines climate tech data with creator economy tools to help businesses authentically communicate their environmental initiatives through automated, compliant content workflows.</p>
    </main>
  )
}
