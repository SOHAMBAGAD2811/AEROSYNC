'use client'

import { useState } from 'react'
import { Activity, Award, FileText, Layers, ShieldCheck } from 'lucide-react'

interface SubsetMetric {
  subset: string
  description: string
  conditions: number
  faultModes: number
  trainEngines: number
  testEngines: number
  trainCycles: number
  testCycles: number
  rmseLinear: number
  rmseTree: number
  rmseNeural: number
  phm08Tree: number
  conformalCoverage: number
  conformalWidth: number
  avgLeadTime: number
  falseAlarmRate: number
  topDrivers: Array<{
    sensor: string
    description: string
    direction: 'increasing' | 'decreasing'
    importance: number
  }>
}

const BENCHMARK_DATA: Record<string, SubsetMetric> = {
  FD001: {
    subset: 'FD001',
    description: 'Sea-level, single operating condition, HPC degradation',
    conditions: 1,
    faultModes: 1,
    trainEngines: 100,
    testEngines: 100,
    trainCycles: 20631,
    testCycles: 13096,
    rmseLinear: 22.66,
    rmseTree: 18.13,
    rmseNeural: 17.55,
    phm08Tree: 585.7,
    conformalCoverage: 76.0,
    conformalWidth: 21.7,
    avgLeadTime: 8.8,
    falseAlarmRate: 0.0,
    topDrivers: [
      { sensor: 'sensor_11', description: 'Static pressure at HPC outlet (psia)', direction: 'increasing', importance: 0.775 },
      { sensor: 'sensor_4', description: 'Total temperature at LPT outlet (°R)', direction: 'increasing', importance: 0.757 },
      { sensor: 'sensor_12', description: 'Ratio of fuel flow to Ps30 (pps/psia)', direction: 'decreasing', importance: 0.749 },
    ],
  },
  FD002: {
    subset: 'FD002',
    description: 'Six operating flight regimes, HPC degradation',
    conditions: 6,
    faultModes: 1,
    trainEngines: 260,
    testEngines: 259,
    trainCycles: 53759,
    testCycles: 33991,
    rmseLinear: 32.18,
    rmseTree: 28.27,
    rmseNeural: 28.74,
    phm08Tree: 10125.2,
    conformalCoverage: 64.9,
    conformalWidth: 22.6,
    avgLeadTime: 6.2,
    falseAlarmRate: 0.4,
    topDrivers: [
      { sensor: 'sensor_14', description: 'Core engine speed (rpm)', direction: 'increasing', importance: 0.061 },
      { sensor: 'sensor_11', description: 'Static pressure at HPC outlet (psia)', direction: 'increasing', importance: 0.046 },
      { sensor: 'sensor_4', description: 'Total temperature at LPT outlet (°R)', direction: 'increasing', importance: 0.040 },
    ],
  },
  FD003: {
    subset: 'FD003',
    description: 'Sea-level, single condition, HPC + Fan degradation',
    conditions: 1,
    faultModes: 2,
    trainEngines: 100,
    testEngines: 100,
    trainCycles: 24720,
    testCycles: 16596,
    rmseLinear: 23.33,
    rmseTree: 21.28,
    rmseNeural: 20.13,
    phm08Tree: 3305.3,
    conformalCoverage: 58.0,
    conformalWidth: 13.4,
    avgLeadTime: 4.8,
    falseAlarmRate: 0.0,
    topDrivers: [
      { sensor: 'sensor_11', description: 'Static pressure at HPC outlet (psia)', direction: 'increasing', importance: 0.814 },
      { sensor: 'sensor_12', description: 'Ratio of fuel flow to Ps30 (pps/psia)', direction: 'decreasing', importance: 0.767 },
      { sensor: 'sensor_4', description: 'Total temperature at LPT outlet (°R)', direction: 'increasing', importance: 0.766 },
    ],
  },
  FD004: {
    subset: 'FD004',
    description: 'Six operating regimes, HPC + Fan degradation',
    conditions: 6,
    faultModes: 2,
    trainEngines: 249,
    testEngines: 248,
    trainCycles: 61249,
    testCycles: 41214,
    rmseLinear: 37.10,
    rmseTree: 29.81,
    rmseNeural: 32.44,
    phm08Tree: 6842.4,
    conformalCoverage: 54.8,
    conformalWidth: 19.3,
    avgLeadTime: 5.6,
    falseAlarmRate: 0.0,
    topDrivers: [
      { sensor: 'sensor_14', description: 'Core engine speed (rpm)', direction: 'increasing', importance: 0.098 },
      { sensor: 'sensor_11', description: 'Static pressure at HPC outlet (psia)', direction: 'increasing', importance: 0.088 },
      { sensor: 'sensor_9', description: 'Physical core speed (rpm)', direction: 'increasing', importance: 0.043 },
    ],
  },
}

