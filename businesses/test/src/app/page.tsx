import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test E-Commerce Store',
  description: 'Test e-commerce generation',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Test E-Commerce Store</h1>
      <p className="mt-4 text-lg">Test e-commerce generation</p>
    </main>
  )
}
