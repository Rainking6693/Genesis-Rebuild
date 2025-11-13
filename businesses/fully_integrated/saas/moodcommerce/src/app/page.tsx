import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodCommerce',
  description: 'AI-powered e-commerce personalization platform that adapts product recommendations and store layouts based on customers' real-time emotional state and mental wellness goals. Combines sentiment analysis of browsing behavior with wellness-focused product curation to increase conversions while promoting healthier purchasing decisions.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodCommerce</h1>
      <p className="mt-4 text-lg">AI-powered e-commerce personalization platform that adapts product recommendations and store layouts based on customers' real-time emotional state and mental wellness goals. Combines sentiment analysis of browsing behavior with wellness-focused product curation to increase conversions while promoting healthier purchasing decisions.</p>
    </main>
  )
}
