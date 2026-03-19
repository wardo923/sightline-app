// ============================================================================
// DEPRECATED — DO NOT EDIT
// This file is the OLD wizard question system (10 questions).
// The ACTIVE wizard is defined in: lib/wizard-config.ts (12 questions)
// The ACTIVE component is: components/master-strategy-wizard.tsx
//
// generateStrategyProfile() in strategy-mapping.ts is orphaned — it is NOT
// called by the active wizard flow. All active mapping goes through:
//   mapToMatrixAnswers() → scoreAnswers() → calculateConfidence()
//
// This file is retained only for reference. Do not add new logic here.
// ============================================================================

// SightLine Proprietary Strategy Wizard Questions
// Maps user answers to Strategy Profile for Signal Engine

export type WizardQuestion = {
  id: string
  title: string
  question: string
  description?: string
  options: {
    value: string
    label: string
    description?: string
  }[]
  multiSelect?: boolean
  type?: "selection" | "confirmation"
  confirmationText?: string
  body?: string
}

// Core setups used by SightLine Signal Engine
export const SIGHTLINE_SETUPS = [
  "Breakout Structure",
  "Pullback Into Support",
  "Range Compression",
  "Support Resistance Reaction",
  "Trend Continuation",
  "Liquidity Sweep Reversal",
] as const

export type SightlineSetup = (typeof SIGHTLINE_SETUPS)[number]

export const WIZARD_QUESTIONS: WizardQuestion[] = [
  // STEP 1: Select Market
  {
    id: "market",
    title: "Select Market",
    question: "What market would you like SightLine to monitor?",
    description: "SightLine supports monitoring across major equity and crypto markets.",
    options: [
      { value: "Stocks", label: "Stocks" },
      { value: "Crypto", label: "Crypto" },
    ],
  },

  // STEP 2: Select Asset (options populated dynamically)
  {
    id: "asset",
    title: "Select Asset",
    question: "Which asset should SightLine prioritize?",
    description: "SightLine will prioritize this asset when generating your strategy profile.",
    options: [],
  },

  // STEP 3: Trading Pace
  {
    id: "tradingPace",
    title: "Trading Pace",
    question: "What best describes your trading pace?",
    description: "Your selection helps determine which timeframes and setups are prioritized.",
    options: [
      { value: "Fast Intraday", label: "Fast Intraday", description: "Quick entries on lower timeframes" },
      { value: "Balanced Intraday", label: "Balanced Intraday", description: "Mix of quick and patient setups" },
      { value: "Swing Monitoring", label: "Swing Monitoring", description: "Longer holds on higher timeframes" },
    ],
  },

  // STEP 4: Market Behavior Preference
  {
    id: "behaviorPreference",
    title: "Market Behavior Preference",
    question: "What type of market opportunities do you prefer?",
    description: "SightLine focuses on a small set of structured market behaviors and highlights them when conditions align.",
    options: [
      { value: "Breakouts", label: "Breakouts", description: "Price breaking through key levels" },
      { value: "Pullbacks", label: "Pullbacks", description: "Retracements into support zones" },
      { value: "Range Structure", label: "Range Structure", description: "Compression and range-bound setups" },
      { value: "Trend Continuation", label: "Trend Continuation", description: "Established trends resuming direction" },
    ],
  },

  // STEP 5: Setup Selectivity
  {
    id: "alertSelectivity",
    title: "Setup Selectivity",
    question: "How selective should SightLine be when identifying setups?",
    description: "Select how strict the engine should be when qualifying potential trade setups.",
    options: [
      { value: "High Selectivity", label: "High Selectivity", description: "Fewer alerts, stronger conditions" },
      { value: "Balanced", label: "Balanced", description: "Moderate alert frequency and setup coverage" },
      { value: "Expanded Coverage", label: "Expanded Coverage", description: "More opportunities with broader setup detection" },
    ],
  },

  // STEP 6: Monitoring Schedule (options populated dynamically)
  {
    id: "monitoringSchedule",
    title: "Monitoring Schedule",
    question: "When should SightLine monitor for setups?",
    description: "Monitoring schedule controls when the engine prioritizes setup detection.",
    options: [],
  },

  // STEP 7: Notification Preferences
  {
    id: "notificationPreferences",
    title: "Notification Preferences",
    question: "How would you like to receive alerts?",
    description: "Select all that apply.",
    multiSelect: true,
    options: [
      { value: "Dashboard Alerts", label: "Dashboard Alerts", description: "View alerts in your dashboard" },
      { value: "Email Alerts", label: "Email Alerts", description: "Receive alerts via email" },
      { value: "Telegram Alerts", label: "Telegram Alerts", description: "Get alerts on Telegram" },
    ],
  },

  // STEP 8: Daily Market Brief (expanded with market selection)
  {
    id: "dailyMarketBrief",
    title: "Daily Market Brief",
    question: "Would you like personalized market context updates?",
    description: "SightLine can generate a daily market brief that provides structured context for the markets you choose to monitor. This brief highlights key levels, market conditions, and potential setup environments aligned with your strategy profile.",
    type: "expandable",
    options: [
      { value: "Yes", label: "Yes, include Daily Market Brief" },
      { value: "No", label: "No, signals only" },
    ],
  } as WizardQuestion & { type: "expandable" },

  // STEP 9: Risk Understanding (confirmation)
  {
    id: "riskUnderstanding",
    title: "Understanding Risk and Trade Management",
    question: "",
    type: "confirmation",
    body: "Successful trading strategies are not based on winning every trade.\n\nMany structured strategies operate with win rates below fifty percent by managing risk carefully and allowing profitable trades to develop relative to losses.\n\nA strategy may remain profitable even with a win rate near forty percent when risk is controlled and losses are managed properly.",
    confirmationText: "I understand that trading involves risk and that strategies may include losing trades.",
    options: [],
  },

  // STEP 10: Alert Understanding (confirmation)
  {
    id: "alertUnderstanding",
    title: "Understanding SightLine Alerts",
    question: "",
    type: "confirmation",
    body: "SightLine generates alerts only when market conditions align with your selected strategy settings.\n\nBecause the platform uses strict monitoring criteria, alert frequency may be lower than broader monitoring systems. This is intentional and helps keep alerts more selective and aligned with your strategy.",
    confirmationText: "I understand that alerts are generated only when conditions align with my strategy settings.",
    options: [],
  },
]

