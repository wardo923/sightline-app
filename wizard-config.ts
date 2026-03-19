// MASTER WIZARD CONFIGURATION
// Single source of truth for all strategy wizard questions across SightLine

import type { WizardAnswers as MatrixWizardAnswers } from "@/types/strategy"

export interface WizardOption {
  id: string
  label: string
  description?: string
  locked?: boolean
  lockLabel?: string
}

export interface WizardStep {
  id: string
  title: string
  subtitle: string
  type: "single-select" | "multi-select"
  minSelections?: number
  options: WizardOption[]
  groups?: { label: string; optionIds: string[] }[]
  customInput?: {
    id: string
    label: string
    placeholder: string
    helperText: string
    locked?: boolean
    lockLabel?: string
  }
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: "marketCoverage",
    title: "Which markets should SightLine monitor?",
    subtitle: "Choose the market types your strategy will focus on.",
    type: "single-select",
    options: [
      { id: "crypto", label: "Crypto", description: "Monitor major digital asset markets" },
      { id: "stocks", label: "Stocks", description: "Monitor major US equity markets" },
      { id: "commodities", label: "Commodities", description: "Monitor global commodity markets" },
      { id: "all", label: "All Markets", description: "Crypto, stocks, and commodities", locked: true, lockLabel: "Pro" },
    ],
  },
  {
    id: "assetFocus",
    title: "Which assets should SightLine prioritize?",
    subtitle: "Select the specific assets or asset groups the engine should monitor first.",
    type: "multi-select",
    minSelections: 1,
    groups: [
      { label: "Crypto", optionIds: ["BTC", "ETH", "SOL", "XRP"] },
      { label: "Stock Indexes", optionIds: ["SPY", "QQQ"] },
      { label: "Commodities", optionIds: ["GOLD", "SILVER", "OIL"] },
      { label: "Baskets", optionIds: ["crypto-basket", "index-basket", "commodities-basket"] },
    ],
    options: [
      { id: "BTC", label: "BTC", description: "Bitcoin" },
      { id: "ETH", label: "ETH", description: "Ethereum" },
      { id: "SOL", label: "SOL", description: "Solana" },
      { id: "XRP", label: "XRP", description: "XRP" },
      { id: "SPY", label: "SPY", description: "S&P 500 ETF" },
      { id: "QQQ", label: "QQQ", description: "Nasdaq 100 ETF" },
      { id: "GOLD", label: "GOLD", description: "Gold market" },
      { id: "SILVER", label: "SILVER", description: "Silver market" },
      { id: "OIL", label: "OIL", description: "Crude oil market" },
      { id: "crypto-basket", label: "Major Crypto Basket", description: "Leading digital assets" },
      { id: "index-basket", label: "Index ETF Basket", description: "Major US market ETFs" },
      { id: "commodities-basket", label: "Commodities Basket", description: "Gold, silver and oil markets" },
    ],
    customInput: {
      id: "customTickers",
      label: "Enable Custom Tickers",
      placeholder: "AAPL, NVDA, TSLA, BTC, ETH",
      helperText: "Stocks, crypto, ETFs and commodities supported.",
      locked: true,
      lockLabel: "Pro",
    },
  },
  {
    id: "tradingPace",
    title: "How active would you like your strategy to be?",
    subtitle: "This determines how selective the signal engine will be.",
    type: "single-select",
    options: [
      { id: "selective", label: "Selective", description: "Only stronger opportunities" },
      { id: "balanced", label: "Balanced", description: "Moderate number of setups" },
      { id: "active", label: "Active", description: "More frequent opportunities" },
    ],
  },
  {
    id: "marketBehavior",
    title: "Which type of market movement do you typically trust most?",
    subtitle: "SightLine uses this to calibrate your strategy style.",
    type: "single-select",
    options: [
      { id: "momentum", label: "Strong Directional Moves", description: "Momentum driven market expansion" },
      { id: "pullback", label: "Pullbacks Within Trends", description: "Continuation opportunities" },
      { id: "levels", label: "Reactions Near Key Levels", description: "Support and resistance behavior" },
      { id: "reversal", label: "Early Shifts in Direction", description: "Momentum turning points" },
    ],
  },
  {
    id: "tradeDuration",
    title: "How long do you expect trades to develop?",
    subtitle: "This helps determine the monitoring timeframe.",
    type: "single-select",
    options: [
      { id: "fast", label: "Fast", description: "Shorter intraday opportunities" },
      { id: "intraday", label: "Intraday", description: "Moves that develop during the session" },
      { id: "swing", label: "Swing", description: "Opportunities that develop across multiple days" },
    ],
  },
  {
    id: "signalStrictness",
    title: "How selective should the signal engine be?",
    subtitle: "Higher selectivity produces fewer but stronger setups.",
    type: "single-select",
    options: [
      { id: "conservative", label: "Conservative", description: "Only higher conviction setups" },
      { id: "balanced", label: "Balanced", description: "Mix of quality and frequency" },
      { id: "expanded", label: "Expanded Coverage", description: "More opportunities", locked: true, lockLabel: "Pro" },
    ],
  },
  {
    id: "trendConfirmation",
    title: "Should trend alignment be required?",
    subtitle: "Trend confirmation can increase reliability.",
    type: "single-select",
    options: [
      { id: "yes", label: "Yes", description: "Require trend alignment" },
      { id: "no", label: "No", description: "Allow setups in more conditions" },
    ],
  },
  {
    id: "retestPreference",
    title: "Should price confirmation be required before a setup qualifies?",
    subtitle: "Waiting for confirmation can increase reliability but reduce frequency.",
    type: "single-select",
    options: [
      { id: "yes", label: "Yes", description: "Wait for confirmation" },
      { id: "no", label: "No", description: "Allow faster qualification" },
    ],
  },
  {
    id: "stopStructure",
    title: "How should protection levels be structured?",
    subtitle: "Choose how risk levels should be calculated.",
    type: "single-select",
    options: [
      { id: "volatility", label: "Volatility Based", description: "Adaptive to market movement" },
      { id: "structure", label: "Structure Based", description: "Based on support and resistance behavior" },
    ],
  },
  {
    id: "rewardProfile",
    title: "What reward profile do you prefer?",
    subtitle: "Higher targets may reduce win rate.",
    type: "single-select",
    options: [
      { id: "lower", label: "Lower Target Profile", description: "Higher probability outcomes" },
      { id: "balanced", label: "Balanced Target Profile", description: "Balanced risk and reward" },
      { id: "extended", label: "Extended Target Profile", description: "Larger potential moves" },
    ],
  },
  {
    id: "signalFrequency",
    title: "How often would you like to see opportunities?",
    subtitle: "SightLine focuses on quality setups rather than constant signals.",
    type: "single-select",
    options: [
      { id: "strongest", label: "Only the Strongest Opportunities", description: "2-4 per week" },
      { id: "balanced", label: "Balanced Number of Setups", description: "5-10 per week" },
      { id: "frequent", label: "More Frequent Opportunities", description: "10-20 per week", locked: true, lockLabel: "Pro" },
    ],
  },
  // STEP 13: Session timing — feeds directly into time_of_day DB column
  // Engine reads this to filter signals to preferred trading window
  {
    id: "sessionTiming",
    title: "When do you prefer to trade?",
    subtitle: "SightLine will prioritize setups during your preferred session.",
    type: "single-select",
    options: [
      { id: "market_open", label: "Market Open", description: "First 90 minutes — highest volume, strongest moves" },
      { id: "full_session", label: "Full Session", description: "All day monitoring — no session filter" },
      { id: "market_close", label: "Market Close", description: "Final hour — late-day trend continuation" },
      { id: "any", label: "Any Time", description: "Crypto or no preference — 24/7 monitoring" },
    ],
  },

  // STEP 14: Higher timeframe alignment preference
  // htfAligned is a 2-point primary condition on every signal type
  // This tells the engine whether to require it or treat it as optional
  {
    id: "htfAlignmentRequired",
    title: "Should setups align with the higher timeframe bias?",
    subtitle: "Requiring higher timeframe alignment reduces signal frequency but increases reliability.",
    type: "single-select",
    options: [
      { id: "required", label: "Yes, required", description: "Only fire when daily or 4H bias agrees — fewer but stronger" },
      { id: "preferred", label: "Preferred but not required", description: "Score higher when aligned, still fire without it" },
      { id: "not_required", label: "No preference", description: "Focus on the setup alone — higher frequency" },
    ],
  },

  // STEP 15: Volume confirmation preference
  // volumeConfirmed is a primary scoring condition in v1-scoring
  // Also determines whether 'Structure + volume' confirmation style is applied
  {
    id: "volumeConfirmation",
    title: "Should volume expansion be required to confirm a setup?",
    subtitle: "Volume confirmation filters out weak or low-conviction moves.",
    type: "single-select",
    options: [
      { id: "required", label: "Yes, require volume confirmation", description: "Signals only fire with above-average volume" },
      { id: "preferred", label: "Preferred but optional", description: "Volume adds score weight but is not blocking" },
      { id: "not_required", label: "No — structure only", description: "Do not filter on volume" },
    ],
  },

  {
    id: "alertDelivery",
    title: "How would you like to receive alerts?",
    subtitle: "Choose how you want to be notified.",
    type: "multi-select",
    minSelections: 1,
    options: [
      { id: "dashboard", label: "Dashboard Alerts", description: "View alerts inside SightLine" },
      { id: "email", label: "Email Alerts", description: "Receive alerts by email" },
      { id: "sms", label: "SMS Alerts", description: "Receive text messages", locked: true, lockLabel: "Pro" },
      { id: "telegram", label: "Telegram Alerts", description: "Receive Telegram notifications", locked: true, lockLabel: "Pro" },
    ],
  },
]

