'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, Shield, Plane, AlertTriangle, Calendar,
  ChevronRight, ChevronLeft, Activity
} from 'lucide-react'

interface AircraftItem {
  id: string
  tail: string
  model: string
  type: 'fighter' | 'transport' | 'helicopter' | 'patrol'
  base: string
  baseCode: string
  status: 'mission_ready' | 'alarm' | 'in_maintenance' | 'grounded'
  flightHours: number
  rulPoint: number
  rulLower: number
  rulUpper: number
  lastInspection: string
  nextInspection: string
  engineSerial: string
}

function generateFullFleet(): AircraftItem[] {
  const models: Record<string, string[]> = {
    fighter: ['Dassault Rafale F3R', 'Su-30MKI Flanker-H', 'LCA Tejas Mk1A', 'Mirage 2000-5', 'MiG-29UPG Fulcrum'],
    transport: ['C-130J Super Hercules', 'Il-76MD Gajraj', 'An-32 Tactical Transport'],
    helicopter: ['Mi-17V5 Hip', 'HAL Prachand LCH', 'Boeing AH-64E Apache'],
    patrol: ['Boeing P-8I Neptune', 'Dornier 228 Maritime'],
  }

  const bases = ['Ambala AFB', 'Chandigarh AFB', 'Jodhpur AFB']
  const fleet: AircraftItem[] = []

  for (let i = 1; i <= 100; i++) {
    const tailNum = `A-${String(i).padStart(3, '0')}`
    const base = bases[(i - 1) % 3]
    const baseCode = base.startsWith('Amb') ? 'AMB' : base.startsWith('Cha') ? 'IXC' : 'JDH'

    let type: AircraftItem['type'] = 'fighter'
    if (i % 7 === 0) type = 'transport'
    else if (i % 11 === 0) type = 'helicopter'
    else if (i % 17 === 0) type = 'patrol'

    const modelList = models[type]
    const model = modelList[(i * 3) % modelList.length]

    let status: AircraftItem['status'] = 'mission_ready'
    let rulPoint = 110 + ((i * 17) % 60)
    let rulLower = rulPoint - 18
    let rulUpper = rulPoint + 22

    if (i === 1 || i === 7 || i === 14 || i === 22 || i === 31 || i === 45 || i === 58 || i === 79) {
      status = 'alarm'
      rulPoint = 18 + ((i * 5) % 25)
      rulLower = Math.max(8, rulPoint - 8)
      rulUpper = rulPoint + 12
    } else if (i === 8 || i === 19 || i === 35 || i === 64 || i === 92) {
      status = 'grounded'
      rulPoint = 6
      rulLower = 2
      rulUpper = 10
    } else if (i % 6 === 0) {
      status = 'in_maintenance'
      rulPoint = 42 + ((i * 7) % 30)
      rulLower = rulPoint - 12
      rulUpper = rulPoint + 16
    }

    const flightHours = +(1200 + ((i * 47.3) % 4100)).toFixed(1)
    const inspDay = (i % 28) + 1
    const lastInspection = `${String(inspDay).padStart(2, '0')} Sep 2026`
    const nextInspection = `${String(((inspDay + 14) % 28) + 1).padStart(2, '0')} Nov 2026`

    fleet.push({
      id: `tail-${i}`,
      tail: tailNum,
      model,
      type,
      base,
      baseCode,
      status,
      flightHours,
      rulPoint,
      rulLower,
      rulUpper,
      lastInspection,
      nextInspection,
      engineSerial: `ENG-SN-${String(1000 + i * 13).slice(-4)}`,
    })
  }

  return fleet
}

const STATIC_FLEET = generateFullFleet()

const STATUS_CONFIG: Record<
  AircraftItem['status'],
  { label: string; badge: string; dot: string; desc: string }
> = {
  mission_ready: {
    label: 'Mission Ready',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    desc: 'Cleared for high-g sortie operations',
  },
  alarm: {
    label: 'Prognostic Alarm',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500 animate-pulse',
    desc: 'HPC pressure / temp delta triggered',
  },
  in_maintenance: {
    label: 'In Hangar Bay',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    dot: 'bg-blue-500',
    desc: 'Active scheduled bay inspection',
  },
  grounded: {
    label: 'AOG Grounded',
    badge: 'bg-red-50 text-red-800 border-red-200',
    dot: 'bg-red-500',
    desc: 'Awaiting depot turbofan module',
  },
}

