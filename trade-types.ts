export type TradeStatus = "WAITING" | "READY" | "ACTIVE" | "INVALIDATED";
export type TradeDirection = "LONG" | "SHORT";

export type TradeReason = { label: string; detail?: string };
export type TradeRule = { title: string; description: string };

export type Trade = {
  id: string;
  symbol: string;
  market?: "Stocks" | "Crypto";
  timeframe: string;
  direction: TradeDirection;

  entry: number;
  stop: number;
  tp1?: number;
  tp2?: number;

  // Optional: for "Too late?" checks
  entryZoneLow?: number;
  entryZoneHigh?: number;
  tooLateIfAbove?: number; // LONG
  tooLateIfBelow?: number; // SHORT

  status: TradeStatus;
  confidence?: "A+" | "A" | "A-" | "B+" | "B" | "C";

  reasons: TradeReason[];
  entryRules: TradeRule[];
  invalidationRules: TradeRule[];

  updatedAt: string;
};