// Strategy Style Mapping (user-facing labels, no internal engine names)
export const STRATEGY_STYLE_LABELS: Record<string, string> = {
  momentum: "Directional Momentum",
  pullback: "Trend Continuation",
  levels: "Key Level Reactions",
  reversal: "Momentum Shift Profile",
}

// Opportunity Range Estimates
export const OPPORTUNITY_ESTIMATES: Record<string, string> = {
  selective: "2 to 4 opportunities per week",
  balanced: "5 to 10 opportunities per week",
  active: "10 to 20 opportunities per week",
}

// Default answers for new wizard
export const DEFAULT_WIZARD_ANSWERS: Record<string, string | string[]> = {
  marketCoverage: "",
  assetFocus: [],
  tradingPace: "",
  marketBehavior: "",
  tradeDuration: "",
  signalStrictness: "",
  trendConfirmation: "",
  retestPreference: "",
  stopStructure: "",
  rewardProfile: "",
  signalFrequency: "",
  sessionTiming: "",
  htfAlignmentRequired: "",
  volumeConfirmation: "",
  alertDelivery: ["dashboard"],
}

// Type for wizard answers
export type WizardAnswers = typeof DEFAULT_WIZARD_ANSWERS

// ============================================================================
// MATRIX MAPPING FUNCTIONS
// Convert new user-facing wizard answers to strategy matrix inputs
// This ensures the new wizard feeds the existing strategy engine
// ============================================================================

