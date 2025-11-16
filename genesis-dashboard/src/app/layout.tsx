import { ReactNode } from "react"
import Sidebar from "../components/Sidebar"
import "../globals.css"

export const metadata = {
  title: "Genesis Dashboard",
  description: "Operations, costs, and x402 telemetry for the Genesis autonomous system",
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
