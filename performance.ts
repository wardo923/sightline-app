export function calculateWinRatio(wins: number, losses: number) {
  const totalClosed = wins + losses
  if (totalClosed === 0) return 0
  return Number(((wins / totalClosed) * 100).toFixed(1))
}