/**
 * Maps new wizard answers to the strategy matrix format
 * The matrix expects: marketType, asset, experience, style, marketCondition,
 * timeframe, tradeFrequency, holding, decisionStyle, alertStrength
 */
export function mapToMatrixAnswers(answers: WizardAnswers): MatrixWizardAnswers {
  const assetFocus = Array.isArray(answers.assetFocus) ? answers.assetFocus : []
  const primaryAsset = assetFocus[0] || "SPY"
  
  // Map marketCoverage → marketType
  const marketType = answers.marketCoverage === "crypto" ? "Crypto" 
    : answers.marketCoverage === "stocks" ? "Stocks"
    : answers.marketCoverage === "commodities" ? "Commodities"
    : "Stocks"
  
  // Map marketBehavior → style
  const styleMap: Record<string, string> = {
    momentum: "Breakouts and momentum moves",
    pullback: "Session structure and level interactions", 
    levels: "Support and resistance reactions",
    reversal: "Reversals after failed moves",
  }
  const style = styleMap[answers.marketBehavior as string] || "Breakouts and momentum moves"
  
  // Map marketBehavior → marketCondition
  const conditionMap: Record<string, string> = {
    momentum: "Strong trending moves",
    pullback: "Breakouts from consolidation",
    levels: "Range-bound markets",
    reversal: "Reversals after sharp moves",
  }
  const marketCondition = conditionMap[answers.marketBehavior as string] || "Strong trending moves"
  
  // Map tradeDuration → timeframe
  const timeframeMap: Record<string, string> = {
    fast: "Fast intraday (5 minute)",
    intraday: "Structured intraday (15 minute)",
    swing: "Higher timeframe structure (1 hour)",
  }
  const timeframe = timeframeMap[answers.tradeDuration as string] || "Structured intraday (15 minute)"
  
  // Map signalFrequency → tradeFrequency
  const frequencyMap: Record<string, string> = {
    strongest: "Fewer but higher-quality setups",
    balanced: "A balanced number of setups",
    frequent: "More active opportunities",
  }
  const tradeFrequency = frequencyMap[answers.signalFrequency as string] || "A balanced number of setups"
  
  // Map tradeDuration → holding
  const holdingMap: Record<string, string> = {
    fast: "Very short-term",
    intraday: "Intraday",
    swing: "I prefer patient setups",
  }
  const holding = holdingMap[answers.tradeDuration as string] || "Intraday"
  
  // Map marketBehavior → decisionStyle
  // Fix: pullback traders prefer structure, not momentum
  const decisionMap: Record<string, string> = {
    momentum: "I like fast momentum opportunities",
    pullback: "I like waiting for clear structure",
    levels: "I like waiting for clear structure",
    reversal: "I look for failed moves and reversals",
  }
  const decisionStyle = decisionMap[answers.marketBehavior as string] || "I like waiting for clear structure"

  // Map signalStrictness + tradingPace → alertStrength
  // Use consistent naming that matches strategy-matrix.ts scoring keys
  const getAlertStrength = (): string => {
    if (answers.signalStrictness === "conservative" || answers.tradingPace === "selective") {
      return "Focused"
    }
    if (answers.signalStrictness === "expanded" || answers.tradingPace === "active") {
      return "Active"
    }
    return "Balanced"
  }

  // Map tradingPace → experience
  // Use signalStrictness as a stronger signal for experience than pace alone
  const getExperience = (): string => {
    if (answers.signalStrictness === "conservative") return "Experienced trader"
    if (answers.tradingPace === "selective") return "Experienced trader"
    if (answers.tradingPace === "active") return "Some experience reading charts"
    return "Some experience reading charts"
  }

  // Map trendConfirmation + retestPreference → confirmation bias
  // These feed into alertStrength and holding adjustments
  const trendRequired = answers.trendConfirmation === "yes"
  const retestRequired = answers.retestPreference === "yes"

  // If both confirmations required, push toward more selective/structural bundles
  // by strengthening alertStrength toward Focused and holding toward patient
  const confirmationBias = trendRequired && retestRequired ? "high" : trendRequired || retestRequired ? "medium" : "none"

  // Map stopStructure → affects holding/patience signal
  // Volatility-based stops pair with faster moves; structure-based with patient setups
  const holdingAdjusted = answers.stopStructure === "volatility"
    ? (holding === "I prefer patient setups" ? "Intraday" : holding)
    : holding

  // Map rewardProfile → affects tradeFrequency signal
  // Extended targets mean fewer, higher-quality setups needed
  const tradeFrequencyAdjusted = answers.rewardProfile === "extended"
    ? "Fewer but higher-quality setups"
    : answers.rewardProfile === "lower"
    ? "More active opportunities"
    : tradeFrequency

  // Derive final alertStrength incorporating confirmation bias
  const baseAlertStrength = getAlertStrength()
  const alertStrengthFinal = confirmationBias === "high" && baseAlertStrength !== "Focused"
    ? "Focused"
    : confirmationBias === "none" && baseAlertStrength === "Balanced" && answers.rewardProfile === "extended"
    ? "Focused"
    : baseAlertStrength

  // Map sessionTiming → time_of_day
  const sessionTimingMap: Record<string, string> = {
    market_open: "Market Open Focus",
    full_session: "All Day",
    market_close: "Market Close Focus",
    any: "any",
  }
  const sessionTimingMapped = sessionTimingMap[answers.sessionTiming as string] ?? "All Day"

  // Map htfAlignmentRequired → confirmation style modifier
  // 'required' upgrades confirmation_style to Multi-confirmation
  // 'not_required' downgrades to Structure only
  const getConfirmationStyleFromHtf = (): string => {
    const base = answers.signalStrictness === "conservative" ? "Multi-confirmation"
      : answers.signalStrictness === "expanded" ? "Structure only"
      : "Structure + volume"
    if (answers.htfAlignmentRequired === "required") return "Multi-confirmation"
    if (answers.htfAlignmentRequired === "not_required") return "Structure only"
    return base
  }

  // Map volumeConfirmation → refine confirmation style
  // If volume required and not already Multi-confirmation, use Structure + volume
  const getFinalConfirmationStyle = (): string => {
    const htfStyle = getConfirmationStyleFromHtf()
    if (htfStyle === "Multi-confirmation") return htfStyle
    if (answers.volumeConfirmation === "required") return "Structure + volume"
    if (answers.volumeConfirmation === "not_required") return "Structure only"
    return htfStyle
  }

  return {
    marketType,
    asset: primaryAsset,
    experience: getExperience(),
    style,
    marketCondition,
    timeframe,
    tradeFrequency: tradeFrequencyAdjusted,
    holding: holdingAdjusted,
    decisionStyle,
    alertStrength: alertStrengthFinal,
    // Pass through for any consumers that want raw values
    trendConfirmation: answers.trendConfirmation as string,
    retestPreference: answers.retestPreference as string,
    stopStructure: answers.stopStructure as string,
    rewardProfile: answers.rewardProfile as string,
    // New fields
    sessionTiming: sessionTimingMapped,
    confirmationStyle: getFinalConfirmationStyle(),
  }
}

