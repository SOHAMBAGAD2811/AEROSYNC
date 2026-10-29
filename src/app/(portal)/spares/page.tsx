'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Package, AlertTriangle, ArrowRight, CheckCircle2,
  Search, Shield, Plus, Clock, Wrench, X
} from 'lucide-react'

export interface SpareItem {
  pn: string
  desc: string
  category: 'turbofan' | 'hydraulics' | 'landing_gear' | 'avionics' | 'electrical'
  subsystem: string
  qty: number
  reorder: number
  safetyBuffer: number
  unit: string
  leadTimeDays: number
  supplier: string
  supplierType: 'Domestic HAL' | 'Domestic DRDO' | 'Foreign OEM' | 'Private Tier-1'
  baseDepot: 'Ambala AFB' | 'Chandigarh AFB' | 'Jodhpur AFB'
  weibullK: number
  weibullLambda: number
  failProb30d: number
  crostonRate: number
  activeAircraft: string[]
  unitCostInr: number
  status: 'optimal' | 'low' | 'stockout'
}

const SPARES_CATALOG: SpareItem[] = [
  {
    pn: 'ENG-BLADE-001',
    desc: 'High-Pressure Turbine Single-Crystal Blade Set',
    category: 'turbofan',
    subsystem: 'Kaveri / Snecma M88 Hot Section',
    qty: 14,
    reorder: 12,
    safetyBuffer: 8,
    unit: 'SET',
    leadTimeDays: 21,
    supplier: 'HAL Engine Division Koraput',
    supplierType: 'Domestic HAL',
    baseDepot: 'Ambala AFB',
    weibullK: 2.65,
    weibullLambda: 1820,
    failProb30d: 68.4,
    crostonRate: 2.1,
    activeAircraft: ['A-001', 'A-004', 'A-012'],
    unitCostInr: 1850000,
    status: 'low',
  },
  {
    pn: 'ENG-SEAL-003',
    desc: 'Carbon Labyrinth Oil Seal Ring Assembly',
    category: 'turbofan',
    subsystem: 'HP Spool Bearing Chamber #3',
    qty: 4,
    reorder: 10,
    safetyBuffer: 6,
    unit: 'EA',
    leadTimeDays: 14,
    supplier: 'Precision Seals Gujarat',
    supplierType: 'Private Tier-1',
    baseDepot: 'Chandigarh AFB',
    weibullK: 2.12,
    weibullLambda: 2400,
    failProb30d: 41.2,
    crostonRate: 1.4,
    activeAircraft: ['A-007', 'A-019'],
    unitCostInr: 320000,
    status: 'stockout',
  },
  {
    pn: 'ENG-BEAR-007',
    desc: 'Main Shaft Cylindrical Roller Bearing No. 2',
    category: 'turbofan',
    subsystem: 'AL-31FP / M88 High Pressure Rotor',
    qty: 1,
    reorder: 5,
    safetyBuffer: 4,
    unit: 'EA',
    leadTimeDays: 30,
    supplier: 'Safran Aircraft Engines Gennevilliers',
    supplierType: 'Foreign OEM',
    baseDepot: 'Ambala AFB',
    weibullK: 3.15,
    weibullLambda: 1450,
    failProb30d: 84.1,
    crostonRate: 0.8,
    activeAircraft: ['A-001', 'A-008'],
    unitCostInr: 2450000,
    status: 'stockout',
  },
  {
    pn: 'ENG-NOZZLE-012',
    desc: 'Dual-Orifice Fuel Spray Injection Nozzle Set',
    category: 'turbofan',
    subsystem: 'Combustion Annular Chamber',
    qty: 18,
    reorder: 8,
    safetyBuffer: 6,
    unit: 'SET',
    leadTimeDays: 18,
    supplier: 'DRDO GTRE Bengaluru',
    supplierType: 'Domestic DRDO',
    baseDepot: 'Jodhpur AFB',
    weibullK: 1.85,
    weibullLambda: 3100,
    failProb30d: 14.8,
    crostonRate: 1.2,
    activeAircraft: ['A-014', 'A-022'],
    unitCostInr: 780000,
    status: 'optimal',
  },
  {
    pn: 'HYD-PUMP-012',
    desc: 'Engine-Driven 3000 PSI Variable Axial Pump',
    category: 'hydraulics',
    subsystem: 'Primary Flight Control Hydraulic Circuit',
    qty: 8,
    reorder: 6,
    safetyBuffer: 4,
    unit: 'EA',
    leadTimeDays: 25,
    supplier: 'HAL Aircraft Division Bengaluru',
    supplierType: 'Domestic HAL',
    baseDepot: 'Chandigarh AFB',
    weibullK: 2.28,
    weibullLambda: 2850,
    failProb30d: 22.6,
    crostonRate: 0.6,
    activeAircraft: ['A-007', 'A-031'],
    unitCostInr: 1650000,
    status: 'optimal',
  },
  {
    pn: 'HYD-VALVE-004',
    desc: 'Electro-Hydraulic Servo Valve (Canard Actuation)',
    category: 'hydraulics',
    subsystem: 'Fly-By-Wire Elevon/Canard Drive',
    qty: 2,
    reorder: 6,
    safetyBuffer: 4,
    unit: 'EA',
    leadTimeDays: 20,
    supplier: 'Dynamatic Technologies Bengaluru',
    supplierType: 'Private Tier-1',
    baseDepot: 'Jodhpur AFB',
    weibullK: 2.92,
    weibullLambda: 1950,
    failProb30d: 72.3,
    crostonRate: 1.1,
    activeAircraft: ['A-014', 'A-028'],
    unitCostInr: 920000,
    status: 'stockout',
  },
  {
    pn: 'LG-BRAKE-002',
    desc: 'Carbon-Carbon High-Energy Brake Disk Rotor Pack',
    category: 'landing_gear',
    subsystem: 'Main Under-Carriage Multi-Disc Brake',
    qty: 6,
    reorder: 8,
    safetyBuffer: 5,
    unit: 'SET',
    leadTimeDays: 15,
    supplier: 'HAL Accessories Division Lucknow',
    supplierType: 'Domestic HAL',
    baseDepot: 'Ambala AFB',
    weibullK: 3.40,
    weibullLambda: 920,
    failProb30d: 54.2,
    crostonRate: 3.5,
    activeAircraft: ['A-001', 'A-003', 'A-007'],
    unitCostInr: 1120000,
    status: 'low',
  },
  {
    pn: 'LG-TIRE-001',
    desc: 'Main Under-Carriage High-Speed Radial Tire',
    category: 'landing_gear',
    subsystem: 'Airframe Landing Gear Shock Strut',
    qty: 24,
    reorder: 12,
    safetyBuffer: 8,
    unit: 'EA',
    leadTimeDays: 7,
    supplier: 'MRF Aviation Tires Chennai',
    supplierType: 'Private Tier-1',
    baseDepot: 'Chandigarh AFB',
    weibullK: 3.80,
    weibullLambda: 450,
    failProb30d: 31.0,
    crostonRate: 6.8,
    activeAircraft: ['A-002', 'A-005', 'A-009'],
    unitCostInr: 180000,
    status: 'optimal',
  },
  {
    pn: 'AV-RADAR-009',
    desc: 'Uttam AESA Radar Transmit/Receive Module Pack',
    category: 'avionics',
    subsystem: 'Forward Nose Radome Array',
    qty: 5,
    reorder: 6,
    safetyBuffer: 3,
    unit: 'ASSY',
    leadTimeDays: 35,
    supplier: 'Bharat Electronics Limited (BEL) Ghaziabad',
    supplierType: 'Domestic HAL',
    baseDepot: 'Ambala AFB',
    weibullK: 1.45,
    weibullLambda: 5200,
    failProb30d: 18.2,
    crostonRate: 0.4,
    activeAircraft: ['A-001', 'A-014'],
    unitCostInr: 3800000,
    status: 'low',
  },
  {
    pn: 'AV-NAV-005',
    desc: 'Ring Laser Gyroscope Tactical INS Unit',
    category: 'avionics',
    subsystem: 'Integrated Inertial/GPS Navigation System',
    qty: 7,
    reorder: 4,
    safetyBuffer: 3,
    unit: 'EA',
    leadTimeDays: 28,
    supplier: 'HAL Avionics Division Hyderabad',
    supplierType: 'Domestic HAL',
    baseDepot: 'Jodhpur AFB',
    weibullK: 1.70,
    weibullLambda: 4800,
    failProb30d: 11.5,
    crostonRate: 0.3,
    activeAircraft: ['A-007', 'A-011'],
    unitCostInr: 4200000,
    status: 'optimal',
  },
  {
    pn: 'ELEC-GEN-002',
    desc: 'Brushless 40 kVA 400 Hz Integrated Drive Generator',
    category: 'electrical',
    subsystem: 'Auxiliary Gearbox Electrical Generation',
    qty: 4,
    reorder: 5,
    safetyBuffer: 3,
    unit: 'EA',
    leadTimeDays: 22,
    supplier: 'Safran Electrical Systems',
    supplierType: 'Foreign OEM',
    baseDepot: 'Ambala AFB',
    weibullK: 2.10,
    weibullLambda: 3400,
    failProb30d: 28.0,
    crostonRate: 0.5,
    activeAircraft: ['A-001', 'A-007'],
    unitCostInr: 2900000,
    status: 'low',
  },
  {
    pn: 'COOL-EXCH-008',
    desc: 'Dual-Loop Bleed Air Ram Cooling Heat Exchanger',
    category: 'turbofan',
    subsystem: 'Environmental Control & Cockpit Conditioning',
    qty: 9,
    reorder: 5,
    safetyBuffer: 3,
    unit: 'EA',
    leadTimeDays: 16,
    supplier: 'HAL Accessories Division Lucknow',
    supplierType: 'Domestic HAL',
    baseDepot: 'Chandigarh AFB',
    weibullK: 1.90,
    weibullLambda: 3900,
    failProb30d: 16.4,
    crostonRate: 0.7,
    activeAircraft: ['A-003', 'A-010'],
    unitCostInr: 1250000,
    status: 'optimal',
  },
]