export default function Aircraft() {
  const [fleet, setFleet] = useState<AircraftItem[]>(STATIC_FLEET)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | AircraftItem['status']>('all')
  const [baseFilter, setBaseFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    fetch('/api/v1/fleet/aircraft')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: AircraftItem[] = data.map((a: any, idx: number) => {
            const fallback = STATIC_FLEET[idx] || STATIC_FLEET[0]
            return {
              id: a.id || fallback.id,
              tail: a.tail_number || fallback.tail,
              model: fallback.model,
              type: (a.aircraft_type || fallback.type) as AircraftItem['type'],
              base: fallback.base,
              baseCode: fallback.baseCode,
              status: (a.status || fallback.status) as AircraftItem['status'],
              flightHours: a.flight_hours_total ? +a.flight_hours_total.toFixed(1) : fallback.flightHours,
              rulPoint: fallback.rulPoint,
              rulLower: fallback.rulLower,
              rulUpper: fallback.rulUpper,
              lastInspection: fallback.lastInspection,
              nextInspection: fallback.nextInspection,
              engineSerial: fallback.engineSerial,
            }
          })
          setFleet(mapped)
        }
      })
      .catch(() => {
        setFleet(STATIC_FLEET)
      })
  }, [])

  const counts = useMemo(() => {
    return {
      total: fleet.length,
      ready: fleet.filter((a) => a.status === 'mission_ready').length,
      alarm: fleet.filter((a) => a.status === 'alarm').length,
      maintenance: fleet.filter((a) => a.status === 'in_maintenance').length,
      grounded: fleet.filter((a) => a.status === 'grounded').length,
    }
  }, [fleet])

  const filtered = useMemo(() => {
    return fleet.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false
      if (baseFilter !== 'all' && a.base !== baseFilter) return false
      if (typeFilter !== 'all' && a.type !== typeFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const match =
          a.tail.toLowerCase().includes(q) ||
          a.model.toLowerCase().includes(q) ||
          a.base.toLowerCase().includes(q) ||
          a.engineSerial.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [fleet, statusFilter, baseFilter, typeFilter, search])

  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#dce3e6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-[#1a4d4a] bg-[#e8f4f3] border border-[#c5e3e0] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              IAF AIR COMBAT FLEET · ACTIVE ROSTER
            </span>
            <span className="text-xs text-[#77878f] font-mono">100 AIRFRAMES REGISTERED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173747] font-heading tracking-tight">
            Aircraft Fleet Readiness Roster
          </h1>
          <p className="text-sm text-[#4d606a] mt-0.5">
            Combat-ready fighters, tactical airlifters, and strike helicopters across Ambala, Chandigarh, and Jodhpur.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/twin"
            className="btn btn-primary text-xs shadow-xs font-semibold flex items-center gap-1.5"
          >
            <Activity size={14} />
            <span>Launch 3D Digital Twin</span>
          </Link>
          <Link
            href="/schedule"
            className="btn btn-secondary text-xs shadow-2xs font-semibold flex items-center gap-1.5"
          >
            <Calendar size={14} className="text-[#1a4d4a]" />
            <span>CP-SAT Schedule Board</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Fleet Summary Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Mission Ready</span>
            <Plane size={16} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{counts.ready}</p>
            <span className="text-xs font-semibold text-emerald-700 font-mono">
              {((counts.ready / counts.total) * 100).toFixed(1)}% Ready
            </span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Cleared for high-g sortie operations</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Prognostic Alerts</span>
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{counts.alarm}</p>
            <span className="text-xs font-semibold text-amber-700">RUL Warning</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Pending maintenance slots</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">In Hangar Bay</span>
            <Activity size={16} className="text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{counts.maintenance}</p>
            <span className="text-xs font-semibold text-blue-700">Under Inspection</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Scheduled turnaround work</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-red-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Grounded (AOG)</span>
            <Shield size={16} className="text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{counts.grounded}</p>
            <span className="text-xs font-semibold text-red-700">Awaiting Spares</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Low inventory lock</p>
        </div>
      </div>

      {/* ── Toolbar: Search & Multi-Filters ──────────────────────────── */}
      <div className="surface-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search tail number, model, base, or engine serial..."
              className="gov-input pl-9 text-xs py-2 w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => { setStatusFilter('all'); setPage(1); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#1a4d4a] text-white border-[#1a4d4a] shadow-xs'
                  : 'bg-white text-[#4d606a] border-[#dce3e6] hover:bg-slate-50'
              }`}
            >
              All Airframes ({counts.total})
            </button>
            <button
              onClick={() => { setStatusFilter('mission_ready'); setPage(1); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === 'mission_ready'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              Ready ({counts.ready})
            </button>
            <button
              onClick={() => { setStatusFilter('alarm'); setPage(1); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === 'alarm'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
              }`}
            >
              Alarm ({counts.alarm})
            </button>
            <button
              onClick={() => { setStatusFilter('in_maintenance'); setPage(1); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === 'in_maintenance'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
              }`}
            >
              In Hangar ({counts.maintenance})
            </button>
            <button
              onClick={() => { setStatusFilter('grounded'); setPage(1); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === 'grounded'
                  ? 'bg-red-700 text-white border-red-700 shadow-xs'
                  : 'bg-white text-red-700 border-red-200 hover:bg-red-50'
              }`}
            >
              Grounded ({counts.grounded})
            </button>
          </div>
        </div>

        {/* Sub-Filters: Station & Role */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#edf2f4]">
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="font-bold text-[#77878f] uppercase tracking-wider mr-1">Station:</span>
            {['all', 'Ambala AFB', 'Chandigarh AFB', 'Jodhpur AFB'].map((b) => (
              <button
                key={b}
                onClick={() => { setBaseFilter(b); setPage(1); }}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  baseFilter === b
                    ? 'bg-[#173747] text-white font-bold'
                    : 'text-[#4d606a] hover:bg-slate-100'
                }`}
              >
                {b === 'all' ? 'All Bases' : b}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#77878f] font-mono">
            Showing {paginated.length} of {filtered.length} airframes (Page {page} of {totalPages})
          </div>
        </div>
      </div>

      {/* ── 12-Card Grid (Aircraft Visual Roster) ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginated.map((ac) => {
          const cfg = STATUS_CONFIG[ac.status]
          const isWarning = ac.status === 'alarm' || ac.status === 'grounded'

          return (
            <div
              key={ac.id}
              className="surface-card p-5 flex flex-col justify-between hover:border-[#1a4d4a] group transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono font-extrabold text-lg text-[#173747] group-hover:text-[#1a4d4a] transition-colors">
                      {ac.tail}
                    </span>
                    <span className="text-[10px] font-mono text-[#77878f] block uppercase tracking-wider">
                      {ac.baseCode} · {ac.type}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${cfg.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    <span>{cfg.label}</span>
                  </span>
                </div>

                <p className="text-xs font-bold text-[#173747] line-clamp-1 mb-1 font-heading">
                  {ac.model}
                </p>
                <p className="text-[11px] text-[#77878f] mb-3.5 font-mono">
                  Engine: {ac.engineSerial}
                </p>

                <div className="space-y-1.5 text-xs border-t border-[#edf2f4] pt-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#77878f]">Total Flight Hours:</span>
                    <span className="font-mono font-bold text-[#173747]">{ac.flightHours}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#77878f]">Conformal RUL Point:</span>
                    <span className={`font-mono font-bold ${isWarning ? 'text-red-700' : 'text-emerald-700'}`}>
                      {ac.rulPoint} cyc [{ac.rulLower}–{ac.rulUpper}]
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#77878f]">Last Inspection:</span>
                    <span className="font-mono text-[#4d606a]">{ac.lastInspection}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/aircraft/${ac.tail}`}
                className="w-full py-2 px-3 rounded-lg bg-[#f1f5f7] hover:bg-[#1a4d4a] text-[#173747] hover:text-white font-semibold text-xs transition-all flex items-center justify-between"
              >
                <span>View Diagnostic File</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          )
        })}
      </div>

      {/* ── Pagination Controls ──────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-secondary text-xs disabled:opacity-40 flex items-center gap-1.5"
          >
            <ChevronLeft size={14} />
            <span>Previous 12</span>
          </button>
          <div className="text-xs font-semibold text-[#4d606a]">
            Page {page} of {totalPages}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn btn-secondary text-xs disabled:opacity-40 flex items-center gap-1.5"
          >
            <span>Next 12</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
