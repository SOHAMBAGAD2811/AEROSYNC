'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  AlertTriangle, Shield, Activity, Calendar, Search,
  Clock, ArrowRight, Eye
} from 'lucide-react'

interface AlarmItem {
  id: string
  tail: string
  model: string
  serial: string
  component: string
  base: string
  rulPoint: number
  rulLower: number
  rulUpper: number
  severity: 'critical' | 'high' | 'medium'
  status: 'open' | 'acknowledged' | 'planned' | 'resolved'
  raisedAt: string
  targetDate: string
  driverSensor: string
  driverDesc: string
  driverContribution: number
}

const ALARMS_DATA: AlarmItem[] = [
  {
    id: 'ALM-8012',
    tail: 'A-001',
    model: 'Dassault Rafale F3R',
    serial: 'ENG-SN-0042',
    component: 'Engine #1 Turbofan (Port)',
    base: 'Ambala AFB',
    rulPoint: 18,
    rulLower: 10,
    rulUpper: 28,
    severity: 'critical',
    status: 'open',
    raisedAt: '18 Oct 2026',
    targetDate: '26 Oct 2026',
    driverSensor: 'sensor_11 (Ps30)',
    driverDesc: 'HPC static outlet pressure drop delta',
    driverContribution: 62,
  },
  {
    id: 'ALM-8019',
    tail: 'A-007',
    model: 'Su-30MKI Flanker-H',
    serial: 'ENG-SN-0091',
    component: 'Engine #2 Turbofan (Starboard)',
    base: 'Jodhpur AFB',
    rulPoint: 31,
    rulLower: 22,
    rulUpper: 43,
    severity: 'high',
    status: 'acknowledged',
    raisedAt: '17 Oct 2026',
    targetDate: '02 Nov 2026',
    driverSensor: 'sensor_2 (T24)',
    driverDesc: 'Low-pressure turbine inlet temp surge',
    driverContribution: 48,
  },
  {
    id: 'ALM-8025',
    tail: 'A-014',
    model: 'LCA Tejas Mk1A',
    serial: 'ENG-SN-0033',
    component: 'Turbofan Core Assembly',
    base: 'Chandigarh AFB',
    rulPoint: 44,
    rulLower: 35,
    rulUpper: 55,
    severity: 'medium',
    status: 'planned',
    raisedAt: '16 Oct 2026',
    targetDate: '12 Nov 2026',
    driverSensor: 'sensor_12 (BPR)',
    driverDesc: 'Bypass ratio airflow deviation',
    driverContribution: 36,
  },
  {
    id: 'ALM-8031',
    tail: 'A-022',
    model: 'Mirage 2000-5',
    serial: 'ENG-SN-0017',
    component: 'Turbofan High-Pressure Stage',
    base: 'Jodhpur AFB',
    rulPoint: 52,
    rulLower: 40,
    rulUpper: 66,
    severity: 'medium',
    status: 'open',
    raisedAt: '15 Oct 2026',
    targetDate: '18 Nov 2026',
    driverSensor: 'sensor_14 (Nf)',
    driverDesc: 'Physical fan spool speed variation',
    driverContribution: 29,
  },
  {
    id: 'ALM-8038',
    tail: 'A-031',
    model: 'MiG-29UPG Fulcrum',
    serial: 'ENG-SN-0078',
    component: 'Engine #1 Turbofan',
    base: 'Ambala AFB',
    rulPoint: 58,
    rulLower: 46,
    rulUpper: 72,
    severity: 'medium',
    status: 'open',
    raisedAt: '14 Oct 2026',
    targetDate: '24 Nov 2026',
    driverSensor: 'sensor_9 (Nc)',
    driverDesc: 'Core spool speed oscillation',
    driverContribution: 25,
  },
  {
    id: 'ALM-8044',
    tail: 'A-045',
    model: 'Dassault Rafale F3R',
    serial: 'LG-SN-0112',
    component: 'Main Landing Gear Undercarriage',
    base: 'Ambala AFB',
    rulPoint: 24,
    rulLower: 14,
    rulUpper: 34,
    severity: 'critical',
    status: 'open',
    raisedAt: '19 Oct 2026',
    targetDate: '29 Oct 2026',
    driverSensor: 'sensor_17 (Bleed)',
    driverDesc: 'Brake cylinder retraction pressure delay',
    driverContribution: 55,
  },
  {
    id: 'ALM-8051',
    tail: 'A-058',
    model: 'Su-30MKI Flanker-H',
    serial: 'HYD-SN-0041',
    component: 'Hydraulic Actuator Pump',
    base: 'Chandigarh AFB',
    rulPoint: 38,
    rulLower: 28,
    rulUpper: 49,
    severity: 'high',
    status: 'acknowledged',
    raisedAt: '18 Oct 2026',
    targetDate: '06 Nov 2026',
    driverSensor: 'sensor_4 (T50)',
    driverDesc: 'Hydraulic manifold temperature buildup',
    driverContribution: 41,
  },
  {
    id: 'ALM-8062',
    tail: 'A-079',
    model: 'C-130J Super Hercules',
    serial: 'ENG-SN-0056',
    component: 'Turboprop Engine #2',
    base: 'Chandigarh AFB',
    rulPoint: 49,
    rulLower: 38,
    rulUpper: 62,
    severity: 'medium',
    status: 'open',
    raisedAt: '16 Oct 2026',
    targetDate: '15 Nov 2026',
    driverSensor: 'sensor_8 (htBleed)',
    driverDesc: 'Bleed enthalpy bleed valve restriction',
    driverContribution: 32,
  },
]

