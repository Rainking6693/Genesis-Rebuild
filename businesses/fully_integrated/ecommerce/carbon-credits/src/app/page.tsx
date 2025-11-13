import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Credits',
  description: 'AI-powered platform that automatically calculates small business carbon footprints and creates personalized monthly subscription boxes of verified carbon offset credits bundled with eco-friendly office supplies. Businesses get automated ESG compliance reporting while employees receive tangible sustainable products, creating a viral workplace sustainability program.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Credits</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically calculates small business carbon footprints and creates personalized monthly subscription boxes of verified carbon offset credits bundled with eco-friendly office supplies. Businesses get automated ESG compliance reporting while employees receive tangible sustainable products, creating a viral workplace sustainability program.</p>
    </main>
  )
}
