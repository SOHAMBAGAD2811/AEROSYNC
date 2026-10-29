'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Shield, Plane, Activity, Calendar, Package,
  ArrowRight, CheckCircle2, Lock,
  ChevronRight, Database, AlertTriangle,
  Wrench, Sparkles, SlidersHorizontal,
  X, Send, Bot, XCircle
} from 'lucide-react'

// Background Hero Carousel Slides (Authentic IAF Military Combat Aviation)
const HERO_SLIDES = [
  {
    src: '/images/iaf-rafale-flight.jpg',
    caption: 'Indian Air Force Dassault Rafale (RB 002) Multi-Role Combat Fighter Sortie',
  },
  {
    src: '/images/iaf-su30-garuda.jpg',
    caption: 'IAF Su-30MKI Air Superiority Fighter Telemetry & Readiness Stream',
  },
  {
    src: '/images/iaf-formation-combat.jpg',
    caption: 'IAF Combat Fleet (Su-30MKI, Rafale & LCA Tejas) Integrated Maintenance Grid',
  },
  {
    src: '/images/hero-fighter-afterburner.jpg',
    caption: 'Supersonic Afterburner Combat Sortie Regime Monitoring',
  },
]

// Stakeholder Roles Data
const ROLE_PORTALS = [
  {
    id: 'commander',
    role: 'Air Base Commander',
    dept: 'Operations & Sortie Command',
    desc: 'High-level readiness oversight, 30-day fleet availability trajectories, and critical mission lockout controls.',
    actionText: 'Open Commander Console',
    icon: Shield,
    colorClass: 'bg-red-700',
    username: 'commander',
  },
  {
    id: 'maintenance_officer',
    role: 'Maintenance Engineer Officer',
    dept: 'Engineering & Hangar Operations',
    desc: 'Interactive schedule board, automated CP-SAT optimization, and hangar slot capacity balancing across airbases.',
    actionText: 'Open MEO Dashboard',
    icon: Calendar,
    colorClass: 'bg-[#1a4d4a]',
    username: 'meo',
  },
  {
    id: 'logistics_officer',
    role: 'Logistics & Supply Officer',
    dept: 'Material & Spares Depot',
    desc: 'Weibull failure-rate forecasting, stockout risk horizon, and automated procurement requisitions for critical components.',
    actionText: 'Open Logistics Hub',
    icon: Package,
    colorClass: 'bg-[#b46927]',
    username: 'logistics',
  },
  {
    id: 'technician',
    role: 'Flight-Line Technician',
    dept: 'Squadron Maintenance Bay',
    desc: 'Interactive 3D digital twin inspection, SHAP sensor driver explanation, and NLP-assisted tech snag logging.',
    actionText: 'Open 3D Twin & Deck',
    icon: Wrench,
    colorClass: 'bg-[#2e7d52]',
    username: 'tech01',
  },
  {
    id: 'admin',
    role: 'MRO Systems Administrator',
    dept: 'Data Informatics & Cyber Division',
    desc: 'Data ingestion quality scoring, NASA C-MAPSS model benchmark ladder, and append-only cryptographic audit logs.',
    actionText: 'Open Admin Console',
    icon: Database,
    colorClass: 'bg-[#4b286d]',
    username: 'admin',
  },
]

// 5-Step Pipeline Steps
const PIPELINE_STEPS = [
  {
    n: 1,
    title: 'Sensor Ingestion & Validation',
    desc: '21 NASA C-MAPSS telemetry channels streamed via MQTT and CSV batch. Strict Pandera schema checks validate ranges and detect duplicates.',
    meta: 'Pandera · MQTT · AsyncPG',
    icon: Database,
  },
  {
    n: 2,
    title: 'Conformal Prognostics',
    desc: 'Deep RUL inference models generate calibrated 10%–90% uncertainty intervals. SHAP explainer attributes degradation to specific sensor anomalies.',
    meta: 'PyTorch · LightGBM · SHAP',
    icon: Activity,
  },
  {
    n: 3,
    title: 'CP-SAT Constraint Planner',
    desc: 'Google OR-Tools solver balances hangar bays, certified technician shifts, depot slots, and flight-hours while honoring mission locks.',
    meta: 'Google OR-Tools · CP-SAT',
    icon: Calendar,
  },
  {
    n: 4,
    title: 'Weibull Spares Logistics',
    desc: 'Parametric Weibull hazard models predict part stockouts weeks in advance. Automated requisition triggers prevent aircraft grounding.',
    meta: 'Weibull Models · Reorder Grid',
    icon: Package,
  },
  {
    n: 5,
    title: 'Append-Only Audit Ledger',
    desc: 'Every schedule override, model approval, and snag entry is permanently stamped in an immutable audit ledger for defence compliance.',
    meta: 'Immutable Ledger · Cryptographic Hashes',
    icon: Lock,
  },
]

