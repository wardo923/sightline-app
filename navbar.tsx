"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Crosshair, LogOut, User, ChevronDown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { NotificationBell } from "./notification-bell"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const navLinks = [
  { href: "/technology", label: "Technology" },
  { href: "/strategy-examples", label: "Strategy Examples" },
  { href: "/risk-framework", label: "Risk Framework" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNavDropdown, setShowNavDropdown] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setShowUserMenu(false)
    router.push("/")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Crosshair className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-foreground">SightLine</span>
            <span className="text-[10px] font-medium tracking-widest text-primary uppercase">Advanced Trading Analytics</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-1 lg:flex">
          <div className="relative">
            <button
              onClick={() => setShowNavDropdown(!showNavDropdown)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Learn More
              <ChevronDown className="h-4 w-4" />
            </button>
            {showNavDropdown && (
              <div className="absolute left-0 top-10 w-48 rounded-xl border border-border bg-card p-2 shadow-lg">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setShowNavDropdown(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoading ? (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-muted" />
          ) : user ? (
            <>
              <NotificationBell />
              <Link
                href="/dashboard"
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary"
              >
                Dashboard
              </Link>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40"
                >
                  <User className="h-5 w-5" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-48 rounded-xl border border-border bg-card p-2 shadow-lg">
                    <p className="truncate px-3 py-2 text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/strategy-wizard"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-green-sm"
              >
                Start Strategy Wizard
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background px-5 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-2 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <hr className="border-border mb-4" />
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                <p className="truncate px-3 py-2 text-xs text-muted-foreground">
                  {user.email}
                </p>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileOpen(false)
                  }}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:border-primary/40"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-12 items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:border-primary/40"
                >
                  Login
                </Link>
                <Link
                  href="/strategy-wizard"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Start Strategy Wizard
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
