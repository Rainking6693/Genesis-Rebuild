import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ContractSnap',
  description: 'AI-powered platform that instantly generates legally-compliant business contracts and agreements from simple conversational inputs, eliminating expensive lawyer consultations for routine documents. Users describe their needs in plain English, and our AI creates, customizes, and manages contract templates with automated reminders and e-signature workflows.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ContractSnap</h1>
      <p className="mt-4 text-lg">AI-powered platform that instantly generates legally-compliant business contracts and agreements from simple conversational inputs, eliminating expensive lawyer consultations for routine documents. Users describe their needs in plain English, and our AI creates, customizes, and manages contract templates with automated reminders and e-signature workflows.</p>
    </main>
  )
}
