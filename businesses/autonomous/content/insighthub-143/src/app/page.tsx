import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'InsightHub 143',
  description: 'Premium content platform with expert insights. Subscription-based access to exclusive articles and courses.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">InsightHub 143</h1>
      <p className="mt-4 text-lg">Premium content platform with expert insights. Subscription-based access to exclusive articles and courses.</p>
    </main>
  )
}