// Asset options by market
export const ASSET_OPTIONS: Record<string, { value: string; label: string; description: string }[]> = {
  Stocks: [
    { value: "SPY", label: "SPY", description: "S&P 500 ETF" },
    { value: "QQQ", label: "QQQ", description: "Nasdaq 100 ETF" },
    { value: "NVDA", label: "NVDA", description: "NVIDIA Corporation" },
    { value: "AAPL", label: "AAPL", description: "Apple Inc." },
    { value: "TSLA", label: "TSLA", description: "Tesla Inc." },
  ],
  Crypto: [
    { value: "BTC", label: "BTC", description: "Bitcoin" },
    { value: "ETH", label: "ETH", description: "Ethereum" },
    { value: "SOL", label: "SOL", description: "Solana" },
  ],
}

// Monitoring schedule options by market
export const MONITORING_SCHEDULE_OPTIONS: Record<string, { value: string; label: string; description: string }[]> = {
  Stocks: [
    { value: "Market Open Focus", label: "Market Open Focus", description: "First 90 minutes priority" },
    { value: "All Day Monitoring", label: "All Day Monitoring", description: "Full session coverage" },
    { value: "Market Close Focus", label: "Market Close Focus", description: "Final session window" },
  ],
  Crypto: [
    { value: "All Day Monitoring", label: "All Day Monitoring", description: "Active hours coverage" },
    { value: "24 Hour Monitoring", label: "24 Hour Monitoring", description: "Continuous monitoring" },
  ],
}

// Daily Market Brief market options with pricing
export const BRIEF_MARKET_OPTIONS = [
  { value: "SPY", label: "SPY", description: "S&P 500", price: 3.99 },
  { value: "QQQ", label: "QQQ", description: "Nasdaq 100", price: 3.99 },
  { value: "BTC", label: "BTC", description: "Bitcoin", price: 3.99 },
  { value: "ETH", label: "ETH", description: "Ethereum", price: 3.99 },
  { value: "SOL", label: "SOL", description: "Solana", price: 3.99 },
  { value: "GOLD", label: "GOLD", description: "Gold", price: 3.99 },
  { value: "OIL", label: "OIL", description: "Crude Oil", price: 3.99 },
]

// Recommended markets bundle
export const RECOMMENDED_BRIEF_MARKETS = ["SPY", "BTC", "ETH"]

// Brief delivery method options
export const BRIEF_DELIVERY_OPTIONS = [
  { value: "Dashboard", label: "Dashboard" },
  { value: "Email", label: "Email" },
  { value: "SMS", label: "SMS Text" },
  { value: "Telegram", label: "Telegram" },
]

// Brief type options
export const BRIEF_TYPE_OPTIONS = [
  { value: "Morning", label: "Morning Market Brief" },
  { value: "MorningIntraday", label: "Morning Brief + Intraday Updates" },
]

// Calibration messages for loading step (Step 11)
export const CALIBRATION_MESSAGES = [
  "Analyzing market preferences",
  "Mapping strategy behavior",
  "Calibrating monitoring filters",
  "Preparing alert conditions",
  "Finalizing strategy profile",
]

// Get question with dynamic options based on previous answers
export function getQuestionWithOptions(
  question: WizardQuestion,
  answers: Record<string, string | string[]>
): WizardQuestion {
  if (question.id === "asset") {
    const market = answers.market as string
    return {
      ...question,
      options: ASSET_OPTIONS[market] || ASSET_OPTIONS.Stocks,
    }
  }

  if (question.id === "monitoringSchedule") {
    const market = answers.market as string
    return {
      ...question,
      options: MONITORING_SCHEDULE_OPTIONS[market] || MONITORING_SCHEDULE_OPTIONS.Stocks,
    }
  }

  return question
}