// Comparison Criteria
const COMPARISON_ROWS = [
  {
    feature: 'Unscheduled Groundings (AOG)',
    sub: 'Proactive Alerting',
    existing: 'Reactive repairs; 30–60 day unexpected hangar downtime',
    flare: '60+ cycle proactive warning with calibrated RUL & SHAP drivers',
  },
  {
    feature: 'Flight-Line Scheduling',
    sub: 'Hangar Allocation',
    existing: 'Manual spreadsheets & whiteboard logs; bay & shift clashes',
    flare: 'CP-SAT solver balancing bays, certified shifts & sortie locks',
  },
  {
    feature: 'Uncertainty Estimation',
    sub: 'Statistical Risk Bounds',
    existing: 'Single point guesses with zero risk bounds; high false alarms',
    flare: '10%–90% conformal bands guaranteeing 80% coverage on test fleet',
  },
  {
    feature: 'Cyber & Air-Gap Security',
    sub: 'Operational Sovereignty',
    existing: 'Cloud-dependent software vulnerable to EW jamming & data egress',
    flare: '100% air-gapped local or private cloud deployment with zero external egress',
  },
  {
    feature: 'Maintenance Snag Records',
    sub: 'Technical Intelligence',
    existing: 'Paper logs & scanned PDFs without historical query or search',
    flare: 'NLP classifier with semantic similarity search across past snags',
  },
  {
    feature: 'Spares Replenishment',
    sub: 'Supply Chain Sync',
    existing: 'Fixed periodic reorders causing turbine blade stockouts & grounded tails',
    flare: 'Weibull hazard rate forecasts synchronized with prognostic alarms',
  },
]

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

