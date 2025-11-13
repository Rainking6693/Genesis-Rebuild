import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoreTherapy',
  description: 'AI-powered mental wellness platform that helps e-commerce entrepreneurs and small business owners manage stress, burnout, and decision fatigue through personalized micro-coaching sessions and automated wellness workflows. Combines business performance tracking with mental health insights to optimize both profit and well-being.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoreTherapy</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness platform that helps e-commerce entrepreneurs and small business owners manage stress, burnout, and decision fatigue through personalized micro-coaching sessions and automated wellness workflows. Combines business performance tracking with mental health insights to optimize both profit and well-being.</p>
    </main>
  )
}
