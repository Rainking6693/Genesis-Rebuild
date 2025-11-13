import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Compass',
  description: 'AI-powered sustainability content platform that generates personalized carbon reduction action plans and tracks impact for small businesses. Combines educational climate tech content with automated reporting tools to help SMBs meet ESG requirements while saving costs.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Compass</h1>
      <p className="mt-4 text-lg">AI-powered sustainability content platform that generates personalized carbon reduction action plans and tracks impact for small businesses. Combines educational climate tech content with automated reporting tools to help SMBs meet ESG requirements while saving costs.</p>
    </main>
  )
}
