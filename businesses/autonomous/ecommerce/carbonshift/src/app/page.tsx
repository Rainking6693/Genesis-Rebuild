import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonShift',
  description: 'AI-powered sustainability analytics platform that helps e-commerce businesses automatically calculate, reduce, and offset their carbon footprint while turning eco-friendly practices into competitive marketing advantages. We transform complex climate data into actionable insights and customer-facing sustainability badges that boost conversion rates.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonShift</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that helps e-commerce businesses automatically calculate, reduce, and offset their carbon footprint while turning eco-friendly practices into competitive marketing advantages. We transform complex climate data into actionable insights and customer-facing sustainability badges that boost conversion rates.</p>
    </main>
  )
}
