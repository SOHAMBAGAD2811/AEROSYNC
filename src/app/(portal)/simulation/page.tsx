'use client'

import { useState } from 'react'
import { BarChart2, Play, Sliders } from 'lucide-react'
import EChartsClient from '@/components/charts/EChartsClient'

const RESULT = {
  policies: {
    reactive:  { availability: { mean: 0.612 }, unplanned_failures: { mean: 18.4 }, cost: 'High (AOG surcharges)' },
    greedy:    { availability: { mean: 0.741 }, unplanned_failures: { mean: 9.2  }, cost: 'Moderate' },
    optimised: { availability: { mean: 0.783 }, unplanned_failures: { mean: 7.1  }, cost: 'Lowest (Scheduled slots)' },
  }
}

function policyChart() {
  const policies = ['Reactive Policy', 'Greedy Earliest-Available', 'AeroSync CP-SAT (Optimised)']
  const avail = [0.612, 0.741, 0.783]
  const colors = ['#dc2626', '#d97706', '#0284c7']
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#0f172a', fontSize: 12 },
    },
    grid: { left: 45, right: 20, top: 20, bottom: 35 },
    xAxis: {
      type: 'category',
      data: policies,
      axisLabel: { color: '#475569', fontSize: 11, fontWeight: 500 },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1,
      axisLabel: { color: '#64748b', formatter: (v: number) => `${(v * 100).toFixed(0)}%` },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
    },
    series: [
      {
        type: 'bar',
        data: avail.map((v, i) => ({
          value: v,
          itemStyle: { color: colors[i], borderRadius: [6, 6, 0, 0] },
        })),
        barWidth: 42,
      },
    ],
  }
}

export default function SimulationPage() {
  const [flightMul, setFlightMul] = useState(1.0)
  const [spareMul, setSpareMul] = useState(1.0)
  const [simulating, setSimulating] = useState(false)

  const handleRunSim = () => {
    setSimulating(true)
    setTimeout(() => setSimulating(false), 900)
  }

  return (
    <div className="space-y-6">
      {/* ── Title Row ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart2 size={24} className="text-sky-700" /> Fleet Availability &amp; Policy Simulator
          </h1>
          <p className="text-sm text-slate-500 font-medium">Monte Carlo simulation comparing maintenance scheduling policies (100 runs)</p>
        </div>
        <button
          onClick={handleRunSim}
          disabled={simulating}
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-sky-800 hover:bg-sky-900 text-white px-4 py-2 rounded-lg shadow-xs transition-colors disabled:opacity-50"
        >
          <Play size={14} className={simulating ? 'animate-pulse' : ''} />
          {simulating ? 'Running Monte Carlo...' : 'Run Simulation'}
        </button>
      </div>

      {/* ── Policy Outcome Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: 'reactive', label: 'Reactive Standard Policy', data: RESULT.policies.reactive, border: 'border-rose-200', bg: 'bg-rose-50/40', badge: 'bg-rose-50 text-rose-800 border-rose-200' },
          { key: 'greedy', label: 'Greedy Earliest-Available', data: RESULT.policies.greedy, border: 'border-amber-200', bg: 'bg-amber-50/30', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
          { key: 'optimised', label: 'AeroSync CP-SAT (Optimised)', data: RESULT.policies.optimised, border: 'border-sky-300', bg: 'bg-sky-50/40', badge: 'bg-sky-50 text-sky-800 border-sky-200' },
        ].map(p => (
          <div key={p.key} className={`bg-white border ${p.border} rounded-xl p-5 shadow-xs space-y-3`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badge}`}>
                {p.label}
              </span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {(p.data.availability.mean * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Mean Fleet Availability Target</p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
              <p className="text-slate-600 font-medium">Unplanned Failures: <span className="font-bold text-slate-900">{p.data.unplanned_failures.mean}</span></p>
              <p className="text-slate-600 font-medium">Relative MRO Cost: <span className="font-bold text-slate-900">{p.data.cost}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts & What-If Controls ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-3">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Availability Benchmarking</h2>
            <p className="text-xs text-slate-500 font-medium">Percentage of airframes remaining mission-ready simultaneously</p>
          </div>
          <EChartsClient option={policyChart()} style={{ height: 240 }} />
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">What-If Operational Scenarios</h2>
              <p className="text-xs text-slate-500 font-medium">Stress test fleet resilience against wartime surge conditions</p>
            </div>
            <Sliders size={18} className="text-slate-400" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Flight Tempo Surge Multiplier</span>
                <span className="font-mono text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">{flightMul.toFixed(1)}× Tempo</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.5}
                step={0.1}
                value={flightMul}
                onChange={e => setFlightMul(+e.target.value)}
                className="w-full accent-sky-700"
              />
              <p className="text-[11px] text-slate-400 mt-1">Normal training (1.0×) up to surge combat sorties (2.5×)</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Spares Supply Lead-Time Delay</span>
                <span className="font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{spareMul.toFixed(1)}× Lead Time</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.0}
                step={0.1}
                value={spareMul}
                onChange={e => setSpareMul(+e.target.value)}
                className="w-full accent-amber-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Supply chain disruption buffer simulation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
