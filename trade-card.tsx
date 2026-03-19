"use client";

import * as React from "react";
import type { Trade } from "@/lib/trade-types";
import { ChevronDown, ChevronUp, ExternalLink, Bell } from "lucide-react";

function fmt(n: number) {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function statusLabel(status: Trade["status"]) {
  switch (status) {
    case "WAITING": return "Waiting";
    case "READY": return "Ready";
    case "ACTIVE": return "Active";
    case "INVALIDATED": return "Invalidated";
  }
}

function statusStyle(status: Trade["status"]) {
  switch (status) {
    case "WAITING": return "border-muted-foreground/30 text-muted-foreground bg-muted/50";
    case "READY": return "border-primary/50 text-primary bg-primary/10";
    case "ACTIVE": return "border-chart-2/50 text-chart-2 bg-chart-2/10";
    case "INVALIDATED": return "border-destructive/50 text-destructive bg-destructive/10";
  }
}

function isTooLate(trade: Trade, lastPrice?: number) {
  if (!lastPrice) return false;
  if (trade.direction === "LONG" && trade.tooLateIfAbove != null) return lastPrice > trade.tooLateIfAbove;
  if (trade.direction === "SHORT" && trade.tooLateIfBelow != null) return lastPrice < trade.tooLateIfBelow;
  return false;
}

export function TradeCard({
  trade,
  lastPrice,
  onOpen,
}: {
  trade: Trade;
  lastPrice?: number;
  onOpen: (t: Trade) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const tooLate = isTooLate(trade, lastPrice);

  return (
    <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all card-glow">
      <button
        onClick={() => onOpen(trade)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-foreground">{trade.symbol}</span>
              <span className="text-xs rounded-full px-2 py-0.5 border border-border text-muted-foreground">
                {trade.timeframe}
              </span>
              <span className="text-xs rounded-full px-2 py-0.5 border border-border text-muted-foreground">
                {trade.market ?? "Market"}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-medium rounded-full px-2 py-0.5 border ${
                  trade.direction === "LONG"
                    ? "border-primary/50 text-primary bg-primary/10"
                    : "border-destructive/50 text-destructive bg-destructive/10"
                }`}
              >
                {trade.direction}
              </span>

              <span className={`text-xs font-medium rounded-full px-2 py-0.5 border ${statusStyle(trade.status)}`}>
                {statusLabel(trade.status)}
              </span>

              {trade.confidence && (
                <span className="text-xs rounded-full px-2 py-0.5 border border-border text-muted-foreground">
                  {trade.confidence}
                </span>
              )}

              {tooLate && (
                <span className="text-xs rounded-full px-2 py-0.5 border border-amber-500/50 text-amber-500 bg-amber-500/10">
                  Too late?
                </span>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {new Date(trade.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-surface p-2.5 border border-border/50">
            <div className="text-xs text-muted-foreground">Entry</div>
            <div className="font-medium text-foreground">{fmt(trade.entry)}</div>
          </div>
          <div className="rounded-lg bg-surface p-2.5 border border-border/50">
            <div className="text-xs text-muted-foreground">Stop</div>
            <div className="font-medium text-destructive">{fmt(trade.stop)}</div>
          </div>
          <div className="rounded-lg bg-surface p-2.5 border border-border/50">
            <div className="text-xs text-muted-foreground">TP1</div>
            <div className="font-medium text-primary">{trade.tp1 != null ? fmt(trade.tp1) : "—"}</div>
          </div>
          <div className="rounded-lg bg-surface p-2.5 border border-border/50">
            <div className="text-xs text-muted-foreground">TP2</div>
            <div className="font-medium text-primary">{trade.tp2 != null ? fmt(trade.tp2) : "—"}</div>
          </div>
        </div>
      </button>

      <div className="mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Why this trade?
        </button>
        
        {expanded && (
          <ul className="mt-2 space-y-1.5 text-sm">
            {trade.reasons.slice(0, 6).map((r, idx) => (
              <li key={idx} className="leading-snug">
                <span className="text-primary">•</span>{" "}
                <span className="font-medium text-foreground">{r.label}</span>
                {r.detail ? <span className="text-muted-foreground"> — {r.detail}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(trade);
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-secondary-foreground hover:border-primary/30 hover:text-primary transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Chart
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-secondary-foreground hover:border-primary/30 hover:text-primary transition-colors"
        >
          <Bell className="h-3.5 w-3.5" />
          Create Alert
        </button>
      </div>
    </div>
  );
}
