"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Lock, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  Crosshair,
  TrendingUp,
  Activity,
  Target,
  Zap,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { 
  WIZARD_STEPS, 
  STRATEGY_STYLE_LABELS, 
  OPPORTUNITY_ESTIMATES,
  DEFAULT_WIZARD_ANSWERS,
  mapToMatrixAnswers,
  generateStrategyData,
  type WizardAnswers,
  type WizardStep,
  type WizardOption,
} from "@/lib/wizard-config"
import { scoreAnswers } from "@/lib/strategy-matrix"
import { calculateConfidence } from "@/lib/strategy-confidence"
import { STRATEGY_INFO } from "@/lib/strategies"

// Component Props
interface MasterStrategyWizardProps {
  mode?: "create" | "edit"
  initialAnswers?: Partial<WizardAnswers>
  strategyId?: string
}

// Header Component
function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2bd673]/10">
            <Crosshair className="h-4 w-4 text-[#2bd673]" />
          </div>
          <span className="text-lg font-bold text-white">SightLine</span>
        </Link>
        <Link
          href="/auth/login"
          className="text-sm text-[#888] hover:text-white transition-colors"
        >
          Sign In
        </Link>
      </div>
    </header>
  )
}

// Progress Bar Component
function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = ((current + 1) / total) * 100
  return (
    <div className="px-4 py-3 border-b border-[#1a1a1a]">
      <div className="flex items-center justify-between text-xs text-[#888] mb-2">
        <span>Step {current + 1} of {total}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#2bd673] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Option Card Component
function OptionCard({
  option,
  selected,
  onSelect,
  multiSelect = false,
}: {
  option: WizardOption
  selected: boolean
  onSelect: () => void
  multiSelect?: boolean
}) {
  const isLocked = option.locked

  return (
    <button
      onClick={() => !isLocked && onSelect()}
      disabled={isLocked}
      className={`relative w-full text-left rounded-xl border p-4 transition-all ${
        isLocked
          ? "border-[#1a1a1a] bg-[#0d0d0d] opacity-60 cursor-not-allowed"
          : selected
          ? "border-[#2bd673] bg-[#2bd673]/10"
          : "border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#333]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{option.label}</span>
            {isLocked && (
              <span className="flex items-center gap-1 rounded bg-[#2bd673]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#2bd673]">
                <Lock className="h-2.5 w-2.5" />
                {option.lockLabel || "Pro"}
              </span>
            )}
          </div>
          {option.description && (
            <p className="mt-1 text-sm text-[#888]">{option.description}</p>
          )}
        </div>
        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          selected && !isLocked
            ? "border-[#2bd673] bg-[#2bd673]"
            : "border-[#333]"
        }`}>
          {selected && !isLocked && <Check className="h-3 w-3 text-black" />}
        </div>
      </div>
    </button>
  )
}

// Live Strategy Panel Component - Uses real strategy matrix
function LiveStrategyPanel({
  answers,
  isExpanded,
  onToggle,
}: {
  answers: WizardAnswers
  isExpanded: boolean
  onToggle: () => void
}) {
  // Calculate real matrix scores and confidence
  const matrixAnswers = mapToMatrixAnswers(answers)
  const scores = scoreAnswers(matrixAnswers)
  const confidenceData = calculateConfidence(scores)
  
  // Use real matrix confidence instead of step completion percentage
  const completedSteps = Object.entries(answers).filter(([key, val]) => {
    if (Array.isArray(val)) return val.length > 0
    return val !== ""
  }).length
  
  // Blend step completion with matrix confidence for live preview
  const stepProgress = Math.min(100, Math.round((completedSteps / 12) * 100))
  const confidence = completedSteps >= 4 
    ? Math.round((stepProgress * 0.3) + (confidenceData.confidence * 0.7))
    : stepProgress
  
  // Get the detected strategy bundle
  const detectedStrategy = completedSteps >= 4 ? STRATEGY_INFO[confidenceData.topStrategy] : null

  const getDisplayValue = (key: string, value: string | string[]): string => {
    if (!value || (Array.isArray(value) && value.length === 0)) return "—"
    if (Array.isArray(value)) return value.join(", ")
    
    // Special mappings for user-friendly display
    if (key === "marketBehavior") return STRATEGY_STYLE_LABELS[value] || value
    if (key === "marketCoverage") {
      const labels: Record<string, string> = { crypto: "Crypto", stocks: "Stocks", commodities: "Commodities", all: "All Markets" }
      return labels[value] || value
    }
    if (key === "tradingPace") {
      const labels: Record<string, string> = { selective: "Selective", balanced: "Balanced", active: "Active" }
      return labels[value] || value
    }
    if (key === "tradeDuration") {
      const labels: Record<string, string> = { fast: "Fast", intraday: "Intraday", swing: "Swing" }
      return labels[value] || value
    }
    if (key === "signalStrictness" || key === "signalFrequency") {
      const labels: Record<string, string> = { 
        conservative: "Conservative", balanced: "Balanced", expanded: "Expanded",
        strongest: "Strongest Only", frequent: "More Frequent"
      }
      return labels[value] || value
    }
    return value
  }

  const opportunityEstimate = answers.tradingPace 
    ? OPPORTUNITY_ESTIMATES[answers.tradingPace as string] || "—"
    : "Complete more steps to see estimate"

  return (
    <div className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#2bd673]" />
          <span className="text-sm font-medium text-white">Strategy Profile</span>
          <span className="rounded bg-[#2bd673]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#2bd673]">
            {confidence}%
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-[#888]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#888]" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Confidence Meter */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#888]">Calibration Confidence</span>
              <span className="text-[#2bd673]">{confidence}%</span>
            </div>
            <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2bd673] to-[#1fa855] transition-all duration-500"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          {/* Profile Summary */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-[#0a0a0a] p-2">
              <p className="text-[#666]">Markets</p>
              <p className="text-white font-medium truncate">{getDisplayValue("marketCoverage", answers.marketCoverage)}</p>
            </div>
            <div className="rounded-lg bg-[#0a0a0a] p-2">
              <p className="text-[#666]">Assets</p>
              <p className="text-white font-medium truncate">
                {Array.isArray(answers.assetFocus) && answers.assetFocus.length > 0 
                  ? `${answers.assetFocus.length} selected` 
                  : "—"}
              </p>
            </div>
            <div className="rounded-lg bg-[#0a0a0a] p-2">
              <p className="text-[#666]">Trading Pace</p>
              <p className="text-white font-medium truncate">{getDisplayValue("tradingPace", answers.tradingPace)}</p>
            </div>
            <div className="rounded-lg bg-[#0a0a0a] p-2">
              <p className="text-[#666]">Strategy Style</p>
              <p className="text-white font-medium truncate">{getDisplayValue("marketBehavior", answers.marketBehavior)}</p>
            </div>
            <div className="rounded-lg bg-[#0a0a0a] p-2">
              <p className="text-[#666]">Trade Duration</p>
              <p className="text-white font-medium truncate">{getDisplayValue("tradeDuration", answers.tradeDuration)}</p>
            </div>
            <div className="rounded-lg bg-[#0a0a0a] p-2">
              <p className="text-[#666]">Signal Selectivity</p>
              <p className="text-white font-medium truncate">{getDisplayValue("signalStrictness", answers.signalStrictness)}</p>
            </div>
          </div>

          {/* Detected Strategy Bundle - Real Matrix Output */}
          {detectedStrategy && (
            <div className="rounded-lg bg-[#2bd673]/10 border border-[#2bd673]/30 p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-[#2bd673]" />
                <span className="text-xs text-[#2bd673] font-semibold">Detected Strategy Match</span>
              </div>
              <p className="text-sm text-white font-medium">{detectedStrategy.shortName}</p>
              <p className="text-[10px] text-[#888] mt-1">{detectedStrategy.description}</p>
              {confidenceData.secondStrategy && (
                <p className="text-[10px] text-[#666] mt-1">
                  Secondary: {STRATEGY_INFO[confidenceData.secondStrategy]?.shortName}
                </p>
              )}
            </div>
          )}

          {/* Opportunity Estimate */}
          <div className="rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3.5 w-3.5 text-[#888]" />
              <span className="text-xs text-[#888] font-medium">Estimated Opportunity Range</span>
            </div>
            <p className="text-xs text-white">{opportunityEstimate}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Summary Screen Component - Shows real matrix results
function SummaryScreen({
  answers,
  onActivate,
  onEdit,
  isActivating,
}: {
  answers: WizardAnswers
  onActivate: () => void
  onEdit: () => void
  isActivating: boolean
}) {
  // Calculate real matrix scores for summary display
  const matrixAnswers = mapToMatrixAnswers(answers)
  const scores = scoreAnswers(matrixAnswers)
  const confidenceData = calculateConfidence(scores)
  const strategyInfo = STRATEGY_INFO[confidenceData.topStrategy]
  const secondaryInfo = confidenceData.secondStrategy 
    ? STRATEGY_INFO[confidenceData.secondStrategy] 
    : null

  const getDisplayValue = (key: string, value: string | string[]): string => {
    if (!value || (Array.isArray(value) && value.length === 0)) return "—"
    if (Array.isArray(value)) return value.join(", ")
    
    if (key === "marketBehavior") return STRATEGY_STYLE_LABELS[value] || value
    const labels: Record<string, Record<string, string>> = {
      marketCoverage: { crypto: "Crypto", stocks: "Stocks", commodities: "Commodities", all: "All Markets" },
      tradingPace: { selective: "Selective", balanced: "Balanced", active: "Active" },
      tradeDuration: { fast: "Fast", intraday: "Intraday", swing: "Swing" },
      signalStrictness: { conservative: "Conservative", balanced: "Balanced", expanded: "Expanded" },
      trendConfirmation: { yes: "Required", no: "Not Required" },
      retestPreference: { yes: "Required", no: "Not Required" },
      stopStructure: { volatility: "Volatility Based", structure: "Structure Based" },
      rewardProfile: { lower: "Lower Target", balanced: "Balanced Target", extended: "Extended Target" },
      signalFrequency: { strongest: "Strongest Only", balanced: "Balanced", frequent: "More Frequent" },
      sessionTiming: { market_open: "Market Open", full_session: "Full Session", market_close: "Market Close", any: "Any Time" },
      htfAlignmentRequired: { required: "Required", preferred: "Preferred", not_required: "Not Required" },
      volumeConfirmation: { required: "Required", preferred: "Preferred", not_required: "Structure Only" },
    }
    return labels[key]?.[value] || value
  }

  const summaryItems = [
    { label: "Markets", key: "marketCoverage" },
    { label: "Assets Selected", key: "assetFocus" },
    { label: "Trading Pace", key: "tradingPace" },
    { label: "Strategy Style", key: "marketBehavior" },
    { label: "Trade Duration", key: "tradeDuration" },
    { label: "Signal Selectivity", key: "signalStrictness" },
    { label: "Trend Confirmation", key: "trendConfirmation" },
    { label: "Price Confirmation", key: "retestPreference" },
    { label: "Protection Levels", key: "stopStructure" },
    { label: "Reward Profile", key: "rewardProfile" },
    { label: "Signal Frequency", key: "signalFrequency" },
    { label: "Session Timing", key: "sessionTiming" },
    { label: "HTF Alignment", key: "htfAlignmentRequired" },
    { label: "Volume Confirmation", key: "volumeConfirmation" },
    { label: "Alert Delivery", key: "alertDelivery" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      <Header />
      <main className="flex-1 px-4 py-8 pb-safe">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Title */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2bd673]/10">
              <Check className="h-8 w-8 text-[#2bd673]" />
            </div>
            <h1 className="text-2xl font-semibold text-white">
              Your Strategy Profile Is Ready
            </h1>
            <p className="mt-2 text-sm text-[#888]">
              SightLine has calibrated a monitoring profile based on your selections.
            </p>
          </div>

          {/* Strategy Bundle Card - Real Matrix Output */}
          <div className="rounded-xl border border-[#2bd673]/30 bg-gradient-to-br from-[#2bd673]/10 to-transparent p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-[#2bd673]" />
              <span className="text-xs font-semibold text-[#2bd673] uppercase tracking-wider">Strategy Match</span>
              <span className="ml-auto rounded bg-[#2bd673]/20 px-2 py-0.5 text-xs font-semibold text-[#2bd673]">
                {confidenceData.confidence}% Confidence
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white">{strategyInfo?.name || "Strategy Profile"}</h2>
            <p className="text-sm text-[#888] mt-1">{strategyInfo?.description}</p>
            {secondaryInfo && (
              <div className="mt-3 pt-3 border-t border-[#2bd673]/20">
                <p className="text-xs text-[#888]">
                  <span className="text-[#2bd673]">Secondary Match:</span> {secondaryInfo.shortName}
                </p>
              </div>
            )}
            {strategyInfo?.bestFor && (
              <div className="mt-3 flex flex-wrap gap-1">
                {strategyInfo.bestFor.slice(0, 4).map((asset) => (
                  <span key={asset} className="rounded bg-[#1a1a1a] px-2 py-0.5 text-[10px] text-[#888]">
                    {asset}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="space-y-2">
            {summaryItems.map(({ label, key }) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] p-3"
              >
                <span className="text-sm text-[#888]">{label}</span>
                <span className="text-sm font-medium text-white">
                  {getDisplayValue(key, answers[key as keyof WizardAnswers])}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={onActivate}
              disabled={isActivating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2bd673] py-3.5 text-sm font-semibold text-black transition-colors hover:bg-[#24b862] disabled:opacity-50"
            >
              {isActivating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Deploy Strategy
                </>
              )}
            </button>
            <button
              onClick={onEdit}
              disabled={isActivating}
              className="w-full rounded-xl border border-[#333] py-3 text-sm font-medium text-white transition-colors hover:border-[#555]"
            >
              Edit Answers
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

// Success Screen Component  
function SuccessScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if we're in mobile app context
      const isMobileApp = window.location.pathname.startsWith("/m")
      router.replace(isMobileApp ? "/m/dashboard" : "/dashboard")
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white px-4">
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2bd673]/10">
          <Check className="h-10 w-10 text-[#2bd673]" />
        </div>
        <h1 className="text-2xl font-semibold">Strategy Profile Created</h1>
        <p className="text-sm text-[#888] max-w-sm">
          Your strategy profile is now deployed. SightLine will monitor markets based on your preferences.
        </p>
        <div className="pt-4">
          <Loader2 className="h-5 w-5 animate-spin text-[#2bd673] mx-auto" />
          <p className="text-xs text-[#666] mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    </div>
  )
}

// MAIN MASTER WIZARD COMPONENT
export function MasterStrategyWizard({ 
  mode = "create", 
  initialAnswers,
  strategyId,
}: MasterStrategyWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<WizardAnswers>({
    ...DEFAULT_WIZARD_ANSWERS,
    ...initialAnswers,
  })
  const [stage, setStage] = useState<"questions" | "summary" | "success">("questions")
  const [panelExpanded, setPanelExpanded] = useState(false)
  const [isActivating, setIsActivating] = useState(false)

  const step = WIZARD_STEPS[currentStep]
  const isLastStep = currentStep === WIZARD_STEPS.length - 1

  // Get current answer
  const currentAnswer = answers[step.id as keyof WizardAnswers]

  // Check if step is complete
  const isStepComplete = useCallback(() => {
    const answer = answers[step.id as keyof WizardAnswers]
    if (step.type === "multi-select") {
      return Array.isArray(answer) && answer.length >= (step.minSelections || 1)
    }
    return answer !== ""
  }, [answers, step])

  // Handle single select
  const handleSingleSelect = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: optionId }))
  }

  // Handle multi select
  const handleMultiSelect = (optionId: string) => {
    setAnswers(prev => {
      const current = prev[step.id as keyof WizardAnswers]
      const currentArray = Array.isArray(current) ? current : []
      const newArray = currentArray.includes(optionId)
        ? currentArray.filter(id => id !== optionId)
        : [...currentArray, optionId]
      return { ...prev, [step.id]: newArray }
    })
  }

  // Navigate steps
  const handleNext = () => {
    if (isLastStep) {
      setStage("summary")
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleEditFromSummary = () => {
    setStage("questions")
    setCurrentStep(0)
  }

  // Deploy Strategy - Uses real strategy matrix and mapping engine
  const handleActivate = async () => {
    setIsActivating(true)

    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      console.log("[v0] Deploy Strategy - Auth check:", { user: user?.id, authError })

      if (!user) {
        // Store answers in sessionStorage and redirect to sign-up
        sessionStorage.setItem("wizard_answers", JSON.stringify(answers))
        sessionStorage.setItem("wizard_mode", mode)
        if (strategyId) sessionStorage.setItem("wizard_strategy_id", strategyId)
        // Track if from mobile context for post-signup redirect
        if (window.location.pathname.startsWith("/m")) {
          sessionStorage.setItem("wizard_from_mobile", "true")
        }
        router.push("/auth/sign-up?redirect=/strategy-wizard/complete")
        return
      }

      // ==================================================================
      // STRATEGY MATRIX INTEGRATION
      // Convert user-facing wizard answers to matrix format and score
      // ==================================================================
      const matrixAnswers = mapToMatrixAnswers(answers)
      const scores = scoreAnswers(matrixAnswers)
      const confidenceData = calculateConfidence(scores)
      
      console.log("[v0] Matrix results:", { 
        topStrategy: confidenceData.topStrategy, 
        confidence: confidenceData.confidence,
        secondStrategy: confidenceData.secondStrategy 
      })
      
      // Get strategy info for naming
      const strategyInfo = STRATEGY_INFO[confidenceData.topStrategy]
      const assetFocus = Array.isArray(answers.assetFocus) ? answers.assetFocus : []

      // Fix #7: Resolve basket selections to a real primary ticker for the signal engine
      const BASKET_TO_PRIMARY_ASSET: Record<string, string> = {
        "crypto-basket": "BTC",
        "index-basket": "SPY",
        "commodities-basket": "GOLD",
      }
      const rawPrimaryAsset = assetFocus[0] || "SPY"
      const primaryAsset = BASKET_TO_PRIMARY_ASSET[rawPrimaryAsset] ?? rawPrimaryAsset

      // Resolve all assets in the focus list (replace baskets with their lead ticker)
      const resolvedAssets = assetFocus.map((a: string) => BASKET_TO_PRIMARY_ASSET[a] ?? a)

      const strategyName = `${primaryAsset} ${strategyInfo?.shortName || "Strategy"}`

      // Fix #8: Derive time_of_day — prefer explicit sessionTiming answer (step 13)
      // Fall back to tradeDuration-based inference if sessionTiming not answered
      const timeOfDayFromDuration: Record<string, string> = {
        fast: "Market Open Focus",
        intraday: "All Day",
        swing: "All Day",
      }
      const sessionTimingMap: Record<string, string> = {
        market_open: "Market Open Focus",
        full_session: "All Day",
        market_close: "Market Close Focus",
        any: "any",
      }
      const timeOfDay = (answers.sessionTiming && sessionTimingMap[answers.sessionTiming as string])
        ?? timeOfDayFromDuration[answers.tradeDuration as string]
        ?? "All Day"

      // Derive confirmation_style using all three confirmation signals
      // (signalStrictness + htfAlignmentRequired + volumeConfirmation)
      // Previously only signalStrictness was used, producing Strict/Moderate/Flexible
      // which didn't match the engine's expected values at all
      const matrixMapped = mapToMatrixAnswers(answers)
      const confirmationStyleDb = matrixMapped.confirmationStyle
        ?? (answers.signalStrictness === "conservative" ? "Multi-confirmation"
          : answers.signalStrictness === "expanded" ? "Structure only"
          : "Structure + volume")

      // Fix: market_type now correctly handles commodities
      const marketTypeDb =
        answers.marketCoverage === "crypto" ? "crypto"
        : answers.marketCoverage === "commodities" ? "commodities"
        : "index_etf"

      // Build payload matching actual database schema
      // Columns: name, markets, trading_style, timeframe, time_of_day, setup_preference,
      // confirmation_style, alert_style, signal_frequency, bundle_name, market_type,
      // asset, secondary_bundle, wizard_answers, confidence_score
      const strategyPayload = {
        user_id: user.id,
        name: strategyName,
        markets: resolvedAssets,
        trading_style: String(answers.tradingPace || "balanced"),
        timeframe: answers.tradeDuration === "fast" ? "5m" : answers.tradeDuration === "swing" ? "1H" : "15m",
        time_of_day: timeOfDay,
        setup_preference: String(answers.marketBehavior || "momentum"),
        confirmation_style: confirmationStyleDb,
        alert_style: Array.isArray(answers.alertDelivery) ? answers.alertDelivery.join(", ") : "dashboard",
        signal_frequency: String(answers.signalFrequency || "balanced"),
        bundle_name: confidenceData.topStrategy,
        market_type: marketTypeDb,
        asset: primaryAsset,
        secondary_bundle: confidenceData.secondStrategy || null,
        confidence_score: confidenceData.confidence,
        wizard_answers: {
          ...answers,
          _matrixBundle: confidenceData.topStrategy,
          _matrixSecondary: confidenceData.secondStrategy,
          _matrixConfidence: confidenceData.confidence,
          _matrixScores: scores,
        },
        updated_at: new Date().toISOString(),
      }

      console.log("[v0] Strategy payload:", strategyPayload)

      // User is logged in - save strategy with real matrix data
      if (mode === "edit" && strategyId) {
        console.log("[v0] Updating existing strategy:", strategyId)
        const { error: updateError } = await supabase
          .from("strategies")
          .update(strategyPayload)
          .eq("id", strategyId)
          .eq("user_id", user.id)

        if (updateError) {
          console.error("[v0] Strategy update error:", updateError)
          throw updateError
        }
        console.log("[v0] Strategy updated successfully")
      } else {
        console.log("[v0] Inserting new strategy")
        const { data: insertData, error: insertError } = await supabase
          .from("strategies")
          .insert(strategyPayload)
          .select()
          .single()

        if (insertError) {
          console.error("[v0] Strategy insert error:", insertError)
          throw insertError
        }
        console.log("[v0] Strategy inserted successfully:", insertData?.id)
      }

      // Update profile wizard_completed = true
      console.log("[v0] Updating profile wizard_completed for user:", user.id)
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          wizard_completed: true,
          updated_at: new Date().toISOString(),
        })

      if (profileError) {
        console.error("[v0] Profile update error:", profileError)
        throw profileError
      }
      console.log("[v0] Profile updated successfully")

      // Verify wizard_completed is set
      const { data: updatedProfile, error: verifyError } = await supabase
        .from("profiles")
        .select("wizard_completed")
        .eq("id", user.id)
        .single()

      console.log("[v0] Profile verification:", { updatedProfile, verifyError })

      if (!updatedProfile?.wizard_completed) {
        throw new Error("Failed to complete wizard - verification failed")
      }

      console.log("[v0] Deployment complete, showing success screen")
      // Show success screen
      setStage("success")
    } catch (error) {
      const err = error as Error & { message?: string; code?: string; details?: string }
      console.error("[v0] Activation failed:", {
        message: err.message,
        code: err.code,
        details: err.details,
        full: error
      })
      alert(`Failed to activate strategy: ${err.message || "Unknown error"}`)
      setIsActivating(false)
    }
  }

  // Render based on stage
  if (stage === "success") {
    return <SuccessScreen />
  }

  if (stage === "summary") {
    return (
      <SummaryScreen
        answers={answers}
        onActivate={handleActivate}
        onEdit={handleEditFromSummary}
        isActivating={isActivating}
      />
    )
  }

  // Questions Stage
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      <Header />
      <ProgressBar current={currentStep} total={WIZARD_STEPS.length} />
      
      {/* Mobile Strategy Panel */}
      <div className="lg:hidden">
        <LiveStrategyPanel
          answers={answers}
          isExpanded={panelExpanded}
          onToggle={() => setPanelExpanded(!panelExpanded)}
        />
      </div>

      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 px-4 py-6 pb-32 lg:pb-6">
          <div className="max-w-lg mx-auto space-y-6">
            {/* Question Header */}
            <div>
              <h1 className="text-xl font-semibold text-white">{step.title}</h1>
              <p className="mt-2 text-sm text-[#888]">{step.subtitle}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {step.groups ? (
                // Grouped options
                step.groups.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs text-[#666] uppercase tracking-wider mb-2">{group.label}</p>
                    <div className="space-y-2">
                      {step.options
                        .filter(opt => group.optionIds.includes(opt.id))
                        .map((option) => (
                          <OptionCard
                            key={option.id}
                            option={option}
                            selected={
                              step.type === "multi-select"
                                ? (Array.isArray(currentAnswer) && currentAnswer.includes(option.id))
                                : currentAnswer === option.id
                            }
                            onSelect={() => 
                              step.type === "multi-select" 
                                ? handleMultiSelect(option.id) 
                                : handleSingleSelect(option.id)
                            }
                            multiSelect={step.type === "multi-select"}
                          />
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                // Ungrouped options
                step.options.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={
                      step.type === "multi-select"
                        ? (Array.isArray(currentAnswer) && currentAnswer.includes(option.id))
                        : currentAnswer === option.id
                    }
                    onSelect={() => 
                      step.type === "multi-select" 
                        ? handleMultiSelect(option.id) 
                        : handleSingleSelect(option.id)
                    }
                    multiSelect={step.type === "multi-select"}
                  />
                ))
              )}

              {/* Custom Input (Pro Feature) */}
              {step.customInput && (
                <div className="mt-4 rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] p-4 opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-white">{step.customInput.label}</span>
                    <span className="flex items-center gap-1 rounded bg-[#2bd673]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#2bd673]">
                      <Lock className="h-2.5 w-2.5" />
                      Pro
                    </span>
                  </div>
                  <p className="text-xs text-[#666]">Upgrade to Pro to add custom tickers</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Desktop Strategy Panel */}
        <aside className="hidden lg:block w-80 border-l border-[#1a1a1a] bg-[#0d0d0d] p-6">
          <div className="sticky top-20 space-y-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#2bd673]" />
              <span className="font-medium text-white">Strategy Profile Calibration</span>
            </div>

            {/* Confidence Meter */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#888]">Calibration Progress</span>
                <span className="text-[#2bd673] font-medium">
                  {Math.round(((currentStep + 1) / WIZARD_STEPS.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#2bd673] to-[#1fa855] transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Profile Summary */}
            <div className="space-y-3">
              {[
                { label: "Markets", key: "marketCoverage" },
                { label: "Assets", key: "assetFocus" },
                { label: "Trading Pace", key: "tradingPace" },
                { label: "Strategy Style", key: "marketBehavior" },
                { label: "Trade Duration", key: "tradeDuration" },
                { label: "Signal Selectivity", key: "signalStrictness" },
              ].map(({ label, key }) => {
                const value = answers[key as keyof WizardAnswers]
                const displayValue = !value || (Array.isArray(value) && value.length === 0)
                  ? "—"
                  : Array.isArray(value)
                  ? `${value.length} selected`
                  : key === "marketBehavior"
                  ? STRATEGY_STYLE_LABELS[value] || value
                  : value

                return (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-[#666]">{label}</span>
                    <span className="text-white font-medium">{displayValue}</span>
                  </div>
                )
              })}
            </div>

            {/* Opportunity Estimate */}
            {answers.tradingPace && (
              <div className="rounded-lg bg-[#2bd673]/5 border border-[#2bd673]/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-[#2bd673]" />
                  <span className="text-sm text-[#2bd673] font-medium">Estimated Opportunities</span>
                </div>
                <p className="text-sm text-[#888]">
                  {OPPORTUNITY_ESTIMATES[answers.tradingPace as string] || "—"}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm p-4 pb-safe lg:static lg:border-t-0 lg:bg-transparent lg:p-0">
        <div className="max-w-lg mx-auto flex items-center gap-3 lg:px-4 lg:py-6">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#333] text-white transition-colors hover:border-[#555]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2bd673] py-3 text-sm font-semibold text-black transition-colors hover:bg-[#24b862] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastStep ? "Review Strategy" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