/**
 * Generates complete strategy profile data for database storage
 * Combines matrix-mapped answers with additional wizard preferences
 */
export function generateStrategyData(
  answers: WizardAnswers,
  matrixResult: {
    bundle: string
    confidence: number
    secondaryBundle?: string | null
  }
) {
  const assetFocus = Array.isArray(answers.assetFocus) ? answers.assetFocus : []
  const alertDelivery = Array.isArray(answers.alertDelivery) ? answers.alertDelivery : ["dashboard"]
  
  // Map tradeDuration to timeframe string
  const timeframeMap: Record<string, string> = {
    fast: "5m",
    intraday: "15m", 
    swing: "1H",
  }
  
  // Map signalStrictness to engine-native confirmation_style values
  const filterMap: Record<string, string> = {
    conservative: "Multi-confirmation",
    balanced: "Structure + volume",
    expanded: "Structure only",
  }
  
  // Map tradingPace to alert frequency
  const frequencyMap: Record<string, string> = {
    selective: "Low",
    balanced: "Medium",
    active: "Higher",
  }

  return {
    // Core strategy identifiers from matrix
    bundle_name: matrixResult.bundle,
    secondary_bundle: matrixResult.secondaryBundle || null,
    confidence_score: matrixResult.confidence,
    
    // Market settings
    market_type: answers.marketCoverage === "crypto" ? "crypto" : "index_etf",
    asset: assetFocus[0] || "SPY",
    assets: assetFocus,
    
    // Strategy behavior settings
    trading_style: answers.tradingPace || "balanced",
    timeframe: timeframeMap[answers.tradeDuration as string] || "15m",
    setup_preference: answers.marketBehavior || "momentum",
    signal_frequency: answers.signalFrequency || "balanced",
    
    // Confirmation and filter settings  
    confirmation_style: filterMap[answers.signalStrictness as string] || "Moderate",
    trend_required: answers.trendConfirmation === "yes",
    retest_required: answers.retestPreference === "yes",
    
    // Risk settings
    stop_structure: answers.stopStructure || "structure",
    reward_profile: answers.rewardProfile || "balanced",
    
    // Alert settings
    alert_style: alertDelivery.join(", "),
    alert_frequency: frequencyMap[answers.tradingPace as string] || "Medium",
    
    // Full wizard answers for reference
    wizard_answers: answers,
  }
}
