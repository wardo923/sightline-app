"use client"

import { useState, useEffect } from "react"
import { Activity } from "lucide-react"

// Smart 4-second analyzing transition animation between wizard questions
export function AnalyzingTransition() {
  const [progress, setProgress] = useState(0)
  const insights = [
    "Analyzing market patterns...",
    "Calibrating signal filters...",
    "Optimizing strategy parameters...",
    "Matching trading style...",
  ]
  const [currentInsight, setCurrentInsight] = useState(0)

  useEffect(() => {
    // Progress fills over 4 seconds (2.5% every 100ms = 100% in 4000ms)
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2.5, 100))
    }, 100)

    // Cycle through insights every second
    const insightInterval = setInterval(() => {
      setCurrentInsight(prev => (prev + 1) % insights.length)
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(insightInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-6">
        {/* Circular Progress Ring */}
        <div className="relative h-32 w-32">
          {/* Outer glow pulse */}
          <div className="absolute inset-0 rounded-full bg-[#2bd673]/5 animate-pulse" />
          
          {/* SVG Progress Circle */}
          <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="3"
            />
            {/* Progress arc */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#wizardProgressGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progress) / 100}
              className="transition-all duration-100 ease-out"
            />
            {/* Gradient */}
            <defs>
              <linearGradient id="wizardProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2bd673" />
                <stop offset="50%" stopColor="#1ed760" />
                <stop offset="100%" stopColor="#1a9f4f" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center icon with pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-16 w-16 rounded-full bg-[#2bd673]/10 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0f0f0f] border border-[#2bd673]/30">
                <Activity className="h-7 w-7 text-[#2bd673]" />
              </div>
            </div>
          </div>

          {/* Orbiting dot */}
          <div 
            className="absolute h-2.5 w-2.5 rounded-full bg-[#2bd673]"
            style={{
              top: "50%",
              left: "50%",
              marginTop: "-5px",
              marginLeft: "-5px",
              boxShadow: "0 0 12px 3px rgba(43, 214, 115, 0.6)",
              animation: "wizardOrbit 2s linear infinite",
              transformOrigin: "center center",
            }}
          />
        </div>

        {/* Text content */}
        <div className="text-center space-y-3">
          <p 
            key={currentInsight}
            className="text-sm font-medium text-white/90 animate-fade-in"
          >
            {insights[currentInsight]}
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-24 rounded-full bg-[#1a1a1a] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2bd673] to-[#1a9f4f] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-[#666] font-mono w-8">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Decorative scanning line */}
        <div className="w-64 h-px relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2bd673]/60 to-transparent"
            style={{ animation: "wizardScan 2s ease-in-out infinite" }}
          />
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes wizardOrbit {
          from {
            transform: rotate(0deg) translateX(64px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(64px) rotate(-360deg);
          }
        }
        @keyframes wizardScan {
          0%, 100% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            transform: translateX(100%);
            opacity: 1;
          }
        }
        @keyframes animate-fade-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: animate-fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
