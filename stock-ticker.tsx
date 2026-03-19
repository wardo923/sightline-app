"use client"

import { useEffect, useState } from "react"

interface TickerItem {
  symbol: string
  price: string
  change: string
  positive: boolean
}

const BASE_TICKERS: TickerItem[] = [
  { symbol: "SPY", price: "592.41", change: "+0.87%", positive: true },
  { symbol: "QQQ", price: "518.23", change: "+1.12%", positive: true },
  { symbol: "BTC", price: "97,284.50", change: "+2.34%", positive: true },
  { symbol: "ETH", price: "3,412.18", change: "-0.45%", positive: false },
  { symbol: "SOL", price: "187.62", change: "+3.71%", positive: true },
  { symbol: "AAPL", price: "241.84", change: "+0.52%", positive: true },
  { symbol: "NVDA", price: "138.07", change: "+1.63%", positive: true },
  { symbol: "TSLA", price: "352.19", change: "-1.28%", positive: false },
  { symbol: "AMZN", price: "227.55", change: "+0.91%", positive: true },
  { symbol: "META", price: "612.30", change: "+0.38%", positive: true },
  { symbol: "MSFT", price: "448.72", change: "-0.17%", positive: false },
  { symbol: "AMD", price: "164.93", change: "+2.05%", positive: true },
  { symbol: "GOOG", price: "191.48", change: "+0.64%", positive: true },
  { symbol: "ES", price: "5,942.25", change: "+0.73%", positive: true },
  { symbol: "NQ", price: "21,348.50", change: "+1.08%", positive: true },
  { symbol: "GC", price: "2,947.80", change: "+0.22%", positive: true },
]

function driftPrice(base: string): string {
  const num = parseFloat(base.replace(/,/g, ""))
  const drift = num * (Math.random() * 0.004 - 0.002)
  const result = num + drift
  if (result >= 1000) {
    return result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return result.toFixed(2)
}

function driftChange(base: string, positive: boolean): { change: string; positive: boolean } {
  const num = parseFloat(base.replace(/[+%]/g, ""))
  const drift = (Math.random() - 0.48) * 0.15
  const result = num + drift
  const isPos = result >= 0
  return {
    change: `${isPos ? "+" : ""}${result.toFixed(2)}%`,
    positive: isPos,
  }
}

function TickerItemDisplay({ item }: { item: TickerItem }) {
  return (
    <div className="flex items-center gap-3 px-5 shrink-0" aria-hidden="true">
      <span className="text-xs font-bold tracking-wide text-foreground/90 font-mono">
        {item.symbol}
      </span>
      <span className="text-xs text-muted-foreground font-mono tabular-nums">
        ${item.price}
      </span>
      <span
        className={`text-xs font-semibold font-mono tabular-nums ${
          item.positive ? "text-success" : "text-destructive"
        }`}
      >
        {item.change}
      </span>
    </div>
  )
}

export function StockTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>(BASE_TICKERS)

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const newPrice = driftPrice(t.price)
          const { change, positive } = driftChange(t.change, t.positive)
          return { ...t, price: newPrice, change, positive }
        })
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full overflow-hidden" role="marquee" aria-label="Live market data">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

      <div className="flex items-center py-3 ticker-scroll">
        <div className="flex items-center shrink-0 ticker-track">
          {tickers.map((item, i) => (
            <TickerItemDisplay key={`a-${i}`} item={item} />
          ))}
          {/* Separator dot */}
          <div className="px-3 shrink-0">
            <span className="block h-1 w-1 rounded-full bg-primary/30" />
          </div>
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex items-center shrink-0 ticker-track">
          {tickers.map((item, i) => (
            <TickerItemDisplay key={`b-${i}`} item={item} />
          ))}
          <div className="px-3 shrink-0">
            <span className="block h-1 w-1 rounded-full bg-primary/30" />
          </div>
        </div>
      </div>
    </div>
  )
}
