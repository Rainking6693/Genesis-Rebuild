import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TrendShop 594',
  description: 'E-commerce store for Web3/blockchain tools. Curated selection with fast shipping.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">TrendShop 594</h1>
      <p className="mt-4 text-lg">E-commerce store for Web3/blockchain tools. Curated selection with fast shipping.</p>
    </main>
  )
}