export default function Landing() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [copilotQuery, setCopilotQuery] = useState('')
  const [copilotHistory, setCopilotHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Greetings Commander. I am the AeroSync MRO Intelligence Assistant. Ask me anything regarding fleet readiness, conformal RUL predictions, or CP-SAT maintenance schedules.',
    },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handleAskCopilot = (question: string) => {
    setCopilotHistory((prev) => [
      ...prev,
      { sender: 'user', text: question },
      {
        sender: 'bot',
        text:
          COPILOT_ANSWERS[question] ||
          `Processing operational query across telemetry database... Tail A-001 currently has the highest priority alert with Ps30 degradation. CP-SAT planner suggests assigning Hangar Slot 1 at Ambala AFB.`,
      },
    ])
    setCopilotQuery('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafb] text-[#173747] font-sans selection:bg-[#1a4d4a] selection:text-white relative">
      {/* ── Main Navigation Header ───────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#dce3e6] shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f3535] to-[#1a4d4a] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Plane size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-[#173747] text-lg tracking-tight">AeroSync</span>
                <span className="text-[10px] font-bold text-[#1a4d4a] bg-[#e8f4f3] border border-[#c5e3e0] px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                  PS 26249
                </span>
              </div>
              <p className="text-[#77878f] text-[11px] font-medium leading-none">
                Fleet Availability &amp; Readiness Engine
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4d606a]">
            <a href="#about" className="hover:text-[#1a4d4a] transition-colors">The Mandate</a>
            <a href="#features" className="hover:text-[#1a4d4a] transition-colors">Comparison</a>
            <a href="#stakeholders" className="hover:text-[#1a4d4a] transition-colors">Role Portals</a>
            <a href="#architecture" className="hover:text-[#1a4d4a] transition-colors">5-Step Pipeline</a>
            <a href="#formulation" className="hover:text-[#1a4d4a] transition-colors">Formulation Math</a>
            <Link href="/twin" className="hover:text-[#1a4d4a] transition-colors flex items-center gap-1 font-semibold text-[#1a4d4a]">
              <span>3D Digital Twin</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#4d606a] hover:text-[#173747] px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors hidden sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-primary text-sm shadow-sm"
            >
              <span>Launch Terminal</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── High-Impact Hero with Authentic Image Carousel ───────── */}
      <section className="landing-hero">
        <div className="hero-bg-carousel" aria-hidden="true">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.src}
              className={`hero-bg-slide ${idx === slideIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.src})` }}
            />
          ))}
          <div className="hero-bg-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge badge-accent">IAF MRO · AeroSync</span>
              <span className="kicker-tag text-[#c9d8e0]">Air Power Combat Readiness System</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.14] font-heading drop-shadow-md">
              Airframe Combat Readiness, <br className="hidden sm:inline" />
              <span className="font-editorial text-emerald-400 font-normal italic">
                Quantified &amp; Guaranteed.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#d1e2ed] max-w-3xl mb-8 font-normal leading-relaxed drop-shadow-sm">
              High-frequency telemetry analysis across 100 combat airframes — built to help IAF commanders,
              maintenance engineers, and logistics officers guarantee squadron availability in real time.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/dashboard"
                className="btn px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-emerald-900/40 transition-all flex items-center gap-2"
              >
                <Plane size={17} />
                <span>Open Operations Console</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/twin"
                className="btn px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/25 backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <Plane size={17} />
                <span>Inspect 3D Jet</span>
              </Link>
              <Link
                href="/login"
                className="btn px-5 py-3.5 bg-transparent hover:bg-white/10 text-slate-300 hover:text-white font-medium text-sm rounded-xl border border-white/15 transition-all flex items-center gap-2"
              >
                <Shield size={16} />
                <span>Select Demo Role</span>
              </Link>
            </div>
          </div>

          {/* 3-Stat Metric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-5">
            <div className="landing-stat-card group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <Plane size={16} className="text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/70 px-2 py-0.5 rounded font-bold">
                  SYNTHETIC
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">100 Tails</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Airframe Registry</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Ambala, Chandigarh &amp; Jodhpur</p>
            </div>

            <div className="landing-stat-card group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <Activity size={16} className="text-teal-400" />
                <span className="text-[10px] font-mono text-teal-400 bg-teal-950/70 border border-teal-800/70 px-2 py-0.5 rounded font-bold">
                  r = 0.942
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">80% Band</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">10%–90% Conformal Target</p>
              <p className="text-[11px] text-slate-400 mt-0.5">NASA C-MAPSS Test Evaluation</p>
            </div>

            <div className="landing-stat-card group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <Calendar size={16} className="text-amber-400" />
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/70 border border-amber-800/70 px-2 py-0.5 rounded font-bold">
                  OR-TOOLS
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">60+ Cyc</p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Predictive Warning Lead</p>
              <p className="text-[11px] text-slate-400 mt-0.5">HPC delta Ps30 trigger</p>
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-slate-300 tracking-wide">
                {HERO_SLIDES[slideIndex]?.caption}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, p) => (
                <button
                  key={p}
                  onClick={() => setSlideIndex(p)}
                  className={`hero-dot ${p === slideIndex ? 'active' : ''}`}
                  aria-label={`Slide ${p + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The Mandate: Why AeroSync? ───────────────────────────── */}
      <section id="about" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#dce3e6]">
          <div className="max-w-2xl">
            <span className="kicker-tag text-[#1a4d4a] block mb-2 font-bold tracking-widest">
              WHAT IS AEROSYNC?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173747] tracking-tight">
              Automated Fleet Readiness &amp; Prognostics
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4d606a] max-w-lg leading-relaxed lg:text-right">
            Ingests high-frequency engine telemetry, computes calibrated conformal RUL intervals,
            and solves multi-base hangar bottlenecks with CP-SAT constraint optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="surface-card p-8 flex flex-col justify-between border-t-3 border-t-[#c53c30]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#c53c30] flex items-center justify-center mb-6">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#173747] mb-3">
                Turbines Degrade Rapidly Under Load
              </h3>
              <p className="text-sm text-[#4d606a] leading-relaxed mb-4">
                Turbofan operating temperatures exceed 1,400°C. HPC pressure drops and blade micro-cracks occur abruptly.
                Fixed periodic calendar inspections miss these rapid shifts, causing unscheduled groundings.
              </p>
            </div>
            <div className="pt-4 border-t border-[#edf2f4] text-xs font-semibold text-[#c53c30]">
              AeroSync: 60+ cycle proactive warning window on NASA C-MAPSS
            </div>
          </div>

          <div className="surface-card p-8 flex flex-col justify-between border-t-3 border-t-[#0f3535]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#e8f4f3] text-[#1a4d4a] flex items-center justify-center mb-6">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#173747] mb-3">
                Bay Allocation is Combinatorially Hard
              </h3>
              <p className="text-sm text-[#4d606a] leading-relaxed mb-4">
                100 aircraft across 3 bases compete for limited hangar bays, certified technician shifts, and parts.
                Manual spreadsheets create depot bottlenecks and violate sortie-critical squadron locks.
              </p>
            </div>
            <div className="pt-4 border-t border-[#edf2f4] text-xs font-semibold text-[#1a4d4a]">
              AeroSync: Google OR-Tools CP-SAT multi-constraint solver
            </div>
          </div>

          <div className="surface-card p-8 flex flex-col justify-between border-t-3 border-t-[#d4af37]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#b46927] flex items-center justify-center mb-6">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#173747] mb-3">
                Uncertainty Must Be Quantified
              </h3>
              <p className="text-sm text-[#4d606a] leading-relaxed mb-4">
                Single-point RUL forecasts provide false confidence. A predicted RUL of 25 cycles might have a true
                failure horizon of 10 cycles. AeroSync provides rigorous 10%–90% conformal prediction bands.
              </p>
            </div>
            <div className="pt-4 border-t border-[#edf2f4] text-xs font-semibold text-[#b46927]">
              AeroSync: Mathematically guaranteed 80% coverage interval
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison Matrix: Traditional vs AeroSync ──────────── */}
      <section id="features" className="py-20 px-6 bg-[#f1f5f7] border-y border-[#dce3e6]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#dce3e6]">
            <div>
              <span className="kicker-tag text-[#1a4d4a] block mb-2 font-bold tracking-widest">
                DEFENCE ARCHITECTURE BENCHMARK
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173747] tracking-tight">
                Traditional MRO vs. AeroSync Platform
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                <XCircle size={14} className="text-red-500" />
                <span>Legacy Airbase Baseline</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e8f4f3] text-[#1a4d4a] border border-[#c5e3e0]">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>AeroSync Automated Platform</span>
              </span>
            </div>
          </div>

          <div className="comp-table-container">
            <div className="overflow-x-auto">
              <table className="comp-table">
                <thead>
                  <tr>
                    <th className="comp-th-feature">Operational Capability</th>
                    <th className="comp-th-legacy">
                      <div className="flex items-center gap-2">
                        <XCircle size={14} className="text-red-400" />
                        <span>Legacy Airbase Baseline</span>
                      </div>
                    </th>
                    <th className="comp-th-flare">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>AeroSync Engine Platform</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.feature} className="hover:bg-slate-50/70 transition-colors">
                      <td className="comp-td-feature">
                        <p className="font-bold text-[#173747] text-sm leading-snug">{row.feature}</p>
                        <span className="text-[10px] font-mono text-[#77878f] font-semibold mt-1 inline-block uppercase tracking-wider">
                          {row.sub}
                        </span>
                      </td>
                      <td className="comp-td-legacy">
                        <div className="flex items-start gap-2.5">
                          <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                          <span className="text-[#4d606a] leading-relaxed">{row.existing}</span>
                        </div>
                      </td>
                      <td className="comp-td-flare">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[#173747] font-medium leading-relaxed">{row.flare}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stakeholder Role Portals ─────────────────────────────── */}
      <section id="stakeholders" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#dce3e6]">
          <div>
            <span className="kicker-tag text-[#1a4d4a] block mb-2 font-bold tracking-widest">
              STAKEHOLDER PORTALS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173747] tracking-tight">
              Built for Every Flight-Line Echelon
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#4d606a] bg-white px-3.5 py-2 rounded-lg border border-[#dce3e6] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>5 Airbase Roles · RBAC Guarded · Zero Cloud Telemetry</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROLE_PORTALS.map((portal) => {
            const Icon = portal.icon
            return (
              <div
                key={portal.id}
                className="surface-card p-7 flex flex-col justify-between hover:border-[#1a4d4a] group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${portal.colorClass}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#77878f] bg-slate-100 px-2 py-1 rounded">
                      ROLE: {portal.username.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#173747] mb-1 group-hover:text-[#1a4d4a] transition-colors">
                    {portal.role}
                  </h3>
                  <p className="text-xs font-semibold text-[#77878f] uppercase tracking-wider mb-3">
                    {portal.dept}
                  </p>
                  <p className="text-sm text-[#4d606a] leading-relaxed mb-6">
                    {portal.desc}
                  </p>
                </div>

                <Link
                  href="/login"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#f1f5f7] hover:bg-[#1a4d4a] text-[#173747] hover:text-white font-semibold text-xs transition-all flex items-center justify-between"
                >
                  <span>{portal.actionText}</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            )
          })}

          <div className="surface-card p-7 flex flex-col justify-between hover:border-[#1a4d4a] group transition-all">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm bg-slate-700">
                  <SlidersHorizontal size={22} />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#77878f] bg-slate-100 px-2 py-1 rounded">
                  DEMO ACCESS
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#173747] mb-1 group-hover:text-[#1a4d4a] transition-colors">
                All-Role Quick Switcher
              </h3>
              <p className="text-xs font-semibold text-[#77878f] uppercase tracking-wider mb-3">
                Flight-Line Test Harness
              </p>
              <p className="text-sm text-[#4d606a] leading-relaxed mb-6">
                Explore all 5 operational views with one-click credential bypass in air-gapped demo mode.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full py-2.5 px-4 rounded-lg bg-[#f1f5f7] hover:bg-[#1a4d4a] text-[#173747] hover:text-white font-semibold text-xs transition-all flex items-center justify-between"
            >
              <span>Open Interactive Role Selector</span>
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5-Step Architecture Pipeline ─────────────────────────── */}
      <section id="architecture" className="py-20 px-6 bg-[#f8fafb] border-t border-[#dce3e6]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#dce3e6]">
            <div>
              <span className="kicker-tag text-[#1a4d4a] block mb-2 font-bold tracking-widest">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173747] tracking-tight">
                From Raw Flight Telemetry to Optimized Sorties
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#4d606a] max-w-md lg:text-right">
              Fully automated 5-stage closed loop running 100% locally on air-gapped defence servers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PIPELINE_STEPS.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.n}
                  className="bg-white border border-[#dce3e6] rounded-xl p-5 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-7 h-7 rounded-full bg-[#1a4d4a] text-white text-xs font-bold flex items-center justify-center font-mono">
                        {step.n}
                      </span>
                      <Icon size={18} className="text-[#1a4d4a]" />
                    </div>
                    <h4 className="text-sm font-bold text-[#173747] mb-2 leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#4d606a] leading-relaxed mb-4">
                      {step.desc}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-[#77878f] border-t border-slate-100 pt-3">
                    {step.meta}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Mathematical Formulation Box ─────────────────────────── */}
      <section id="formulation" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#dce3e6]">
          <div>
            <span className="kicker-tag text-[#1a4d4a] block mb-2 font-bold tracking-widest">
              THE MATHEMATICAL RIGOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173747] tracking-tight">
              Optimization &amp; Conformal Formulation
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4d606a] max-w-md lg:text-right">
            Google OR-Tools CP-SAT multi-constraint solver paired with distribution-free Conformal Prediction theory.
          </p>
        </div>

        <div className="bg-[#e8f4f3] border border-[#bfd9e6] rounded-2xl p-8 sm:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#c5e3e0] gap-4">
            <div>
              <span className="text-xs font-bold text-[#1a4d4a] uppercase tracking-wider font-mono">
                OFFICIAL CP-SAT OBJECTIVE &amp; CONFORMAL INFERENCE
              </span>
              <h3 className="text-xl font-bold text-[#173747] mt-1 font-heading">
                Multi-Objective Flight-Line Optimization Model
              </h3>
            </div>
            <div className="text-xs font-mono font-medium text-[#1a4d4a] bg-white px-3 py-1.5 rounded-lg border border-[#c5e3e0]">
              Coverage Target: 1 - &alpha; = 0.80 (80% Interval)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-[#c5e3e0] space-y-4 shadow-2xs">
              <span className="text-xs font-bold text-[#173747] uppercase tracking-wide block font-heading">
                1. CP-SAT Multi-Objective Function
              </span>
              <div className="py-4 px-4 bg-[#f8fafb] rounded-lg border border-slate-200 overflow-x-auto text-center font-mono text-sm sm:text-base font-semibold text-[#173747]">
                min &Sigma; ( c<sub>delay</sub> · &Delta;t<sub>w</sub> + &alpha; · Risk(t<sub>w</sub>, RUL<sub>w</sub>) ) - &beta; · &Sigma; Ready(a)
              </div>
              <div className="space-y-1 text-xs text-[#4d606a] leading-relaxed">
                <p>• <strong>c<sub>delay</sub> · &Delta;t<sub>w</sub></strong>: Penalty for rescheduling planned maintenance</p>
                <p>• <strong>Risk(t<sub>w</sub>, RUL<sub>w</sub>)</strong>: Penalty if scheduled slot is near lower conformal RUL bound</p>
                <p>• <strong>&beta; · Ready(a)</strong>: Maximizes mission-ready airframes across squadrons</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#c5e3e0] space-y-4 shadow-2xs">
              <span className="text-xs font-bold text-[#173747] uppercase tracking-wide block font-heading">
                2. Split Conformal Prediction Interval
              </span>
              <div className="py-4 px-4 bg-[#f8fafb] rounded-lg border border-slate-200 overflow-x-auto text-center font-mono text-sm sm:text-base font-semibold text-[#173747]">
                C(X<sub>n+1</sub>) = [ &mu;(X) - q<sub>1-&alpha;</sub> , &mu;(X) + q<sub>1-&alpha;</sub> ]
              </div>
              <div className="space-y-1 text-xs text-[#4d606a] leading-relaxed">
                <p>• <strong>s<sub>i</sub> = |y<sub>i</sub> - &mu;(x<sub>i</sub>)|</strong>: Non-conformity residuals on calibration set</p>
                <p>• <strong>q<sub>1-&alpha;</sub> = Quantile(&lceil;(n+1)(1-&alpha;)&rceil; / n)</strong>: Distribution-free calibration</p>
                <p>• Guaranteed marginal coverage <strong>P(Y &isin; C(X)) &ge; 1 - &alpha;</strong> without distributional assumptions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Institutional Call-to-Action ─────────────────────────── */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#0f3535] to-[#1a4d4a] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 font-heading tracking-tight">
            Deploy AeroSync to Your Squadron
          </h2>
          <p className="text-base text-[#c9d8e0] max-w-2xl mx-auto mb-8 font-normal">
            Zero external network dependencies. Runs locally on secure workstations or tactical air-gapped servers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="btn px-6 py-3 bg-white text-[#1a4d4a] hover:bg-slate-100 font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Access Flight-Line Terminal</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/twin"
              className="btn px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <Plane size={16} />
              <span>Launch 3D Digital Twin</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Government Institutional Footer ─────────────────────── */}
      <footer className="bg-[#081924] text-[#c9d8e0] pt-16 pb-12 border-t border-[#173747] text-xs">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-white text-base tracking-tight">
                    AEROSYNC · FLEET AVAILABILITY &amp; READINESS ENGINE
                  </h4>
                  <p className="text-[#77878f] text-[11px]">
                    Government of India · Ministry of Defence (IAF MRO Wing)
                  </p>
                </div>
              </div>
              <p className="text-[#a1b5c2] leading-relaxed max-w-md">
                High-frequency prognostic telemetry analysis, conformal RUL uncertainty estimation,
                and constraint-driven flight-line scheduling for military aviation readiness.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0e2636] border border-[#20465a] text-[#34d399] font-mono text-[11px]">
                <CheckCircle2 size={13} />
                <span>100% Problem Statement 26249 Compliance</span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">
                PLATFORM MODULES
              </h5>
              <ul className="space-y-2.5">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Flight Line Overview</Link></li>
                <li><Link href="/twin" className="hover:text-white transition-colors">3D Digital Twin (Rafale)</Link></li>
                <li><Link href="/alarms" className="hover:text-white transition-colors">Prognostic Alarm Queue</Link></li>
                <li><Link href="/schedule" className="hover:text-white transition-colors">CP-SAT Schedule Board</Link></li>
                <li><Link href="/spares" className="hover:text-white transition-colors">Weibull Spares Logistics</Link></li>
                <li><Link href="/evaluation" className="hover:text-white transition-colors">NASA C-MAPSS Ladder</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-4">
                AIR-GAPPED COMPLIANCE
              </h5>
              <ul className="space-y-2.5 text-[#a1b5c2]">
                <li>• Zero-Egress Network Architecture</li>
                <li>• Cryptographic Immutable Audit Log</li>
                <li>• RFC 9309 Ingestion Protocol</li>
                <li>• Production Next.js on Vercel</li>
                <li>• Three.js 3D WebGL Digital Twin</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#173747] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#77878f]">
            <p>© {new Date().getFullYear()} Ministry of Defence · Government of India. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Public Demonstration Build</span>
              <span>•</span>
              <span>Synthetic Fleet Telemetry</span>
              <span>•</span>
              <Link href="/login" className="text-white hover:underline">Console Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
