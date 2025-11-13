import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoTrace Commerce',
  description: 'AI-powered sustainability analytics platform that helps e-commerce businesses automatically track, report, and market their environmental impact to increasingly eco-conscious consumers. We turn complex carbon footprint data into compelling product stories and certifications that drive sales and customer loyalty.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoTrace Commerce</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that helps e-commerce businesses automatically track, report, and market their environmental impact to increasingly eco-conscious consumers. We turn complex carbon footprint data into compelling product stories and certifications that drive sales and customer loyalty.</p>
    </main>
  )
}
