"use client"

import { 
  TrendingUp, 
  ArrowDownUp, 
  Target, 
  Clock, 
  Zap,
  Layers,
  Lock,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { STRATEGY_INFO, StrategyKey } from "@/lib/strategies"

// Icon mapping for strategies
const STRATEGY_ICONS: Record<StrategyKey, typeof Zap> = {
  MOMENTUM_BREAKOUT: TrendingUp,
  LIQUIDITY_REVERSAL: ArrowDownUp,
  STRUCTURE_REACTION: Target,
  OPENING_RANGE: Clock,
  VOLATILITY_EXPANSION: Zap,
  SESSION_STRUCTURE: Layers
}

interface StrategySummaryCardProps {
  bundleName: string
  asset: string
  timeframe: string
  marketType: string
  confidenceScore?: number
  showLink?: boolean
  compact?: boolean
}

export function StrategySummaryCard({
  bundleName,
  asset,
  timeframe,
  marketType,
  confidenceScore,
  showLink = false,
  compact = false
}: StrategySummaryCardProps) {
  const strategyKey = bundleName as StrategyKey
  const info = STRATEGY_INFO[strategyKey]
  const Icon = STRATEGY_ICONS[strategyKey] || TrendingUp

  if (!info) {
    return null
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{info.name}</p>
          <p className="text-xs text-muted-foreground">
            {asset} · {timeframe} · {marketType}
          </p>
        </div>
        {confidenceScore && (
          <span className="text-xs font-medium text-primary">{confidenceScore}%</span>
        )}
        {showLink && (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-background p-5">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">{info.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
        </div>
        {confidenceScore && (
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{confidenceScore}%</p>
            <p className="text-[10px] text-muted-foreground">match</p>
          </div>
        )}
      </div>

      {/* Locked Parameters */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-background/50 p-3 text-center">
          <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 mb-1">
            <Lock className="h-2.5 w-2.5" /> Asset
          </p>
          <p className="text-sm font-bold text-foreground">{asset}</p>
        </div>
        <div className="rounded-xl bg-background/50 p-3 text-center">
          <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 mb-1">
            <Lock className="h-2.5 w-2.5" /> Timeframe
          </p>
          <p className="text-sm font-bold text-foreground">{timeframe}</p>
        </div>
        <div className="rounded-xl bg-background/50 p-3 text-center">
          <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 mb-1">
            <Lock className="h-2.5 w-2.5" /> Market
          </p>
          <p className="text-sm font-bold text-foreground">{marketType}</p>
        </div>
      </div>

      {/* Best For */}
      <div className="mt-4 rounded-xl bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Best for:</span> {info.bestFor}
        </p>
      </div>

      {showLink && (
        <Link
          href="/strategy/result"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary/10 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          View Strategy Details
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
