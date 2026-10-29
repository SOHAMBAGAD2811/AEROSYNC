'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Wrench, Plane, Activity,
  CheckCircle2, Clock, ShieldCheck
} from 'lucide-react'

export default function AircraftDetail() {
  const params = useParams()
  const tail = (params?.id as string) || 'A-001'

  const subsystems = [
    {
      name: 'Turbofan Engine #1 (Port)',
      sn: 'ENG-SN-0042',
      type: 'Kaveri / Snecma M88-4E',
      status: 'Prognostic Alert',
      rul: '18 cycles',
      interval: '[10–28 conformal bound]',
      healthScore: 42,
      driver: 'Ps30 HPC pressure ratio (-2.4% delta)',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500 animate-pulse',
    },
    {
      name: 'Turbofan Engine #2 (Starboard)',
      sn: 'ENG-SN-0089',
      type: 'Kaveri / Snecma M88-4E',
      status: 'Nominal',
      rul: '85 cycles',
      interval: '[74–96 conformal bound]',
      healthScore: 91,
      driver: 'All 21 NASA C-MAPSS channels within 1σ nominal',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    {
      name: 'Multi-Link Undercarriage Landing Gear',
      sn: 'LG-SN-0112',
      type: 'Messier-Bugatti Hydraulic Assembly',
      status: 'Watch Interval',
      rul: '52 cycles',
      interval: '[40–66 conformal bound]',
      healthScore: 78,
      driver: 'Brake cylinder retraction latency (+120ms)',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      dot: 'bg-blue-500',
    },
    {
      name: 'AESA Phased Array Radar & Avionics',
      sn: 'RAD-SN-0034',
      type: 'Uttam AESA Active Sensor Array',
      status: 'Nominal',
      rul: '140+ cycles',
      interval: '[120–160 conformal bound]',
      healthScore: 98,
      driver: 'Liquid cooling loop flow rate optimal',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500',
    },
  ]

  const workOrders = [
    {
      id: 'WO-2026-0842',
      type: 'High-Pressure Compressor Endoscopy & Borescope Inspection',
      slot: '2026-10-28',
      hangar: 'Ambala AFB · Hangar Bay Alpha',
      status: 'Approved',
      priority: 'Sortie Critical',
    },
    {
      id: 'WO-2026-0819',
      type: 'Oil Filter Particle Analysis & Spectrometry Check',
      slot: '2026-11-04',
      hangar: 'Chandigarh Base Repair Depot',
      status: 'Draft',
      priority: 'Routine Watch',
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Title ────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#dce3e6]">
        <div className="flex items-center gap-3.5">
          <Link
            href="/aircraft"
            className="p-2 rounded-xl bg-white border border-[#dce3e6] text-[#4d606a] hover:text-[#173747] hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold text-[#1a4d4a] bg-[#e8f4f3] border border-[#c5e3e0] px-2 py-0.5 rounded uppercase">
                TAIL SPECIFICATION
              </span>
              <span className="text-xs text-[#77878f] font-mono">AMBALA AIRBASE · WING NO. 17</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173747] font-heading tracking-tight flex items-center gap-3">
              <span>Airframe Diagnostic File</span>
              <span className="font-mono text-emerald-700 font-extrabold">{tail}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/twin"
            className="btn btn-secondary text-xs shadow-2xs font-semibold flex items-center gap-1.5"
          >
            <Plane size={14} className="text-[#1a4d4a]" />
            <span>Launch 3D CAD Jet</span>
          </Link>
          <Link
            href="/schedule"
            className="btn btn-primary text-xs shadow-xs font-semibold flex items-center gap-1.5"
          >
            <Wrench size={14} />
            <span>Schedule Bay Entry</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Telemetry Quick Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Conformal RUL</span>
            <Activity size={16} className="text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#173747] font-mono">18 Cycles</p>
          <p className="text-xs text-amber-700 font-semibold mt-0.5">Coverage bound [10–28 cyc]</p>
          <p className="text-[11px] text-[#77878f] mt-1">Engine #1 HPC delta alert</p>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Exhaust Temp (T50)</span>
            <Clock size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#173747] font-mono">1,382°C</p>
          <p className="text-xs text-emerald-700 font-semibold mt-0.5">Within 1,420°C redline</p>
          <p className="text-[11px] text-[#77878f] mt-1">Sensor channel: sensor_4</p>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Vibration Amplitude</span>
            <ShieldCheck size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#173747] font-mono">1.42 mm/s</p>
          <p className="text-xs text-blue-700 font-semibold mt-0.5">ISO 10816 Zone A (Good)</p>
          <p className="text-[11px] text-[#77878f] mt-1">Main rotor bearing No. 2</p>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Flight Hours</span>
            <Plane size={16} className="text-[#1a4d4a]" />
          </div>
          <p className="text-2xl font-extrabold text-[#173747] font-mono">1,877.5 hrs</p>
          <p className="text-xs text-[#1a4d4a] font-semibold mt-0.5">Sortie: 28 Sep 2026</p>
          <p className="text-[11px] text-[#77878f] mt-1">Next depot 2,000h check</p>
        </div>
      </div>

      {/* ── Subsystems Diagnostic Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf2f4]">
            <h2 className="text-base font-bold text-[#173747] flex items-center gap-2">
              <Plane size={18} className="text-[#1a4d4a]" />
              <span>Monitored Avionics &amp; Turbofan Subsystems</span>
            </h2>
            <span className="text-xs font-mono text-[#77878f]">21-Channel NASA C-MAPSS Ingestion</span>
          </div>

          <div className="space-y-3">
            {subsystems.map((sub) => (
              <div
                key={sub.sn}
                className="p-4 rounded-xl border border-[#dce3e6] hover:border-[#1a4d4a] transition-all bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#173747]">{sub.name}</h3>
                    <p className="text-xs text-[#77878f] font-mono">
                      Serial: {sub.sn} · Spec: {sub.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${sub.color}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${sub.dot}`} />
                      {sub.status}
                    </span>
                    <span className="text-xs font-bold font-mono text-[#173747]">{sub.rul}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-[#4d606a]">
                    <strong>SHAP Attribution:</strong> {sub.driver}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">{sub.interval}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf2f4]">
            <h2 className="text-base font-bold text-[#173747] flex items-center gap-2">
              <Wrench size={18} className="text-amber-600" />
              <span>Active Work Orders</span>
            </h2>
            <Link href="/work-orders" className="text-xs text-[#1a4d4a] font-semibold hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {workOrders.map((wo) => (
              <div key={wo.id} className="p-3.5 rounded-xl border border-[#dce3e6] bg-[#f8fafb] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#173747]">{wo.id}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {wo.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#173747] leading-snug">{wo.type}</p>
                <div className="text-[11px] text-[#77878f] flex items-center justify-between pt-1 border-t border-slate-200">
                  <span>Slot: {wo.slot}</span>
                  <span className="text-red-700 font-semibold">{wo.priority}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#e8f4f3] border border-[#c5e3e0] text-xs text-[#1a4d4a] space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Digital Twin Ready</span>
            </p>
            <p className="text-[11px] text-[#4d606a]">
              WebGL CAD model available with real-time 3D hotspot projection for engine and landing gear.
            </p>
            <Link
              href="/twin"
              className="inline-block mt-2 font-bold text-xs text-[#1a4d4a] underline"
            >
              Open 3D Digital Twin Viewer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
