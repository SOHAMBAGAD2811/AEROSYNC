'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calendar, RefreshCw, CheckCircle, CheckCircle2,
  Lock, Unlock, ChevronRight, ShieldCheck, SlidersHorizontal
} from 'lucide-react'

interface ScheduleSlot {
  id: string
  tail: string
  model: string
  component: string
  slotDate: string
  facility: string
  baseCode: string
  status: 'draft' | 'approved' | 'locked'
  durationDays: number
  rulLeadDays: number
  penalty: number
  missionConflict: boolean
  urgency: 'critical' | 'high' | 'routine'
}

const INITIAL_SCHEDULE: ScheduleSlot[] = [
  {
    id: 'SCH-101',
    tail: 'A-001',
    model: 'Dassault Rafale F3R',
    component: 'Port Turbofan Engine #1 (Ps30 Delta)',
    slotDate: '2026-10-28',
    facility: 'Ambala AFB · Hangar Alpha 1',
    baseCode: 'AMB',
    status: 'approved',
    durationDays: 2,
    rulLeadDays: 8,
    penalty: 0.0,
    missionConflict: false,
    urgency: 'critical',
  },
  {
    id: 'SCH-102',
    tail: 'A-007',
    model: 'Su-30MKI Flanker-H',
    component: 'Starboard Turbofan Engine #2 (T50 Surge)',
    slotDate: '2026-11-04',
    facility: 'Jodhpur AFB · Station Depot S1',
    baseCode: 'JDH',
    status: 'draft',
    durationDays: 4,
    rulLeadDays: 14,
    penalty: 0.0,
    missionConflict: false,
    urgency: 'high',
  },
  {
    id: 'SCH-103',
    tail: 'A-014',
    model: 'LCA Tejas Mk1A',
    component: 'Bypass Ducting Assembly Seal',
    slotDate: '2026-10-22',
    facility: 'Chandigarh AFB · Hangar Beta 2',
    baseCode: 'IXC',
    status: 'locked',
    durationDays: 1,
    rulLeadDays: 5,
    penalty: 0.0,
    missionConflict: false,
    urgency: 'routine',
  },
  {
    id: 'SCH-104',
    tail: 'A-022',
    model: 'Mirage 2000-5',
    component: 'Main Landing Gear Retraction Actuator',
    slotDate: '2026-11-18',
    facility: 'Ambala AFB · Hangar Alpha 2',
    baseCode: 'AMB',
    status: 'approved',
    durationDays: 2,
    rulLeadDays: 22,
    penalty: 0.0,
    missionConflict: false,
    urgency: 'routine',
  },
  {
    id: 'SCH-105',
    tail: 'A-031',
    model: 'MiG-29UPG Fulcrum',
    component: 'Accessory Gearbox Lube Pump',
    slotDate: '2026-11-02',
    facility: 'Ambala AFB · Hangar Alpha 3',
    baseCode: 'AMB',
    status: 'draft',
    durationDays: 3,
    rulLeadDays: 12,
    penalty: 0.0,
    missionConflict: false,
    urgency: 'high',
  },
  {
    id: 'SCH-106',
    tail: 'A-045',
    model: 'Dassault Rafale F3R',
    component: 'Undercarriage Brake Cylinder Assembly',
    slotDate: '2026-10-29',
    facility: 'Ambala AFB · Hangar Alpha 1',
    baseCode: 'AMB',
    status: 'approved',
    durationDays: 2,
    rulLeadDays: 6,
    penalty: 0.0,
    missionConflict: false,
    urgency: 'critical',
  },
  {
    id: 'SCH-107',
    tail: 'A-058',
    model: 'Su-30MKI Flanker-H',
    component: 'Fly-By-Wire Actuator Dual Channel',
    slotDate: '2026-10-24',
    facility: 'Chandigarh AFB · Avionics Bay D1',
    baseCode: 'IXC',
    status: 'locked',
    durationDays: 2,
    rulLeadDays: 9,
    penalty: 0.0,
    missionConflict: false,
    urgency: 'high',
  },
  {
    id: 'SCH-108',
    tail: 'A-079',
    model: 'C-130J Super Hercules',
    component: 'Turboprop Engine #2 Bleed Valve',
    slotDate: '2026-11-15',
    facility: 'Chandigarh AFB · Heavy Lift Bay H4',
    baseCode: 'IXC',
    status: 'draft',
    durationDays: 3,
    rulLeadDays: 24,
    penalty: 0.0,
    missionConflict: false,
    urgency: 'routine',
  },
]

