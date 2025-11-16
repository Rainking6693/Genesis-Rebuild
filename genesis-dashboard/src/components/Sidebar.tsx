"use client"

import Link from "next/link"

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Executive Overview", href: "/overview" },
  { label: "Agent Health", href: "/agents" },
  { label: "x402 Spend", href: "/x402" },
  { label: "Revenue Reports", href: "/revenue" },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <h2>Genesis OPS</h2>
        <p style={{ color: "#6578a4", margin: "0.3rem 0 1rem", fontSize: "0.8rem" }}>
          Autonomous monitoring suite
        </p>
      </div>
      <nav>
        {LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="sidebar-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