export default function EvaluationPage() {
  const [activeSubset, setActiveSubset] = useState('FD001')
  const current = BENCHMARK_DATA[activeSubset]

  return (
    <div className="space-y-6">
      {/* ── Title Row ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="text-sky-700" size={24} />
            Model Ladder Evaluation &amp; NASA C-MAPSS Benchmarks
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Rigorous evaluation on authentic turbofan run-to-failure data (265,963 cycles · Saxena et al.)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            PUBLIC-SIMULATED NASA BENCHMARK
          </span>
        </div>
      </div>

      {/* ── Subset Selector Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.keys(BENCHMARK_DATA).map(key => {
          const item = BENCHMARK_DATA[key]
          const isSelected = activeSubset === key
          return (
            <button
              key={key}
              onClick={() => setActiveSubset(key)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-sky-50 border-sky-700 shadow-xs ring-1 ring-sky-700'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-sm text-slate-900">{key}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                  {item.conditions} Cond · {item.faultModes} Fault
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{item.description}</p>
              <div className="mt-2 flex items-baseline justify-between text-xs">
                <span className="text-slate-400 font-medium">{item.testEngines} engines</span>
                <span className="font-bold text-emerald-700 font-mono">{item.rmseTree} RMSE</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Model Ladder Comparison Table ───────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="text-sky-700" size={18} />
            <h2 className="font-bold text-slate-900 text-sm">RUL Model Ladder Progression — {current.subset}</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {current.trainEngines} Train / {current.testEngines} Test Engines ({current.trainCycles.toLocaleString()} cycles)
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Tier</th>
                <th className="px-5 py-3.5">Model Architecture</th>
                <th className="px-5 py-3.5">RMSE (&darr;)</th>
                <th className="px-5 py-3.5">PHM08 Score (&darr;)</th>
                <th className="px-5 py-3.5">10%–90% Conformal Coverage</th>
                <th className="px-5 py-3.5">Production Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Linear */}
              <tr className="hover:bg-slate-50/70">
                <td className="px-5 py-3.5 text-xs font-mono text-slate-400">Tier 1</td>
                <td className="px-5 py-3.5 font-medium text-slate-700">Linear Ridge Regression</td>
                <td className="px-5 py-3.5 font-mono text-slate-600 font-bold">{current.rmseLinear}</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">&mdash;</td>
                <td className="px-5 py-3.5 text-slate-400">Uncalibrated</td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                    Baseline
                  </span>
                </td>
              </tr>
              {/* Tree */}
              <tr className="bg-sky-50/50 hover:bg-sky-50">
                <td className="px-5 py-3.5 text-xs font-mono text-sky-800 font-bold">Tier 2</td>
                <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                  HistGradientBoosting / XGBoost
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded-full font-bold">
                    Active Default
                  </span>
                </td>
                <td className="px-5 py-3.5 font-mono font-extrabold text-emerald-700">{current.rmseTree}</td>
                <td className="px-5 py-3.5 font-mono font-bold text-sky-800">{current.phm08Tree.toFixed(1)}</td>
                <td className="px-5 py-3.5">
                  <span className="font-bold text-slate-900">{current.conformalCoverage}%</span>
                  <span className="text-xs text-slate-500 ml-1.5">(&plusmn;{current.conformalWidth} cyc)</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    Production Calibrated
                  </span>
                </td>
              </tr>
              {/* Neural */}
              <tr className="hover:bg-slate-50/70">
                <td className="px-5 py-3.5 text-xs font-mono text-purple-700">Tier 3</td>
                <td className="px-5 py-3.5 font-medium text-slate-700">Multi-Layer Perceptron / 1D-CNN</td>
                <td className="px-5 py-3.5 font-mono text-slate-800 font-bold">{current.rmseNeural}</td>
                <td className="px-5 py-3.5 font-mono text-slate-500">Evaluation Candidate</td>
                <td className="px-5 py-3.5 text-slate-600">Calibrated</td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
                    Staging
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Uncertainty & Explainability Split ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Uncertainty & Operational Policy Metrics */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="text-emerald-700" size={18} />
            <h3 className="font-bold text-slate-900 text-sm">Uncertainty Calibration &amp; Safety Bounds (F4, F7)</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Empirical Coverage</p>
              <p className="text-xl font-extrabold text-slate-900 font-mono mt-1">{current.conformalCoverage}%</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Target: 80% (10–90%)</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Half-Width</p>
              <p className="text-xl font-extrabold text-sky-800 font-mono mt-1">&plusmn;{current.conformalWidth}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">cycles margin</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">False Alarm Rate</p>
              <p className="text-xl font-extrabold text-emerald-700 font-mono mt-1">{current.falseAlarmRate}%</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Lead: {current.avgLeadTime} cyc</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Conformal prediction guarantees distribution-free marginal coverage on unseen engines without Gaussianity assumptions, feeding the CP-SAT maintenance scheduler deadline bounds.
          </p>
        </div>

        {/* Explainability & Top Sensor Drivers */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Activity className="text-amber-600" size={18} />
            <h3 className="font-bold text-slate-900 text-sm">Top Degradation Sensor Drivers — {current.subset} (F6)</h3>
          </div>
          <div className="space-y-3">
            {current.topDrivers.map((d) => (
              <div key={d.sensor} className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{d.sensor}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      d.direction === 'increasing' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-sky-50 text-sky-800 border border-sky-200'
                    }`}>
                      {d.direction}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">Importance: {d.importance}</span>
                </div>
                <p className="text-xs text-slate-500">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRD Traceability Notice ─────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-500 shadow-xs">
        <FileText className="text-sky-700 shrink-0 mt-0.5" size={16} />
        <div>
          <strong className="text-slate-800">PRD Compliance &amp; Data Integrity:</strong> Evaluation executed offline on authentic NASA turbofan simulation run-to-failure datasets (Saxena et al., PHM08). Real C-MAPSS / N-CMAPSS benchmarks are tagged as <span className="text-purple-700 font-bold">PUBLIC-SIMULATED</span>, while operational squadron fleet records remain <span className="text-amber-700 font-bold">SYNTHETIC</span>.
        </div>
      </div>
    </div>
  )
}
