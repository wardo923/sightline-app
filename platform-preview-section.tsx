import Link from "next/link"
import { 
  BarChart3, 
  User, 
  Target, 
  Clock, 
  Bell, 
  Settings,
  TrendingUp,
  Check,
  AlertTriangle
} from "lucide-react"

const navItems = [
  { icon: BarChart3, label: "Dashboard", active: true },
  { icon: User, label: "Strategy Profile" },
  { icon: Target, label: "Active Trades" },
  { icon: Clock, label: "Trade History" },
  { icon: Bell, label: "Alerts" },
  { icon: Settings, label: "Account" },
]

export function PlatformPreviewSection() {
  return (
    <section className="section-glow-top py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Platform
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Inside the SightLine Platform
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground text-pretty">
            SightLine delivers structured trade setups and real-time alerts through a clean, easy-to-use dashboard.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-14 rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
          <div className="flex">
            {/* Sidebar */}
            <div className="hidden md:block w-56 border-r border-border bg-background/50 p-4">
              <div className="mb-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Navigation</p>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                      item.active 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Active Trade Card */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Active Trade
                </h3>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">BTC / 15m</span>
                      <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        BUY
                      </span>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      Strengthening
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Entry</p>
                      <p className="font-semibold text-foreground">64,200</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
                      <p className="font-semibold text-destructive">63,700</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Target</p>
                      <p className="font-semibold text-primary">65,300</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">R:R</p>
                      <p className="font-semibold text-foreground">2.2R</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Setup Quality: <span className="font-semibold text-primary">A</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Alerts */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  Recent Alerts
                </h3>
                <div className="rounded-xl border border-border bg-background/50 divide-y divide-border">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground"><span className="font-semibold">BTC</span> — Entry triggered at 64,200</p>
                      <p className="text-xs text-muted-foreground">12 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground"><span className="font-semibold">ETH</span> — Target reached at 3,550</p>
                      <p className="text-xs text-muted-foreground">45 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground"><span className="font-semibold">SOL</span> — Setup invalidated</p>
                      <p className="text-xs text-muted-foreground">1 hr ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 glow-green-sm"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </section>
  )
}
