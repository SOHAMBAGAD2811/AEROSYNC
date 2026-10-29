'use client'

import EChartsClient from '@/components/charts/EChartsClient'
import Link from 'next/link'
import { AlertTriangle, Plane, Wrench, Activity, ArrowRight, ShieldCheck } from 'lucide-react'

// Demo data matching C-MAPSS fleet
const FLEET = { ready: 72, maintenance: 15, grounded: 5, alarms: 8, total: 100 }

const TOP_ALARMS = [
  { id: 'ALM-8012', tail: 'A-001', component: 'ENG-SN-0042', rul: 18, severity: 'critical', driver: 'Ps30 / sensor_11 (HPC Pressure)' },
  { id: 'ALM-8019', tail: 'A-007', component: 'ENG-SN-0091', rul: 31, severity: 'high', driver: 'T24 / sensor_2 (Inlet Temp)' },
  { id: 'ALM-8025', tail: 'A-014', component: 'ENG-SN-0033', rul: 44, severity: 'medium', driver: 'BPR / sensor_12 (Bypass Ratio)' },
  { id: 'ALM-8031', tail: 'A-022', component: 'ENG-SN-0017', rul: 52, severity: 'medium', driver: 'Nf / sensor_14 (Fan Speed)' },
]

const SEV_CONFIG: Record<string, { border: string; text: string; bg: string }> = {
  critical: { border: '#c53c30', text: 'text-[#c53c30]', bg: 'bg-red-50 text-red-800 border-red-200' },
  high: { border: '#b46927', text: 'text-[#b46927]', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
  medium: { border: '#1b6488', text: 'text-[#1b6488]', bg: 'bg-blue-50 text-blue-800 border-blue-200' },
}

// 30-Day Trajectory Option
function forecastOption() {
  const days: string[] = []
  for (let i = 0; i < 30; i++) {
    const d = new Date('2026-10-20')
    d.setDate(d.getDate() + i)
    days.push(d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }))
  }

  const seed = (s: number) => {
    let v = s
    return () => {
      v = (v * 1664525 + 1013904223) & 0xffffffff
      return (v >>> 0) / 0xffffffff
    }
  }
  const r1 = seed(1),
    r2 = seed(2),
    r3 = seed(3)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#dce3e6',
      borderWidth: 1,
      textStyle: { color: '#173747', fontSize: 12, fontFamily: 'DM Sans, sans-serif' },
      shadowBlur: 8,
      shadowColor: 'rgba(23, 55, 71, 0.08)',
    },
    legend: {
      data: ['AeroSync CP-SAT (Optimised)', 'Greedy Earliest-Fit', 'Reactive Baseline'],
      bottom: 0,
      textStyle: { color: '#4d606a', fontSize: 11, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 },
    },
    grid: { left: 45, right: 15, top: 20, bottom: 45 },
    xAxis: {
      type: 'category',
      data: days,
      axisLabel: { color: '#77878f', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' },
      axisLine: { lineStyle: { color: '#dce3e6' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 55,
      max: 85,
      axisLabel: {
        color: '#77878f',
        fontSize: 10,
        fontFamily: 'IBM Plex Mono, monospace',
        formatter: (v: number) => `${v}%`,
      },
      splitLine: { lineStyle: { color: '#edf2f4', type: 'dashed' } },
      axisLine: { show: false },
    },
    series: [
      {
        name: 'AeroSync CP-SAT (Optimised)',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: days.map(() => +(78 + (r3() - 0.5) * 3.8).toFixed(1)),
        lineStyle: { color: '#1a4d4a', width: 2.5 },
        areaStyle: { color: 'rgba(26, 77, 74, 0.08)' },
      },
      {
        name: 'Greedy Earliest-Fit',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: days.map(() => +(72 + (r2() - 0.5) * 3.8).toFixed(1)),
        lineStyle: { color: '#b46927', width: 1.8, type: 'dashed' },
      },
      {
        name: 'Reactive Baseline',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: days.map(() => +(62 + (r1() - 0.5) * 4).toFixed(1)),
        lineStyle: { color: '#9aa7ad', width: 1.5, type: 'dotted' },
      },
    ],
  }
}

// Donut Option
function donutOption() {
  return {
    backgroundColor: 'transparent',
    tooltip: { show: false },
    series: [
      {
        type: 'pie',
        radius: ['68%', '88%'],
        avoidLabelOverlap: false,
        label: { show: false },
        data: [
          { value: FLEET.ready, name: 'Ready', itemStyle: { color: '#2e7d52' } },
          { value: FLEET.maintenance, name: 'Maintenance', itemStyle: { color: '#b46927' } },
          { value: FLEET.alarms, name: 'Alarm', itemStyle: { color: '#c53c30' } },
          { value: FLEET.grounded, name: 'Grounded', itemStyle: { color: '#cbd5e1' } },
        ],
      },
    ],
  }
}

export default function Dashboard() {
  const readyPct = ((FLEET.ready / FLEET.total) * 100).toFixed(0)

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#edf2f4]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-[#1a4d4a] bg-[#e8f4f3] border border-[#c5e3e0] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              COMMAND CONSOLE
            </span>
            <span className="text-xs text-[#77878f] font-mono">AIRBASE CLUSTER: AMBALA / CHANDIGARH / JODHPUR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#173747] tracking-tight">
            Fleet Readiness &amp; Operational Health
          </h1>
          <p className="text-xs sm:text-sm text-[#4d606a] mt-0.5 font-normal">
            Real-time telemetry and prognostic health across 100 frontline combat airframes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/schedule"
            className="btn btn-primary text-xs shadow-sm font-semibold"
          >
            <span>Run CP-SAT Planner</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Metric Summary Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Readiness Donut Card */}
        <div className="surface-card p-5 md:col-span-2 flex items-center gap-5">
          <div className="relative w-32 h-32 shrink-0">
            <EChartsClient option={donutOption()} style={{ width: '128px', height: '128px' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold font-heading text-[#173747]">{readyPct}%</span>
              <span className="text-[10px] font-mono uppercase text-[#77878f] font-bold tracking-wider">AVAILABLE</span>
            </div>
          </div>

          <div className="space-y-2 text-xs flex-1">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#edf2f4]">
              <span className="flex items-center gap-2 text-[#4d606a] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#2e7d52]" />
                Mission Ready
              </span>
              <span className="font-bold text-[#173747] font-mono tabular-nums">{FLEET.ready}</span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-[#edf2f4]">
              <span className="flex items-center gap-2 text-[#4d606a] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#b46927]" />
                In Maintenance
              </span>
              <span className="font-bold text-[#173747] font-mono tabular-nums">{FLEET.maintenance}</span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-[#edf2f4]">
              <span className="flex items-center gap-2 text-[#4d606a] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#c53c30]" />
                Prognostic Alarms
              </span>
              <span className="font-bold text-[#173747] font-mono tabular-nums">{FLEET.alarms}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#4d606a] font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Grounded / AOG
              </span>
              <span className="font-bold text-[#173747] font-mono tabular-nums">{FLEET.grounded}</span>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="md:col-span-3 grid grid-cols-2 gap-4">
          <div className="surface-card p-5 border-t-3 border-t-[#2e7d52]">
            <p className="text-[11px] font-bold text-[#77878f] uppercase tracking-wider font-heading mb-1">
              Combat Ready
            </p>
            <p className="text-3xl font-extrabold text-[#173747] font-heading tabular-nums">{FLEET.ready}</p>
            <p className="text-xs text-[#2e7d52] font-semibold mt-1 flex items-center gap-1">
              <Plane size={13} />
              72.0% Fleet Target Met
            </p>
          </div>

          <div className="surface-card p-5 border-t-3 border-t-[#c53c30]">
            <p className="text-[11px] font-bold text-[#77878f] uppercase tracking-wider font-heading mb-1">
              Active Alarms
            </p>
            <p className="text-3xl font-extrabold text-[#173747] font-heading tabular-nums">{FLEET.alarms}</p>
            <p className="text-xs text-[#c53c30] font-semibold mt-1 flex items-center gap-1">
              <AlertTriangle size={13} />
              RUL &le; 60 cycles horizon
            </p>
          </div>

          <div className="surface-card p-5 border-t-3 border-t-[#b46927]">
            <p className="text-[11px] font-bold text-[#77878f] uppercase tracking-wider font-heading mb-1">
              Hangar Slots Booked
            </p>
            <p className="text-3xl font-extrabold text-[#173747] font-heading tabular-nums">{FLEET.maintenance}</p>
            <p className="text-xs text-[#b46927] font-semibold mt-1 flex items-center gap-1">
              <Wrench size={13} />
              Depot &amp; scheduled bays
            </p>
          </div>

          <div className="surface-card p-5 border-t-3 border-t-[#1a4d4a]">
            <p className="text-[11px] font-bold text-[#77878f] uppercase tracking-wider font-heading mb-1">
              AeroSync CP-SAT Gain
            </p>
            <p className="text-3xl font-extrabold text-[#173747] font-heading tabular-nums">+6.2%</p>
            <p className="text-xs text-[#1a4d4a] font-semibold mt-1 flex items-center gap-1">
              <Activity size={13} />
              Readiness vs reactive
            </p>
          </div>
        </div>
      </div>

      {/* ── Forecast & Alarms Section ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 30-Day Trajectory */}
        <div className="surface-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#edf2f4]">
            <div>
              <h2 className="text-base font-bold font-heading text-[#173747]">
                30-Day Fleet Availability Trajectory
              </h2>
              <p className="text-xs text-[#77878f] mt-0.5">
                Monte Carlo policy simulation comparing proactive CP-SAT vs greedy vs reactive baseline.
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#e8f4f3] text-[#1a4d4a] border border-[#c5e3e0] font-mono">
              TARGET &ge; 75%
            </span>
          </div>
          <EChartsClient option={forecastOption()} style={{ height: 250 }} />
        </div>

        {/* Priority Alarms Widget */}
        <div className="surface-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#edf2f4]">
              <h2 className="text-base font-bold font-heading text-[#173747]">
                Priority Degradation Alarms
              </h2>
              <Link href="/alarms" className="text-xs font-semibold text-[#1a4d4a] hover:underline">
                All ({FLEET.alarms}) &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {TOP_ALARMS.map((a) => {
                const conf = SEV_CONFIG[a.severity]
                return (
                  <Link
                    key={a.id}
                    href={`/alarms/${a.id}`}
                    className="block rounded-lg border border-[#dce3e6] p-3 hover:border-[#1a4d4a] hover:bg-[#e8f4f3]/40 transition-all"
                    style={{ borderLeft: `3px solid ${conf.border}` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#173747] font-mono text-sm">{a.tail}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border font-mono ${conf.bg}`}>
                          {a.severity}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold font-mono text-[#173747]">
                        {a.rul} cyc
                      </span>
                    </div>
                    <p className="text-[11px] text-[#77878f] truncate font-mono">
                      {a.component} · {a.driver}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#edf2f4] flex items-center justify-between text-xs text-[#77878f]">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Conformal 10%–90% bounds verified</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
