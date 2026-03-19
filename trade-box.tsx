"use client"

interface TradeBoxProps {
  entry: number
  stopLoss: number
  target1: number
  target2?: number
  direction: "BUY" | "SELL"
  riskReward: string
}

export function TradeBox({ entry, stopLoss, target1, target2, direction, riskReward }: TradeBoxProps) {
  // Calculate the price range for scaling
  const allPrices = [entry, stopLoss, target1, target2].filter((p): p is number => p !== undefined)
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const range = maxPrice - minPrice
  const padding = range * 0.1

  const chartMin = minPrice - padding
  const chartMax = maxPrice + padding
  const chartRange = chartMax - chartMin

  // Convert price to percentage position (inverted for visual display - higher price = higher on chart)
  const priceToPercent = (price: number) => ((price - chartMin) / chartRange) * 100

  const entryY = priceToPercent(entry)
  const stopY = priceToPercent(stopLoss)
  const target1Y = priceToPercent(target1)
  const target2Y = target2 ? priceToPercent(target2) : null

  // For BUY: stop is below entry, targets are above
  // For SELL: stop is above entry, targets are below
  const isBuy = direction === "BUY"

  return (
    <div className="rounded-xl border border-border bg-background/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Trade Plan
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          R:R {riskReward}
        </span>
      </div>

      {/* Visual Trade Box */}
      <div className="relative h-40 w-full rounded-lg bg-card border border-border overflow-hidden">
        {/* Target 2 Zone (if exists) - Dark Green */}
        {target2Y !== null && (
          <div
            className="absolute left-0 right-0 bg-emerald-500/15 border-t border-emerald-600"
            style={{
              bottom: isBuy ? `${target1Y}%` : "auto",
              top: isBuy ? "auto" : `${100 - target1Y}%`,
              height: `${Math.abs(target2Y - target1Y)}%`,
            }}
          >
            <div 
              className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-600"
              style={{ 
                bottom: isBuy ? 0 : "auto",
                top: isBuy ? "auto" : 0,
              }}
            />
            <span className="absolute right-2 text-[9px] font-medium text-emerald-500" style={{ top: "50%", transform: "translateY(-50%)" }}>
              T2 {target2.toLocaleString()}
            </span>
          </div>
        )}

        {/* Target 1 Zone - Light Green */}
        <div
          className="absolute left-0 right-0 bg-primary/10"
          style={{
            bottom: isBuy ? `${entryY}%` : "auto",
            top: isBuy ? "auto" : `${100 - entryY}%`,
            height: `${Math.abs(target1Y - entryY)}%`,
          }}
        >
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-primary/60"
            style={{ 
              bottom: isBuy ? 0 : "auto",
              top: isBuy ? "auto" : 0,
            }}
          />
          <span className="absolute right-2 text-[9px] font-medium text-primary" style={{ top: "50%", transform: "translateY(-50%)" }}>
            T1 {target1.toLocaleString()}
          </span>
        </div>

        {/* Entry Line - White */}
        <div
          className="absolute left-0 right-0 border-t-2 border-white/80 z-10"
          style={{ bottom: `${entryY}%` }}
        >
          <span className="absolute left-2 -top-3 text-[9px] font-bold text-white bg-white/20 px-1.5 py-0.5 rounded">
            Entry {entry.toLocaleString()}
          </span>
        </div>

        {/* Stop Loss Zone - Red */}
        <div
          className="absolute left-0 right-0 bg-destructive/15"
          style={{
            bottom: isBuy ? 0 : `${entryY}%`,
            top: isBuy ? `${100 - entryY}%` : 0,
            height: `${Math.abs(entryY - stopY)}%`,
          }}
        >
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-destructive/60"
            style={{ 
              top: isBuy ? 0 : "auto",
              bottom: isBuy ? "auto" : 0,
            }}
          />
          <span className="absolute right-2 text-[9px] font-medium text-destructive" style={{ top: "50%", transform: "translateY(-50%)" }}>
            Stop {stopLoss.toLocaleString()}
          </span>
        </div>

        {/* Price Scale on left */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-[9px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-white/80" />
          <span>Entry</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          <span>Risk Zone</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>Target Zone</span>
        </div>
      </div>
    </div>
  )
}
