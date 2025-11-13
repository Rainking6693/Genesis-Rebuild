import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TrendShop 270',
  description: 'E-commerce store for Micro-SaaS tools. Curated selection with fast shipping.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">TrendShop 270</h1>
      <p className="mt-4 text-lg">E-commerce store for Micro-SaaS tools. Curated selection with fast shipping.</p>
    </main>
  )
}
