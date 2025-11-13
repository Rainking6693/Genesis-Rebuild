import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodCommerce',
  description: 'AI-powered emotional commerce platform that curates personalized product recommendations based on users' real-time mood and mental state. Combines mental health tracking with sustainable e-commerce to deliver 'emotional retail therapy' through mindful purchasing decisions.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodCommerce</h1>
      <p className="mt-4 text-lg">AI-powered emotional commerce platform that curates personalized product recommendations based on users' real-time mood and mental state. Combines mental health tracking with sustainable e-commerce to deliver 'emotional retail therapy' through mindful purchasing decisions.</p>
    </main>
  )
}