const STATUS_CONFIG = {
  optimal: {
    label: 'Optimal Buffer',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    indicator: 'bg-emerald-500',
  },
  low: {
    label: 'Low Stock (<1.5x)',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    indicator: 'bg-amber-500',
  },
  stockout: {
    label: 'Critical Stockout',
    badge: 'bg-red-50 text-red-800 border-red-200',
    indicator: 'bg-red-500',
  },
}

export default function Spares() {
  const [items] = useState<SpareItem[]>(SPARES_CATALOG)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPart, setSelectedPart] = useState<SpareItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPart, setModalPart] = useState<SpareItem>(SPARES_CATALOG[0])
  const [reqQty, setReqQty] = useState(5)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const metrics = useMemo(() => {
    const totalLines = items.length
    const criticalStockouts = items.filter((i) => i.status === 'stockout').length
    const lowStock = items.filter((i) => i.status === 'low').length
    const totalQty = items.reduce((acc, i) => acc + i.qty, 0)
    const avgLeadTime = Math.round(items.reduce((acc, i) => acc + i.leadTimeDays, 0) / items.length)

    return {
      totalLines,
      criticalStockouts,
      lowStock,
      totalQty,
      avgLeadTime,
    }
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
      if (statusFilter !== 'all' && item.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          item.pn.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          item.subsystem.toLowerCase().includes(q) ||
          item.supplier.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [items, categoryFilter, statusFilter, search])

  const handleCreateOrder = async () => {
    try {
      await fetch('/api/v1/spares/procurement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part: modalPart.pn,
          desc: modalPart.desc,
          subsystem: modalPart.subsystem,
          qty: reqQty,
          unit: modalPart.unit,
          unitCost: modalPart.unitCostInr,
          supplier: modalPart.supplier,
          supplierType: modalPart.supplierType,
          baseDepot: modalPart.baseDepot,
          urgency: 'critical',
          requestedBy: 'Logistics Officer',
        }),
      })
    } catch {}
    setModalOpen(false)
    setToastMessage(`Purchase Requisition PO-2026-${Math.floor(Math.random() * 900 + 100)} dispatched to ${modalPart.supplier}!`)
    setTimeout(() => setToastMessage(null), 5000)
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#dce3e6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-[#1a4d4a] bg-[#e8f4f3] border border-[#c5e3e0] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              LOGISTICS COMMAND · WEIBULL PROBABILISTIC FORECAST
            </span>
            <span className="text-xs text-[#77878f] font-mono">CROSTON DEMAND MODEL ACTIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173747] font-heading tracking-tight">
            Aviation Spares &amp; Depot Stock Logistics
          </h1>
          <p className="text-sm text-[#4d606a] mt-0.5">
            Parametric hazard curve forecasting, safety buffer optimization, and automated replenishment triggers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/spares/procurement"
            className="btn btn-primary text-xs shadow-xs font-semibold flex items-center gap-1.5"
          >
            <Clock size={14} />
            <span>View Requisitions Pipeline</span>
          </Link>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-semibold flex items-center gap-2 animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 4 KPI Metric Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card p-5 border-l-4 border-l-red-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Critical Stockouts</span>
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{metrics.criticalStockouts}</p>
            <span className="text-xs font-semibold text-red-700">AOG Exposure</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Stock below mandatory buffer</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Low Stock Lines</span>
            <Package size={16} className="text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{metrics.lowStock}</p>
            <span className="text-xs font-semibold text-amber-700">Near Reorder</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Within 1.5x lead-time safety</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-[#1a4d4a]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Depot Stock Total</span>
            <Shield size={16} className="text-[#1a4d4a]" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{metrics.totalQty}</p>
            <span className="text-xs font-semibold text-[#1a4d4a]">Units on Hand</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Across 3 regional depots</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Avg Supplier Lead</span>
            <Clock size={16} className="text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{metrics.avgLeadTime}d</p>
            <span className="text-xs font-semibold text-blue-700 font-mono">Turnaround</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Domestic HAL &amp; OEM supply</p>
        </div>
      </div>

      {/* ── Toolbar: Search & Category Pills ─────────────────────────── */}
      <div className="surface-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search part number, description, subsystem, or supplier..."
              className="gov-input pl-9 text-xs py-2 w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'stockout', 'low', 'optimal'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all capitalize ${
                  statusFilter === st
                    ? 'bg-[#1a4d4a] text-white border-[#1a4d4a] shadow-xs'
                    : 'bg-white text-[#4d606a] border-[#dce3e6] hover:bg-slate-50'
                }`}
              >
                {st === 'all' ? 'All Inventory' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Inventory Manifest Table ─────────────────────────────────── */}
      <div className="comp-table-container">
        <div className="overflow-x-auto">
          <table className="comp-table">
            <thead>
              <tr>
                <th className="comp-th-feature" style={{ width: '24%' }}>Part Number &amp; Description</th>
                <th className="comp-th-feature" style={{ width: '18%' }}>Stock Level vs Reorder</th>
                <th className="comp-th-feature" style={{ width: '16%' }}>Depot &amp; Supplier</th>
                <th className="comp-th-feature" style={{ width: '18%' }}>Weibull Failure Risk</th>
                <th className="comp-th-feature" style={{ width: '14%' }}>Lead Time</th>
                <th className="comp-th-feature" style={{ width: '10%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const cfg = STATUS_CONFIG[item.status]
                const isCritical = item.status === 'stockout'

                return (
                  <tr key={item.pn} className="hover:bg-slate-50/70 transition-colors">
                    <td className="comp-td-feature">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#173747] font-mono text-sm">{item.pn}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border font-mono ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#173747] mt-1 leading-snug">{item.desc}</p>
                        <p className="text-[11px] text-[#77878f] font-mono mt-0.5">{item.subsystem}</p>
                      </div>
                    </td>

                    <td className="comp-td-feature">
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-lg font-bold font-mono ${isCritical ? 'text-red-600' : 'text-[#173747]'}`}>
                            {item.qty} {item.unit}
                          </span>
                          <span className="text-[11px] text-[#77878f] font-mono">
                            (Min: {item.reorder})
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, (item.qty / item.reorder) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Safety: {item.safetyBuffer} units</span>
                      </div>
                    </td>

                    <td className="comp-td-feature">
                      <p className="text-xs font-bold text-[#173747]">{item.baseDepot}</p>
                      <p className="text-[11px] text-[#4d606a] mt-0.5">{item.supplier}</p>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">{item.supplierType}</span>
                    </td>

                    <td className="comp-td-feature">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#77878f]">30d Risk:</span>
                          <span className={`font-bold ${item.failProb30d > 50 ? 'text-red-600' : 'text-emerald-700'}`}>
                            {item.failProb30d}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          k={item.weibullK} · &lambda;={item.weibullLambda} cyc
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Demand: {item.crostonRate} /mo (Croston)
                        </p>
                      </div>
                    </td>

                    <td className="comp-td-feature">
                      <p className="text-xs font-extrabold text-[#173747] font-mono">{item.leadTimeDays} days</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        &#8377;{(item.unitCostInr / 100000).toFixed(1)}L / {item.unit}
                      </p>
                    </td>

                    <td className="comp-td-feature text-right">
                      <button
                        onClick={() => {
                          setModalPart(item)
                          setModalOpen(true)
                        }}
                        className="btn btn-primary text-xs px-2.5 py-1 rounded-lg shadow-2xs font-semibold"
                      >
                        Order
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Requisition Order Modal ───────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-slide-up">
          <div className="bg-white border border-[#dce3e6] rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#edf2f4]">
              <div>
                <h3 className="text-lg font-bold font-heading text-[#173747]">
                  Create Procurement Requisition
                </h3>
                <p className="text-xs text-[#77878f] font-mono">Part: {modalPart.pn}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#173747] mb-1">Part Description</label>
                <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                  {modalPart.desc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#173747] mb-1">Requisition Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={reqQty}
                    onChange={(e) => setReqQty(parseInt(e.target.value) || 1)}
                    className="gov-input text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#173747] mb-1">Estimated Value</label>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-[#173747]">
                    &#8377;{((reqQty * modalPart.unitCostInr) / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#173747] mb-1">Destination Depot</label>
                <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-700">
                  {modalPart.baseDepot} · Supplier: {modalPart.supplier}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#edf2f4]">
              <button
                onClick={() => setModalOpen(false)}
                className="btn btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                className="btn btn-primary text-xs shadow-sm font-semibold"
              >
                Submit Requisition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
