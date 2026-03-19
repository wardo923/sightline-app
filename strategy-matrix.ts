import { StrategyBundle, WizardAnswers } from "@/types/strategy"

export type ScoreMap = Record<StrategyBundle, number>

export function createEmptyScores(): ScoreMap {
  return {
    MOMENTUM_BREAKOUT: 0,
    LIQUIDITY_REVERSAL: 0,
    STRUCTURE_REACTION: 0,
    OPENING_RANGE: 0,
    VOLATILITY_EXPANSION: 0,
    SESSION_STRUCTURE: 0,
  }
}

export function scoreAnswers(answers: WizardAnswers): ScoreMap {
  const scores = createEmptyScores()

  // Market type
  if (answers.marketType === "Stocks") {
    scores.MOMENTUM_BREAKOUT += 1
    scores.OPENING_RANGE += 1
    scores.STRUCTURE_REACTION += 1
    scores.SESSION_STRUCTURE += 1
  }

  if (answers.marketType === "Crypto") {
    scores.VOLATILITY_EXPANSION += 2
    scores.LIQUIDITY_REVERSAL += 1
    scores.SESSION_STRUCTURE += 1
  }

  // Commodities: structure and level reactions dominate; some volatility expansion
  if (answers.marketType === "Commodities") {
    scores.STRUCTURE_REACTION += 3
    scores.SESSION_STRUCTURE += 2
    scores.VOLATILITY_EXPANSION += 1
  }

  // Specific asset
  if (answers.asset === "SPY") {
    scores.OPENING_RANGE += 4
    scores.STRUCTURE_REACTION += 3
    scores.SESSION_STRUCTURE += 2
    scores.MOMENTUM_BREAKOUT += 2
  }

  if (answers.asset === "QQQ") {
    scores.MOMENTUM_BREAKOUT += 5
    scores.OPENING_RANGE += 4
    scores.SESSION_STRUCTURE += 1
  }

  if (answers.asset === "NVDA") {
    scores.MOMENTUM_BREAKOUT += 5
    scores.VOLATILITY_EXPANSION += 3
    scores.OPENING_RANGE += 2
  }

  if (answers.asset === "AAPL") {
    scores.STRUCTURE_REACTION += 2
    scores.MOMENTUM_BREAKOUT += 2
    scores.SESSION_STRUCTURE += 1
  }

  if (answers.asset === "TSLA") {
    scores.VOLATILITY_EXPANSION += 3
    scores.MOMENTUM_BREAKOUT += 2
    scores.LIQUIDITY_REVERSAL += 1
  }

  if (answers.asset === "BTC") {
    scores.VOLATILITY_EXPANSION += 4
    scores.LIQUIDITY_REVERSAL += 2
    scores.SESSION_STRUCTURE += 2
  }

  if (answers.asset === "ETH") {
    scores.VOLATILITY_EXPANSION += 4
    scores.STRUCTURE_REACTION += 3
    scores.SESSION_STRUCTURE += 2
    scores.MOMENTUM_BREAKOUT += 2
  }

  if (answers.asset === "SOL") {
    scores.VOLATILITY_EXPANSION += 4
    scores.LIQUIDITY_REVERSAL += 2
    scores.MOMENTUM_BREAKOUT += 1
  }

  if (answers.asset === "XRP") {
    scores.VOLATILITY_EXPANSION += 3
    scores.LIQUIDITY_REVERSAL += 2
    scores.MOMENTUM_BREAKOUT += 1
  }

  // Commodity assets: level reactions and session structure dominate
  if (answers.asset === "GOLD") {
    scores.STRUCTURE_REACTION += 5
    scores.SESSION_STRUCTURE += 3
    scores.LIQUIDITY_REVERSAL += 1
  }

  if (answers.asset === "SILVER") {
    scores.STRUCTURE_REACTION += 4
    scores.VOLATILITY_EXPANSION += 2
    scores.SESSION_STRUCTURE += 2
  }

  if (answers.asset === "OIL") {
    scores.VOLATILITY_EXPANSION += 4
    scores.STRUCTURE_REACTION += 3
    scores.MOMENTUM_BREAKOUT += 1
  }

  // Basket selections — use representative composite scores
  if (answers.asset === "crypto-basket") {
    scores.VOLATILITY_EXPANSION += 3
    scores.LIQUIDITY_REVERSAL += 2
    scores.MOMENTUM_BREAKOUT += 1
  }

  if (answers.asset === "index-basket") {
    scores.OPENING_RANGE += 3
    scores.STRUCTURE_REACTION += 2
    scores.SESSION_STRUCTURE += 2
    scores.MOMENTUM_BREAKOUT += 1
  }

  if (answers.asset === "commodities-basket") {
    scores.STRUCTURE_REACTION += 4
    scores.SESSION_STRUCTURE += 3
    scores.VOLATILITY_EXPANSION += 1
  }


  if (answers.experience === "New to trading") {
    scores.STRUCTURE_REACTION += 3
    scores.SESSION_STRUCTURE += 2
  }

  if (answers.experience === "Some experience reading charts") {
    scores.MOMENTUM_BREAKOUT += 2
    scores.STRUCTURE_REACTION += 1
    scores.OPENING_RANGE += 1
  }

  if (answers.experience === "Experienced trader") {
    scores.LIQUIDITY_REVERSAL += 3
    scores.VOLATILITY_EXPANSION += 3
    scores.MOMENTUM_BREAKOUT += 2
  }

  // Style
  if (answers.style === "Breakouts and momentum moves") {
    scores.MOMENTUM_BREAKOUT += 4
    scores.OPENING_RANGE += 1
  }

  if (answers.style === "Reversals after failed moves") {
    scores.LIQUIDITY_REVERSAL += 4
  }

  if (answers.style === "Support and resistance reactions") {
    scores.STRUCTURE_REACTION += 4
    scores.SESSION_STRUCTURE += 1
  }

  if (answers.style === "Session structure and level interactions") {
    scores.SESSION_STRUCTURE += 4
    scores.STRUCTURE_REACTION += 1
  }

  // Market condition
  if (answers.marketCondition === "Strong trending moves") {
    scores.MOMENTUM_BREAKOUT += 3
    scores.VOLATILITY_EXPANSION += 3
  }

  if (answers.marketCondition === "Range-bound markets") {
    scores.STRUCTURE_REACTION += 3
    scores.SESSION_STRUCTURE += 3
  }

  if (answers.marketCondition === "Breakouts from consolidation") {
    scores.MOMENTUM_BREAKOUT += 3
    scores.OPENING_RANGE += 2
  }

  if (answers.marketCondition === "Reversals after sharp moves") {
    scores.LIQUIDITY_REVERSAL += 4
    scores.STRUCTURE_REACTION += 2
  }

  // Timeframe
  if (answers.timeframe === "Fast intraday (5 minute)") {
    scores.OPENING_RANGE += 4
    scores.MOMENTUM_BREAKOUT += 3
    scores.VOLATILITY_EXPANSION += 2
  }

  if (answers.timeframe === "Structured intraday (15 minute)") {
    scores.MOMENTUM_BREAKOUT += 3
    scores.LIQUIDITY_REVERSAL += 2
    scores.STRUCTURE_REACTION += 2
    scores.SESSION_STRUCTURE += 2
  }

  if (answers.timeframe === "Higher timeframe structure (1 hour)") {
    scores.SESSION_STRUCTURE += 4
    scores.STRUCTURE_REACTION += 3
  }

  // Trade frequency
  if (answers.tradeFrequency === "Fewer but higher-quality setups") {
    scores.STRUCTURE_REACTION += 2
    scores.SESSION_STRUCTURE += 2
  }

  if (answers.tradeFrequency === "A balanced number of setups") {
    scores.MOMENTUM_BREAKOUT += 1
    scores.STRUCTURE_REACTION += 1
    scores.LIQUIDITY_REVERSAL += 1
  }

  if (answers.tradeFrequency === "More active opportunities") {
    scores.VOLATILITY_EXPANSION += 2
    scores.OPENING_RANGE += 2
    scores.MOMENTUM_BREAKOUT += 1
  }

  // Holding style
  if (answers.holding === "Very short-term") {
    scores.OPENING_RANGE += 2
    scores.VOLATILITY_EXPANSION += 1
  }

  if (answers.holding === "Intraday") {
    scores.MOMENTUM_BREAKOUT += 2
    scores.LIQUIDITY_REVERSAL += 1
  }

  if (answers.holding === "I prefer patient setups") {
    scores.STRUCTURE_REACTION += 2
    scores.SESSION_STRUCTURE += 2
  }

  // Decision style
  if (answers.decisionStyle === "I like fast momentum opportunities") {
    scores.MOMENTUM_BREAKOUT += 2
    scores.OPENING_RANGE += 1
    scores.VOLATILITY_EXPANSION += 1
  }

  if (answers.decisionStyle === "I like waiting for clear structure") {
    scores.STRUCTURE_REACTION += 2
    scores.SESSION_STRUCTURE += 2
  }

  if (answers.decisionStyle === "I look for failed moves and reversals") {
    scores.LIQUIDITY_REVERSAL += 3
  }

  // Alert Mode preference
  if (answers.alertStrength === "Focused") {
    scores.STRUCTURE_REACTION += 1
    scores.SESSION_STRUCTURE += 1
  }

  if (answers.alertStrength === "Balanced") {
    scores.MOMENTUM_BREAKOUT += 2
    scores.STRUCTURE_REACTION += 1
  }

  if (answers.alertStrength === "Active") {
    scores.OPENING_RANGE += 1
    scores.VOLATILITY_EXPANSION += 1
    scores.MOMENTUM_BREAKOUT += 1
  }

  // Trend confirmation required → structural/session bundles benefit
  if (answers.trendConfirmation === "yes") {
    scores.SESSION_STRUCTURE += 2
    scores.STRUCTURE_REACTION += 1
    scores.MOMENTUM_BREAKOUT += 1
  } else if (answers.trendConfirmation === "no") {
    scores.LIQUIDITY_REVERSAL += 1
    scores.VOLATILITY_EXPANSION += 1
  }

  // Retest/confirmation required → patience-oriented bundles
  if (answers.retestPreference === "yes") {
    scores.STRUCTURE_REACTION += 2
    scores.SESSION_STRUCTURE += 1
  } else if (answers.retestPreference === "no") {
    scores.MOMENTUM_BREAKOUT += 1
    scores.OPENING_RANGE += 1
  }

  // Stop structure preference
  if (answers.stopStructure === "structure") {
    // Structure-based stops pair with level reaction and session bundles
    scores.STRUCTURE_REACTION += 2
    scores.SESSION_STRUCTURE += 1
  } else if (answers.stopStructure === "volatility") {
    // Volatility-based stops pair with expansion and breakout bundles
    scores.VOLATILITY_EXPANSION += 2
    scores.MOMENTUM_BREAKOUT += 1
  }

  // Reward profile preference
  if (answers.rewardProfile === "lower") {
    // Lower targets = higher probability = structure/session focus
    scores.STRUCTURE_REACTION += 2
    scores.SESSION_STRUCTURE += 1
  } else if (answers.rewardProfile === "balanced") {
    scores.MOMENTUM_BREAKOUT += 1
    scores.STRUCTURE_REACTION += 1
  } else if (answers.rewardProfile === "extended") {
    // Extended targets = need strong moves = breakout/volatility
    scores.MOMENTUM_BREAKOUT += 2
    scores.VOLATILITY_EXPANSION += 2
    scores.OPENING_RANGE += 1
  }

  return scores
}
