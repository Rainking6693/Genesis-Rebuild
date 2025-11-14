'use client'

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'agents', label: 'Agent Status', icon: '🤖' },
    { id: 'revenue', label: 'Revenue & Profit', icon: '💰' },
    { id: 'halo', label: 'HALO Routes', icon: '🔀' },
    { id: 'memory', label: 'CaseBank', icon: '💾' },
    { id: 'traces', label: 'OTEL Traces', icon: '🔍' },
    { id: 'approvals', label: 'Approvals', icon: '✅' },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Genesis</h1>
        <p className="text-sm text-muted-foreground">System Monitor</p>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  activeView === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
