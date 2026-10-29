'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import EChartsClient from '@/components/charts/EChartsClient'
import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react'
import { useState } from 'react'

export default function AlarmDetail() {
  const params = useParams()
  const id = (params?.id as string) || 'ALM-8012'
  const [acknowledged, setAcknowledged] = useState(false)
  const [resolved, setResolved] = useState(false)

  const rulOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#0f172a', fontSize: 12 },
      shadowColor: 'rgba(0, 0, 0, 0.05)',
      shadowBlur: 10,
    },
    grid: { left: 45, right: 20, top: 25, bottom: 35 },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 150 }, (_, i) => i + 1),
      axisLabel: { color: '#64748b', fontSize: 10 },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
    },
    yAxis: {
      type: 'value',
      name: 'RUL (Cycles)',
      nameTextStyle: { color: '#64748b', fontSize: 11 },
      axisLabel: { color: '#64748b' },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
    },
    series: [
      {
        name: 'Conformal Upper 90%',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: Array.from({ length: 150 }, (_, i) => Math.max(0, 150 - i * 0.9 + Math.sin(i) * 3 + 18)),
        lineStyle: { color: '#93c5fd', width: 1, type: 'dashed' },
        areaStyle: { color: 'rgba(14, 116, 144, 0.08)' },
      },
      {
        name: 'RUL Point Estimate',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: Array.from({ length: 150 }, (_, i) => Math.max(0, 150 - i * 0.9 + Math.sin(i) * 3)),
        lineStyle: { color: '#005f73', width: 2.5 },
      },
      {
        name: 'Conformal Lower 10%',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: Array.from({ length: 150 }, (_, i) => Math.max(0, 150 - i * 0.9 + Math.sin(i) * 3 - 18)),
        lineStyle: { color: '#93c5fd', width: 1, type: 'dashed' },
      },
    ],
  }

  const handleAcknowledge = async () => {
    try {
      await fetch(`/api/v1/alarms/${id}/acknowledge`, { method: 'POST' })
    } catch {}
    setAcknowledged(true)
  }

  const handleResolve = async () => {
    try {
      await fetch(`/api/v1/alarms/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: 'Resolved by MEO' }),
      })
    } catch {}
    setResolved(true)
  }

  return (
    <div className="space-y-6">
      {/* ── Title & Back ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/alarms"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Alarm Diagnosis &amp; RUL Forecast <span className="text-rose-700 font-mono">#{id}</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium">Degradation trace on high-pressure compressor stage</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {resolved ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
              STATUS: RESOLVED
            </span>
          ) : acknowledged ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono">
              STATUS: ACKNOWLEDGED
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-mono">
              SEVERITY: CRITICAL
            </span>
          )}
        </div>
      </div>

      {/* ── Metadata Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          ['Airframe', 'A-001', 'Fighter Wing'],
          ['Component', 'ENG-SN-0042', 'CFM56 / Turbofan'],
          ['RUL Point', '18 Cycles', 'Lead time: 8 days'],
          ['10%–90% Interval', '[10 – 28 cyc]', '80% coverage target'],
          ['Status', resolved ? 'RESOLVED' : acknowledged ? 'ACKNOWLEDGED' : 'OPEN', 'Flight-Line Queue'],
          ['Target Date', '2026-10-28', 'Hangar H1 slot ready'],
        ].map(([k, v, s]) => (
          <div key={k} className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{k}</p>
            <p className="text-slate-900 font-bold text-sm mt-0.5">{v}</p>
            <p className="text-slate-400 text-[10px] mt-0.5">{s}</p>
          </div>
        ))}
      </div>

      {/* ── RUL Curve ECharts ────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Remaining Useful Life (RUL) Trajectory &amp; Uncertainty Envelope</h2>
            <p className="text-xs text-slate-500 font-medium">HistGradientBoosting + Conformal Residual calibration</p>
          </div>
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
            PUBLIC-SIMULATED NASA FD001
          </span>
        </div>
        <EChartsClient option={rulOption} style={{ height: 280 }} />
      </div>

      {/* ── Top Sensor Drivers (SHAP) ─────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Primary Degradation Sensor Drivers (SHAP Attribution)</h2>
          <p className="text-xs text-slate-500 font-medium">Sensors contributing most to the remaining useful life decrease</p>
        </div>

        <div className="space-y-3">
          {[
            { sensor: 'sensor_11 (Ps30)', desc: 'Static pressure at HPC outlet (psia)', weight: 0.42, dir: 'Increasing degradation signature' },
            { sensor: 'sensor_4 (T50)', desc: 'Total temperature at LPT outlet (°R)', weight: 0.31, dir: 'Thermal buildup anomaly' },
            { sensor: 'sensor_7 (Ps30)', desc: 'Pressure ratio in bypass duct', weight: 0.18, dir: 'Minor flow restriction' },
          ].map((d) => (
            <div key={d.sensor} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 font-mono">{d.sensor}</span>
                <span className="text-slate-500 font-semibold">{d.dir}</span>
                <span className="font-extrabold text-sky-800 font-mono">{(d.weight * 100).toFixed(0)}% contribution</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-sky-700 h-2 rounded-full" style={{ width: `${d.weight * 100}%` }} />
              </div>
              <p className="text-[11px] text-slate-500">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Action Buttons ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          href="/schedule"
          className="bg-sky-800 hover:bg-sky-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-xs transition-colors"
        >
          Schedule Maintenance Slot via CP-SAT
        </Link>
        {!acknowledged && (
          <button
            onClick={handleAcknowledge}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 size={16} className="text-amber-600" />
            <span>Acknowledge Alarm</span>
          </button>
        )}
        {!resolved && (
          <button
            onClick={handleResolve}
            className="bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-300 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Mark Resolved &amp; Close</span>
          </button>
        )}
      </div>
    </div>
  )
}
