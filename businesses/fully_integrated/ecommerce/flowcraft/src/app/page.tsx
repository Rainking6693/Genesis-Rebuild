import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FlowCraft',
  description: 'A no-code automation marketplace where small businesses can instantly purchase, customize, and deploy pre-built workflow automations created by expert automation builders. Think 'Shopify themes but for business processes' - businesses get instant productivity solutions while creators earn recurring revenue from their automation templates.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">FlowCraft</h1>
      <p className="mt-4 text-lg">A no-code automation marketplace where small businesses can instantly purchase, customize, and deploy pre-built workflow automations created by expert automation builders. Think 'Shopify themes but for business processes' - businesses get instant productivity solutions while creators earn recurring revenue from their automation templates.</p>
    </main>
  )
}
