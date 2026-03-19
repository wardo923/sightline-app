import { StrategyBundle } from "@/types/strategy"

// Export StrategyKey as an alias for StrategyBundle for backwards compatibility
export type StrategyKey = StrategyBundle

export const STRATEGY_INFO: Record<
  StrategyBundle,
  {
    name: string
    shortName: string
    description: string
    bestFor: string[]
  }
> = {
  MOMENTUM_BREAKOUT: {
    name: "Momentum Breakout Strategy",
    shortName: "Momentum Breakout",
    description:
      "Designed to identify continuation opportunities when price breaks key structure with supporting momentum.",
    bestFor: ["SPY", "QQQ", "NVDA", "AAPL", "TSLA"],
  },
  LIQUIDITY_REVERSAL: {
    name: "Liquidity Reversal Strategy",
    shortName: "Liquidity Reversal",
    description:
      "Designed to identify reversals after failed moves, liquidity sweeps, or fast reclaims.",
    bestFor: ["SPY", "QQQ", "BTC", "ETH", "SOL"],
  },
  STRUCTURE_REACTION: {
    name: "Structure Reaction Strategy",
    shortName: "Structure Reaction",
    description:
      "Built around support and resistance behavior, reaction zones, and cleaner market structure decisions.",
    bestFor: ["SPY", "AAPL", "BTC", "ETH"],
  },
  OPENING_RANGE: {
    name: "Opening Range Strategy",
    shortName: "Opening Range",
    description:
      "Focused on early-session directional opportunities using opening structure and intraday momentum.",
    bestFor: ["SPY", "QQQ", "NVDA"],
  },
  VOLATILITY_EXPANSION: {
    name: "Volatility Expansion Strategy",
    shortName: "Volatility Expansion",
    description:
      "Targets expanding price movement and stronger directional activity in fast-moving markets.",
    bestFor: ["BTC", "ETH", "SOL", "TSLA", "NVDA"],
  },
  SESSION_STRUCTURE: {
    name: "Session Structure Strategy",
    shortName: "Session Structure",
    description:
      "Uses session behavior, key levels, and acceptance or rejection around important market zones.",
    bestFor: ["SPY", "QQQ", "BTC", "ETH"],
  },
}
