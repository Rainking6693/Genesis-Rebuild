import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonCred AI',
  description: 'AI-powered carbon footprint tracking and offset marketplace that automatically calculates business emissions from receipts/invoices and connects companies to verified carbon credit projects. Small businesses get instant ESG compliance reporting while earning customer loyalty through transparent climate action.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonCred AI</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking and offset marketplace that automatically calculates business emissions from receipts/invoices and connects companies to verified carbon credit projects. Small businesses get instant ESG compliance reporting while earning customer loyalty through transparent climate action.</p>
    </main>
  )
}
