"use client";

import type { Trade } from "@/lib/trade-types";
import { useState, useEffect, useRef } from "react";
import { X, ExternalLink, Bell, Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart2 } from "lucide-react";

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

function statusIcon(status: Trade["status"]) {
  switch (status) {
    case "WAITING": return <AlertTriangle className="h-4 w-4" />;
    case "READY": return <CheckCircle className="h-4 w-4" />;
    case "ACTIVE": return <TrendingUp className="h-4 w-4" />;
    case "INVALIDATED": return <X className="h-4 w-4" />;
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

export function TradeDetailDrawer({
  trade,
  onClose,
}: {
  trade: Trade;
  onClose: () => void;
}) {
  const [showChart, setShowChart] = useState(false);
  const riskPerShare = Math.abs(trade.entry - trade.stop);
  const tp1R = trade.tp1 ? ((trade.tp1 - trade.entry) / riskPerShare).toFixed(2) : null;
  const tp2R = trade.tp2 ? ((trade.tp2 - trade.entry) / riskPerShare).toFixed(2) : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-end"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-xl overflow-y-auto bg-card border-l border-border shadow-xl animate-in slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {trade.direction === "LONG" ? (
                <TrendingUp className="h-5 w-5 text-primary" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
              <span className="text-xl font-semibold text-foreground">{trade.symbol}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {trade.timeframe} • {trade.market}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Status and Direction */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1 border ${
                trade.direction === "LONG"
                  ? "border-primary/50 text-primary bg-primary/10"
                  : "border-destructive/50 text-destructive bg-destructive/10"
              }`}
            >
              {trade.direction === "LONG" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {trade.direction}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1 border ${statusStyle(trade.status)}`}>
              {statusIcon(trade.status)}
              {statusLabel(trade.status)}
            </span>
            {trade.confidence && (
              <span className="text-sm rounded-full px-3 py-1 border border-border text-muted-foreground">
                Grade: {trade.confidence}
              </span>
            )}
          </div>

          {/* Price Levels */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="text-xs text-muted-foreground mb-1">Entry</div>
              <div className="text-lg font-semibold text-foreground">{fmt(trade.entry)}</div>
            </div>
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="text-xs text-destructive/70 mb-1">Stop Loss</div>
              <div className="text-lg font-semibold text-destructive">{fmt(trade.stop)}</div>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="text-xs text-primary/70 mb-1">Take Profit 1</div>
              <div className="text-lg font-semibold text-primary">{trade.tp1 != null ? fmt(trade.tp1) : "—"}</div>
              {tp1R && <div className="text-xs text-muted-foreground mt-0.5">{tp1R}R</div>}
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="text-xs text-primary/70 mb-1">Take Profit 2</div>
              <div className="text-lg font-semibold text-primary">{trade.tp2 != null ? fmt(trade.tp2) : "—"}</div>
              {tp2R && <div className="text-xs text-muted-foreground mt-0.5">{tp2R}R</div>}
            </div>
          </div>

          {/* Risk Summary */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Risk Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Risk/Share</div>
                <div className="font-medium text-foreground">${riskPerShare.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">TP1 Target</div>
                <div className="font-medium text-primary">{tp1R ? `${tp1R}R` : "—"}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">TP2 Target</div>
                <div className="font-medium text-primary">{tp2R ? `${tp2R}R` : "—"}</div>
              </div>
            </div>
          </div>

          {/* Setup Conditions Met */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Setup Conditions Met</h3>
            <ul className="space-y-2 text-sm">
              {trade.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <div>
                    <span className="font-medium text-foreground">{r.label}</span>
                    {r.detail && <span className="text-muted-foreground"> — {r.detail}</span>}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground/70">
              These conditions contributed to this setup being detected by the SightLine engine. No trading setup is guaranteed to succeed.
            </p>
          </div>

          {/* Entry Rules */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Entry Rules</h3>
            <ul className="space-y-3 text-sm">
              {trade.entryRules.map((r, i) => (
                <li key={i}>
                  <div className="font-medium text-foreground">{r.title}</div>
                  <div className="text-muted-foreground">{r.description}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Invalidation Rules */}
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <h3 className="text-sm font-semibold text-destructive mb-3">Invalidation Rules</h3>
            <ul className="space-y-3 text-sm">
              {trade.invalidationRules.map((r, i) => (
                <li key={i}>
                  <div className="font-medium text-foreground">{r.title}</div>
                  <div className="text-muted-foreground">{r.description}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button 
              onClick={() => setShowChart(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:border-primary/30 hover:text-primary transition-colors"
            >
              <BarChart2 className="h-4 w-4" />
              View Chart
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:border-primary/30 hover:text-primary transition-colors">
              <Bell className="h-4 w-4" />
              Create Alert
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:border-primary/30 hover:text-primary transition-colors">
              <Download className="h-4 w-4" />
              Export Trade
            </button>
          </div>
        </div>
      </div>

      {/* Chart Modal */}
      {showChart && (
        <ChartModal 
          symbol={trade.symbol} 
          onClose={() => setShowChart(false)} 
        />
      )}
    </div>
  );
}

// TradingView Chart Modal Component
function ChartModal({ symbol, onClose }: { symbol: string; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create the TradingView widget script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol.includes(":") ? symbol : `NASDAQ:${symbol}`,
      interval: "15",
      timezone: "America/New_York",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full max-w-6xl max-h-[90vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <BarChart2 className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold text-foreground">{symbol} Chart</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* TradingView Container */}
        <div className="tradingview-widget-container h-[calc(100%-60px)]" ref={containerRef}>
          <div className="tradingview-widget-container__widget h-full" />
        </div>
      </div>
    </div>
  );
}