const SEVERITY_CONFIG: Record<
  AlarmItem['severity'],
  { label: string; badge: string; border: string; dot: string }
> = {
  critical: {
    label: 'Critical Alert',
    badge: 'bg-red-50 text-red-800 border-red-200',
    border: 'border-l-4 border-l-red-600',
    dot: 'bg-red-500 animate-pulse',
  },
  high: {
    label: 'High Priority',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    border: 'border-l-4 border-l-amber-500',
    dot: 'bg-amber-500',
  },
  medium: {
    label: 'Medium Watch',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    border: 'border-l-4 border-l-blue-600',
    dot: 'bg-blue-500',
  },
}

const STATUS_CONFIG: Record<
  AlarmItem['status'],
  { label: string; badge: string }
> = {
  open: { label: 'Open', badge: 'bg-red-100 text-red-800' },
  acknowledged: { label: 'Acknowledged', badge: 'bg-amber-100 text-amber-800' },
  planned: { label: 'Slot Planned', badge: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Resolved', badge: 'bg-emerald-100 text-emerald-800' },
}

export default function Alarms() {
  const [alarms, setAlarms] = useState<AlarmItem[]>(ALARMS_DATA)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<'all' | AlarmItem['severity']>('all')
  const [baseFilter, setBaseFilter] = useState<string>('all')

  const counts = useMemo(() => {
    return {
      total: alarms.length,
      critical: alarms.filter((a) => a.severity === 'critical').length,
      high: alarms.filter((a) => a.severity === 'high').length,
      medium: alarms.filter((a) => a.severity === 'medium').length,
    }
  }, [alarms])

  const filtered = useMemo(() => {
    return alarms.filter((a) => {
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false
      if (baseFilter !== 'all' && a.base !== baseFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const match =
          a.id.toLowerCase().includes(q) ||
          a.tail.toLowerCase().includes(q) ||
          a.model.toLowerCase().includes(q) ||
          a.serial.toLowerCase().includes(q) ||
          a.driverSensor.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [alarms, severityFilter, baseFilter, search])

  const handleAcknowledge = async (id: string) => {
    try {
      await fetch(`/api/v1/alarms/${id}/acknowledge`, { method: 'POST' })
    } catch {}
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' } : a))
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#dce3e6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-[#1a4d4a] bg-[#e8f4f3] border border-[#c5e3e0] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              CONFORMAL PROGNOSTICS · RUL ALERTS
            </span>
            <span className="text-xs text-[#77878f] font-mono">80% CONFORMAL TARGET COVERAGE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173747] font-heading tracking-tight">
            Prognostic Alarm &amp; Anomaly Queue
          </h1>
          <p className="text-sm text-[#4d606a] mt-0.5">
            NASA C-MAPSS calibrated uncertainty intervals, SHAP feature attributions, and lead-time alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/schedule"
            className="btn btn-primary text-xs shadow-xs font-semibold flex items-center gap-1.5"
          >
            <Calendar size={14} />
            <span>Open CP-SAT Schedule Board</span>
          </Link>
          <Link
            href="/twin"
            className="btn btn-secondary text-xs shadow-2xs font-semibold flex items-center gap-1.5"
          >
            <Eye size={14} className="text-[#1a4d4a]" />
            <span>Inspect 3D Twin</span>
          </Link>
        </div>
      </div>

      {/* ── 4 KPI Metric Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card p-5 border-l-4 border-l-red-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Critical Alarms</span>
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{counts.critical}</p>
            <span className="text-xs font-semibold text-red-700">Immediate Action</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">RUL &lt; 30 cycles · High AOG risk</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">High Priority</span>
            <Activity size={16} className="text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{counts.high}</p>
            <span className="text-xs font-semibold text-amber-700">30–50 Cycles</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Hangar bay entry recommended</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Medium Watch</span>
            <Clock size={16} className="text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{counts.medium}</p>
            <span className="text-xs font-semibold text-blue-700">Sensor Drift</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Monitored over next 20 sorties</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Conformal Guarantee</span>
            <Shield size={16} className="text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">80.0%</p>
            <span className="text-xs font-semibold text-emerald-700 font-mono">1 - α = 0.80</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Calibrated on C-MAPSS test set</p>
        </div>
      </div>

      {/* ── Toolbar: Search & Filters ─────────────────────────────────── */}
      <div className="surface-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alarm ID, tail (e.g. A-001), component serial, or sensor..."
              className="gov-input pl-9 text-xs py-2 w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                severityFilter === 'all'
                  ? 'bg-[#1a4d4a] text-white border-[#1a4d4a] shadow-xs'
                  : 'bg-white text-[#4d606a] border-[#dce3e6] hover:bg-slate-50'
              }`}
            >
              All Severities ({counts.total})
            </button>
            <button
              onClick={() => setSeverityFilter('critical')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                severityFilter === 'critical'
                  ? 'bg-red-700 text-white border-red-700 shadow-xs'
                  : 'bg-white text-red-700 border-red-200 hover:bg-red-50'
              }`}
            >
              Critical ({counts.critical})
            </button>
            <button
              onClick={() => setSeverityFilter('high')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                severityFilter === 'high'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
              }`}
            >
              High ({counts.high})
            </button>
            <button
              onClick={() => setSeverityFilter('medium')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                severityFilter === 'medium'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
              }`}
            >
              Medium ({counts.medium})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-[#edf2f4]">
          <span className="text-[11px] font-bold text-[#77878f] uppercase tracking-wider mr-1">Airbase Station:</span>
          {[
            { id: 'all', label: 'All Bases' },
            { id: 'Ambala AFB', label: 'Ambala AFB' },
            { id: 'Chandigarh AFB', label: 'Chandigarh AFB' },
            { id: 'Jodhpur AFB', label: 'Jodhpur AFB' },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => setBaseFilter(b.id)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${
                baseFilter === b.id
                  ? 'bg-[#173747] text-white font-bold'
                  : 'text-[#4d606a] hover:bg-slate-100 border border-transparent'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Alarms Manifest Table ─────────────────────────────────────── */}
      <div className="comp-table-container">
        <div className="overflow-x-auto">
          <table className="comp-table">
            <thead>
              <tr>
                <th className="comp-th-feature" style={{ width: '22%' }}>Alarm ID &amp; Airframe</th>
                <th className="comp-th-feature" style={{ width: '22%' }}>Subsystem &amp; Serial</th>
                <th className="comp-th-feature" style={{ width: '15%' }}>Severity &amp; State</th>
                <th className="comp-th-feature" style={{ width: '18%' }}>Conformal RUL</th>
                <th className="comp-th-feature" style={{ width: '23%' }}>SHAP Sensor Driver</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((alarm) => {
                const sev = SEVERITY_CONFIG[alarm.severity]
                const stat = STATUS_CONFIG[alarm.status]
                const danger = alarm.rulPoint <= 30

                return (
                  <tr key={alarm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="comp-td-feature">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-[#173747] shrink-0">
                          {alarm.tail.replace('A-', '')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[#173747] font-mono text-sm">{alarm.tail}</span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-1.5 py-0.2 rounded">
                              {alarm.id}
                            </span>
                          </div>
                          <p className="text-xs text-[#4d606a] mt-0.5">{alarm.model}</p>
                          <p className="text-[11px] text-[#77878f] font-mono">{alarm.base}</p>
                        </div>
                      </div>
                    </td>

                    <td className="comp-td-feature">
                      <p className="text-xs font-semibold text-[#173747]">{alarm.component}</p>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">SN: {alarm.serial}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Triggered: {alarm.raisedAt}</p>
                    </td>

                    <td className="comp-td-feature">
                      <div className="space-y-1.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${sev.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                          <span>{sev.label}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${stat.badge}`}>
                            {stat.label}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="comp-td-feature">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={`font-bold ${danger ? 'text-red-600' : 'text-amber-600'}`}>
                            {alarm.rulPoint} cyc
                          </span>
                          <span className="text-[10px] text-[#77878f]">
                            [{alarm.rulLower}–{alarm.rulUpper}]
                          </span>
                        </div>
                        <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${danger ? 'bg-red-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, (alarm.rulPoint / 80) * 100)}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">Target: {alarm.targetDate}</p>
                      </div>
                    </td>

                    <td className="comp-td-feature">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#173747] font-mono">{alarm.driverSensor}</span>
                          <span className="font-bold text-emerald-800 font-mono text-[11px]">
                            +{alarm.driverContribution}%
                          </span>
                        </div>
                        <p className="text-xs text-[#4d606a] leading-tight">{alarm.driverDesc}</p>
                        <div className="flex items-center gap-2 pt-1.5">
                          <Link
                            href={`/alarms/${alarm.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1a4d4a] hover:underline"
                          >
                            <span>Inspect Trajectory</span>
                            <ArrowRight size={11} />
                          </Link>
                          {alarm.status === 'open' && (
                            <button
                              onClick={() => handleAcknowledge(alarm.id)}
                              className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                            >
                              Acknowledge
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400 text-sm">
                    No prognostic alarms found matching current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
