import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ShopSage AI',
  description: 'AI-powered micro-community platform that creates instant shopping decision groups for e-commerce purchases over $100. Users get real-time feedback from verified peers with similar buying patterns and preferences before making purchase decisions.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ShopSage AI</h1>
      <p className="mt-4 text-lg">AI-powered micro-community platform that creates instant shopping decision groups for e-commerce purchases over $100. Users get real-time feedback from verified peers with similar buying patterns and preferences before making purchase decisions.</p>
    </main>
  )
}