export default function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(INITIAL_SCHEDULE)
  const [baseFilter, setBaseFilter] = useState('all')
  const [solving, setSolving] = useState(false)
  const [solverToast, setSolverToast] = useState<{
    open: boolean
    solveTime: number
    status: string
    vars: number
  } | null>(null)

  const handleRecompute = () => {
    setSolving(true)
    setTimeout(() => {
      setSolving(false)
      setSolverToast({
        open: true,
        solveTime: 142,
        status: 'OPTIMAL',
        vars: 12480,
      })
      setTimeout(() => setSolverToast(null), 6000)
    }, 900)
  }

  const handleToggleLock = (id: string) => {
    setSchedule((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        const nextStatus = s.status === 'locked' ? 'approved' : 'locked'
        return { ...s, status: nextStatus }
      })
    )
  }

  const handleApprove = (id: string) => {
    setSchedule((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s))
    )
  }

  const filtered = useMemo(() => {
    if (baseFilter === 'all') return schedule
    return schedule.filter((s) => s.baseCode === baseFilter)
  }, [schedule, baseFilter])

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#dce3e6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-[#1a4d4a] bg-[#e8f4f3] border border-[#c5e3e0] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              GOOGLE OR-TOOLS CP-SAT · MULTI-BASE OPTIMIZER
            </span>
            <span className="text-xs text-[#77878f] font-mono">PLAN VERSION: #108 (ACTIVE)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173747] font-heading tracking-tight">
            Flight-Line Maintenance Schedule Board
          </h1>
          <p className="text-sm text-[#4d606a] mt-0.5">
            Combinatorial slot balancing honoring certified shifts, depot turnaround, and locked squadron sorties.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRecompute}
            disabled={solving}
            className="btn btn-primary text-xs shadow-xs font-semibold flex items-center gap-2"
          >
            <RefreshCw size={13} className={solving ? 'animate-spin' : ''} />
            <span>{solving ? 'Solving CP-SAT Constraints...' : 'Re-Solve CP-SAT Schedule'}</span>
          </button>
        </div>
      </div>

      {/* ── Solver Notification Banner ───────────────────────────────── */}
      {solverToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs animate-slide-up">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
            <div>
              <p className="font-bold text-sm">
                Google OR-Tools Solver Status: {solverToast.status}
              </p>
              <p className="text-emerald-800 text-[11px] font-mono">
                Solve Time: {solverToast.solveTime}ms · {solverToast.vars.toLocaleString()} Boolean Decision Variables · 0 Mission Conflicts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-800 shrink-0">
            <span>Fleet Target: 76.4% Achieved</span>
            <span className="font-bold bg-emerald-200/80 px-2 py-0.5 rounded">Penalty = 0.00</span>
          </div>
        </div>
      )}

      {/* ── 4 Constraint Policy Banner Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Availability Target</span>
            <ShieldCheck size={16} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">76.4%</p>
            <span className="text-xs font-semibold text-emerald-700 font-mono">≥ 75.0% SLA</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">76 airframes ready for deployment</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-[#1a4d4a]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Hangar Utilization</span>
            <Calendar size={16} className="text-[#1a4d4a]" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">68%</p>
            <span className="text-xs font-semibold text-[#1a4d4a]">14 / 20 Daily Slots</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Balanced across Ambala, IXC &amp; JDH</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Sortie Compliance</span>
            <CheckCircle size={16} className="text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">100%</p>
            <span className="text-xs font-semibold text-blue-700">0 Violations</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Commander mission locks honored</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Solver Penalty Score</span>
            <SlidersHorizontal size={16} className="text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">0.00</p>
            <span className="text-xs font-semibold text-purple-700">Optimal Min</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">No unscheduled delay costs</p>
        </div>
      </div>

      {/* ── Airbase Selector & Quick Stats ────────────────────────────── */}
      <div className="surface-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Airbases (8 Slots)' },
            { id: 'AMB', label: 'Ambala AFB (4 Slots)' },
            { id: 'IXC', label: 'Chandigarh AFB (2 Slots)' },
            { id: 'JDH', label: 'Jodhpur AFB (2 Slots)' },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => setBaseFilter(b.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
                baseFilter === b.id
                  ? 'bg-[#1a4d4a] text-white border-[#1a4d4a] shadow-xs'
                  : 'bg-white text-[#4d606a] border-[#dce3e6] hover:bg-slate-50'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#77878f] font-mono">
          CP-SAT Math Formulation: <code>min Σ(c_delay · Δt) - β · Σ Ready</code>
        </div>
      </div>

      {/* ── Schedule Board Table ─────────────────────────────────────── */}
      <div className="comp-table-container">
        <div className="overflow-x-auto">
          <table className="comp-table">
            <thead>
              <tr>
                <th className="comp-th-feature" style={{ width: '22%' }}>Airframe &amp; Subsystem</th>
                <th className="comp-th-feature" style={{ width: '24%' }}>Hangar Bay &amp; Facility</th>
                <th className="comp-th-feature" style={{ width: '16%' }}>Target Slot Date</th>
                <th className="comp-th-feature" style={{ width: '14%' }}>Conformal Margin</th>
                <th className="comp-th-feature" style={{ width: '12%' }}>Sortie Lock</th>
                <th className="comp-th-feature" style={{ width: '12%', textAlign: 'right' }}>Controls</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((slot) => {
                const isCritical = slot.urgency === 'critical'
                const isLocked = slot.status === 'locked'

                return (
                  <tr key={slot.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="comp-td-feature">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-[#173747] shrink-0">
                          {slot.tail.replace('A-', '')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[#173747] font-mono text-sm">{slot.tail}</span>
                            <span className="text-[10px] font-mono text-slate-500 font-semibold">{slot.id}</span>
                          </div>
                          <p className="text-xs text-[#4d606a] font-medium leading-tight mt-0.5">{slot.component}</p>
                          <span
                            className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                              isCritical
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {isCritical ? 'Sortie Critical' : 'Standard Routine'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="comp-td-feature">
                      <p className="text-xs font-bold text-[#173747]">{slot.facility}</p>
                      <p className="text-[11px] text-[#77878f] font-mono mt-0.5">
                        Duration: {slot.durationDays} days · 2 Shifts
                      </p>
                    </td>

                    <td className="comp-td-feature">
                      <p className="text-xs font-extrabold text-[#173747] font-mono">{slot.slotDate}</p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Status: <strong className="uppercase">{slot.status}</strong>
                      </span>
                    </td>

                    <td className="comp-td-feature">
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold text-emerald-800">
                          +{slot.rulLeadDays}d Margin
                        </span>
                        <p className="text-[10px] text-[#77878f]">Before lower 10% bound</p>
                      </div>
                    </td>

                    <td className="comp-td-feature">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <CheckCircle size={13} className="text-emerald-600" />
                        <span>Flight Clear</span>
                      </span>
                    </td>

                    <td className="comp-td-feature text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {slot.status === 'draft' && (
                          <button
                            onClick={() => handleApprove(slot.id)}
                            className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleLock(slot.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isLocked
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-white text-slate-600 border-[#dce3e6] hover:bg-slate-50'
                          }`}
                          title={isLocked ? 'Unlock slot date' : 'Lock slot against automatic re-solving'}
                        >
                          {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                        <Link
                          href={`/aircraft/${slot.tail}`}
                          className="p-1.5 rounded-lg border border-[#dce3e6] text-[#4d606a] hover:text-[#1a4d4a] hover:bg-slate-100 transition-colors"
                          title="Inspect aircraft"
                        >
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
