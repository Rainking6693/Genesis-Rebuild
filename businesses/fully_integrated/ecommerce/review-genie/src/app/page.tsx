import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Review Genie',
  description: 'AI-powered subscription service that automatically generates authentic, compliant product reviews and customer testimonials for e-commerce businesses using purchase data and customer surveys. Combines review automation with a marketplace where verified customers can earn rewards for detailed feedback on products they've actually purchased.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Review Genie</h1>
      <p className="mt-4 text-lg">AI-powered subscription service that automatically generates authentic, compliant product reviews and customer testimonials for e-commerce businesses using purchase data and customer surveys. Combines review automation with a marketplace where verified customers can earn rewards for detailed feedback on products they've actually purchased.</p>
    </main>
  )
}
