import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoStream Hub',
  description: 'AI-powered platform that automatically creates personalized sustainability content and shopping recommendations for eco-conscious consumers while helping sustainable brands reach their ideal customers through micro-influencer partnerships. Combines content creation automation with community-driven product discovery to build the ultimate sustainable lifestyle ecosystem.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoStream Hub</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically creates personalized sustainability content and shopping recommendations for eco-conscious consumers while helping sustainable brands reach their ideal customers through micro-influencer partnerships. Combines content creation automation with community-driven product discovery to build the ultimate sustainable lifestyle ecosystem.</p>
    </main>
  )
}
