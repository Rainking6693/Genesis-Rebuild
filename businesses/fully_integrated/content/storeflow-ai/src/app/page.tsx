import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoreFlow AI',
  description: 'An AI-powered no-code platform that automatically generates personalized email sequences, product recommendations, and conversion-optimized landing pages for e-commerce stores based on customer behavior data. It combines mental health principles with sales psychology to create empathetic, non-pushy marketing content that builds genuine customer relationships.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoreFlow AI</h1>
      <p className="mt-4 text-lg">An AI-powered no-code platform that automatically generates personalized email sequences, product recommendations, and conversion-optimized landing pages for e-commerce stores based on customer behavior data. It combines mental health principles with sales psychology to create empathetic, non-pushy marketing content that builds genuine customer relationships.</p>
    </main>
  )
}
