"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, TrendingUp, TrendingDown, Check, X } from "lucide-react"
import { useSignals, Signal } from "@/hooks/use-signals"
import Link from "next/link"

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { signals, unreadCount, markAsRead } = useSignals()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const recentSignals = signals.slice(0, 5)

  const handleMarkAllRead = () => {
    recentSignals.filter(s => !s.read_at).forEach(signal => {
      markAsRead(signal.id)
    })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {recentSignals.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No signals yet. Complete the Strategy Wizard to start receiving trade setups.
              </div>
            ) : (
              recentSignals.map((signal) => (
                <SignalItem
                  key={signal.id}
                  signal={signal}
                  onRead={() => markAsRead(signal.id)}
                  onClose={() => setIsOpen(false)}
                />
              ))
            )}
          </div>

          {signals.length > 0 && (
            <div className="border-t border-border px-4 py-3">
              <Link
                href="/signals"
                className="block text-center text-sm text-primary hover:underline"
                onClick={() => setIsOpen(false)}
              >
                View all signals
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SignalItem({ signal, onRead, onClose }: { signal: Signal; onRead: () => void; onClose: () => void }) {
  const isUnread = !signal.read_at
  const timeAgo = getTimeAgo(signal.created_at)

  return (
    <Link
      href={`/signals/${signal.id}`}
      className={`flex gap-3 px-4 py-3 border-b border-border/50 last:border-0 cursor-pointer transition-colors hover:bg-muted/30 ${
        isUnread ? "bg-primary/5" : ""
      }`}
      onClick={() => {
        onRead()
        onClose()
      }}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
        signal.direction === "BUY" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
      }`}>
        {signal.direction === "BUY" ? (
          <TrendingUp className="h-5 w-5" />
        ) : (
          <TrendingDown className="h-5 w-5" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{signal.symbol}</span>
          <span className={`text-xs font-medium ${
            signal.direction === "BUY" ? "text-primary" : "text-destructive"
          }`}>
            {signal.direction}
          </span>
          {isUnread && (
            <span className="h-2 w-2 rounded-full bg-primary" />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          Entry: {signal.entry_price} | Target: {signal.target_1} | {signal.risk_reward}
        </p>
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">{timeAgo}</p>
      </div>

      <div className="flex items-center">
        {signal.status === "active" && <Check className="h-4 w-4 text-primary" />}
        {signal.status === "invalidated" && <X className="h-4 w-4 text-destructive" />}
      </div>
    </Link>
  )
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}
