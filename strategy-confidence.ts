import { StrategyBundle } from "@/types/strategy"
import { ScoreMap } from "@/lib/strategy-matrix"

export type RankedStrategy = {
  strategy: StrategyBundle
  score: number
}

export function rankStrategies(scores: ScoreMap): RankedStrategy[] {
  return Object.entries(scores)
    .map(([strategy, score]) => ({
      strategy: strategy as StrategyBundle,
      score,
    }))
    .sort((a, b) => b.score - a.score)
}

export function calculateConfidence(scores: ScoreMap) {
  const ranked = rankStrategies(scores)
  const top = ranked[0]
  const second = ranked[1]

  // Calculate the actual maximum score across all strategies dynamically
  // rather than using a hardcoded ceiling that gets stale as weights change
  const maxActualScore = top.score
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0)

  // Strength: how dominant is the top bundle relative to total points distributed
  // A perfect concentration (all points on one bundle) = 1.0
  const rawStrength = totalScore > 0 ? Math.min(top.score / (totalScore * 0.5), 1) : 0

  // Separation: how far ahead is the top bundle vs second
  // Normalize against a 5-point gap as "clear separation"
  const gap = second ? top.score - second.score : top.score
  const separation = Math.min(gap / 5, 1)

  // Combine strength (60%) and separation (40%)
  const rawConfidence = Math.round((rawStrength * 0.6 + separation * 0.4) * 100)

  // Include secondary match if within 3 points of the top score
  const includeSecondary = second && (top.score - second.score) <= 3

  return {
    confidence: rawConfidence,
    topStrategy: top.strategy,
    topScore: top.score,
    secondStrategy: includeSecondary ? second.strategy : null,
    secondScore: second?.score ?? 0,
    ranked,
  }
}
