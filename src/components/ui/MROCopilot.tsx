'use client'

import { useState } from 'react'
import { Bot, Sparkles, X, Send } from 'lucide-react'

const COPILOT_PROMPTS = [
  'Which aircraft need urgent maintenance before next week?',
  'Explain the degradation driver for tail A-001',
  'What is current fleet availability at Ambala AFB?',
  'Check turbine blade stock levels at Ambala depot',
]

const COPILOT_ANSWERS: Record<string, string> = {
  'Which aircraft need urgent maintenance before next week?':
    'Tail A-001 (Su-30MKI / Rafale config) has remaining useful life RUL = 18 cycles [10–28 conformal bound] on Engine #1 (ENG-SN-0042). Tail A-007 has RUL = 31 cycles. Recommended action: schedule bay entry at Ambala AFB Hangar 2 before Cycle 22 to prevent AOG status.',
  'Explain the degradation driver for tail A-001':
    'SHAP feature attribution identifies sensor_11 (Ps30 High-Pressure Compressor outlet pressure delta) contributing +62% to degradation score, compounded by sensor_4 (T50 low-pressure turbine temperature exceedance). Probability of thermal barrier coating failure: 78.4%.',
  'What is current fleet availability at Ambala AFB?':
    'Ambala Airbase Fleet Status: 72/100 airframes mission ready (72.0% availability). 15 airframes in scheduled maintenance bays, 8 active prognostic alarms under monitoring, and 5 grounded pending depot components. CP-SAT target availability of 75% achievable within 48h with optimized shift allocation.',
  'Check turbine blade stock levels at Ambala depot':
    'Turbine Blade Part #ENG-TB-4412 stock on hand: 6 units (reorder threshold: 4). Weibull failure probability over next 30 days: 84.1%. Automated procurement order #PO-2026-088 recommended to prevent stockout on tail A-001.',
}

export default function MROCopilot() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Greetings Operator. I am the AeroSync MRO Intelligence Assistant. Ask me anything regarding fleet readiness, conformal RUL intervals, or CP-SAT maintenance schedules.',
    },
  ])

  const handleAsk = (question: string) => {
    if (!question.trim()) return
    setHistory((prev) => [
      ...prev,
      { sender: 'user', text: question },
      {
        sender: 'bot',
        text:
          COPILOT_ANSWERS[question] ||
          `Processing operational query across telemetry database... Tail A-001 currently has the highest priority alert with Ps30 degradation. CP-SAT planner suggests assigning Hangar Slot 1 at Ambala AFB.`,
      },
    ])
    setQuery('')
  }

  return (
    <>
      {/* Floating Action Pill */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        className="floating-mro-pill"
        title="Open AeroSync MRO Intelligence Assistant"
      >
        <div className="relative flex items-center justify-center">
          <Bot size={18} className="text-[#1a4d4a]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-xs font-bold text-[#1a4d4a] font-heading">Use AeroSync Copilot</span>
          <span className="text-[10px] text-[#77878f] font-mono uppercase font-semibold">MRO Assistant</span>
        </div>
      </div>

      {/* Floating Drawer */}
      {open && (
        <div className="fixed bottom-24 right-6 w-[440px] max-w-[calc(100vw-32px)] h-[560px] max-h-[calc(100vh-120px)] bg-white border border-[#dce3e6] rounded-2xl shadow-2xl z-[10000] flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 bg-[#081924] text-white flex items-center justify-between border-b border-[#173747]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a4d4a] flex items-center justify-center text-white">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5 font-heading">
                  AeroSync MRO Copilot
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                    ACTIVE
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">IAF Air-Power Decision Engine</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Prompt Pills */}
          <div className="p-3 bg-[#f8fafb] border-b border-[#dce3e6] flex flex-wrap gap-1.5">
            {COPILOT_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleAsk(prompt)}
                className="text-[11px] font-medium bg-white hover:bg-[#e8f4f3] hover:text-[#1a4d4a] hover:border-[#1a4d4a]/40 text-[#4d606a] border border-[#dce3e6] px-2.5 py-1 rounded-full transition-all text-left flex items-center gap-1"
              >
                <Sparkles size={11} className="text-[#1a4d4a] shrink-0" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {history.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#1a4d4a] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={13} />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1a4d4a] text-white rounded-tr-none font-medium'
                      : 'bg-white text-[#173747] border border-[#dce3e6] rounded-tl-none shadow-xs font-sans'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#dce3e6] flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAsk(query)
              }}
              placeholder="Ask Copilot regarding airframe RUL or CP-SAT slots..."
              className="flex-1 bg-[#f8fafb] border border-[#dce3e6] rounded-xl px-3.5 py-2 text-xs text-[#173747] focus:outline-none focus:border-[#1a4d4a] focus:ring-1 focus:ring-[#1a4d4a]"
            />
            <button
              onClick={() => handleAsk(query)}
              className="p-2 rounded-xl bg-[#1a4d4a] text-white hover:bg-[#143e3c] transition-colors shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
