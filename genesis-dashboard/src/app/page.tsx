import Link from "next/link"

export default function HomePage() {
  return (
    <section>
      <div className="panel">
        <p style={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.2em" }}>
          Genesis Ops Center
        </p>
        <h1 style={{ margin: "0.25rem 0 1rem", fontSize: "2.3rem" }}>Pulse & Performance</h1>
        <p style={{ color: "#cbd5f5" }}>
          View the latest business builds, cost telemetry, and compliance dashboards for the Genesis agent
          fleet. Use the sidebar to jump between the high-level monitor and the new x402 spending insights.
        </p>
        <div style={{ marginTop: "1.5rem" }}>
          <Link href="/x402" style={{ color: "#38bdf8", fontWeight: 600 }}>
            ↗ Open x402 Payments Insights
          </Link>
        </div>
      </div>
    </section>
  )
}
