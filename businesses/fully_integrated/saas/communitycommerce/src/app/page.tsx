import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CommunityCommerce',
  description: 'An AI-powered platform that transforms any community (Discord, Slack, Facebook Groups) into a sustainable e-commerce marketplace where members can buy, sell, and recommend eco-friendly products with built-in carbon tracking. Communities earn recurring revenue through automated affiliate programs and member subscription tiers while fostering sustainable purchasing habits.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CommunityCommerce</h1>
      <p className="mt-4 text-lg">An AI-powered platform that transforms any community (Discord, Slack, Facebook Groups) into a sustainable e-commerce marketplace where members can buy, sell, and recommend eco-friendly products with built-in carbon tracking. Communities earn recurring revenue through automated affiliate programs and member subscription tiers while fostering sustainable purchasing habits.</p>
    </main>
  )
}
