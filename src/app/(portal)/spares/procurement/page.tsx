'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Package, Plus, Search, CheckCircle2,
  Clock, AlertTriangle, ShieldCheck, Wrench, X
} from 'lucide-react'

interface ProcurementOrder {
  id: string
  part: string
  desc: string
  subsystem: string
  qty: number
  unit: string
  status: 'pending' | 'ordered' | 'received'
  urgency: 'critical' | 'high' | 'routine'
  supplier: string
  supplierType: 'Domestic HAL' | 'Domestic DRDO' | 'Foreign OEM' | 'Private Tier-1'
  baseDepot: string
  linkedTail?: string
  totalInr: number
  expectedDelivery: string
  requestedBy: string
  approvedBy?: string
  date: string
}

const INITIAL_ORDERS: ProcurementOrder[] = [
  {
    id: 'PO-2026-0842',
    part: 'ENG-BEAR-007',
    desc: 'Main Roller Bearing No. 2',
    subsystem: 'HP Rotor Spool Bearings',
    qty: 4,
    unit: 'EA',
    status: 'pending',
    urgency: 'critical',
    supplier: 'Safran Aircraft Engines Gennevilliers',
    supplierType: 'Foreign OEM',
    baseDepot: 'Ambala AFB',
    linkedTail: 'A-001',
    totalInr: 9800000,
    expectedDelivery: '2026-11-12',
    requestedBy: 'Wing Commander S. Nair',
    date: '2026-10-18',
  },
  {
    id: 'PO-2026-0839',
    part: 'HYD-VALVE-004',
    desc: 'Electro-Hydraulic Servo Valve (Canard Actuator)',
    subsystem: 'Fly-By-Wire Flight Controls',
    qty: 6,
    unit: 'EA',
    status: 'pending',
    urgency: 'critical',
    supplier: 'Dynamatic Technologies Bengaluru',
    supplierType: 'Private Tier-1',
    baseDepot: 'Jodhpur AFB',
    linkedTail: 'A-008',
    totalInr: 5520000,
    expectedDelivery: '2026-11-06',
    requestedBy: 'Squadron Ldr. A. Kulkarni',
    date: '2026-10-17',
  },
  {
    id: 'PO-2026-0831',
    part: 'ENG-BLADE-001',
    desc: 'High-Pressure Single-Crystal Turbine Blade Set',
    subsystem: 'Kaveri / Snecma M88 Turbofan',
    qty: 8,
    unit: 'SET',
    status: 'ordered',
    urgency: 'high',
    supplier: 'HAL Engine Division Koraput',
    supplierType: 'Domestic HAL',
    baseDepot: 'Ambala AFB',
    linkedTail: 'A-007',
    totalInr: 14800000,
    expectedDelivery: '2026-11-02',
    requestedBy: 'Flight Lt. V. Raghavan',
    approvedBy: 'Group Captain R. Sengupta',
    date: '2026-10-14',
  },
  {
    id: 'PO-2026-0824',
    part: 'LG-BRAKE-002',
    desc: 'Carbon Brake Stator Assembly Pack',
    subsystem: 'Main Landing Gear Wheels & Brakes',
    qty: 12,
    unit: 'SET',
    status: 'ordered',
    urgency: 'high',
    supplier: 'HAL Accessories Division Lucknow',
    supplierType: 'Domestic HAL',
    baseDepot: 'Chandigarh AFB',
    totalInr: 13440000,
    expectedDelivery: '2026-10-29',
    requestedBy: 'Flight Lt. K. Deshmukh',
    approvedBy: 'Wing Commander S. Nair',
    date: '2026-10-11',
  },
  {
    id: 'PO-2026-0810',
    part: 'ENG-NOZZLE-012',
    desc: 'Dual Fuel Spray Injection Nozzle Set',
    subsystem: 'Combustion Annular Liner',
    qty: 16,
    unit: 'SET',
    status: 'received',
    urgency: 'routine',
    supplier: 'DRDO GTRE Bengaluru',
    supplierType: 'Domestic DRDO',
    baseDepot: 'Jodhpur AFB',
    totalInr: 12480000,
    expectedDelivery: '2026-10-15',
    requestedBy: 'Junior Warrant Officer P. Rao',
    approvedBy: 'Wing Commander S. Nair',
    date: '2026-10-02',
  },
]

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Approval',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  ordered: {
    label: 'Ordered / In Transit',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    dot: 'bg-blue-500 animate-pulse',
  },
  received: {
    label: 'Received & Cleared',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
  },
}

export default function Procurement() {
  const [orders, setOrders] = useState<ProcurementOrder[]>(INITIAL_ORDERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ProcurementOrder['status']>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const metrics = useMemo(() => {
    const total = orders.length
    const pending = orders.filter((o) => o.status === 'pending').length
    const critical = orders.filter((o) => o.urgency === 'critical').length
    const inTransit = orders.filter((o) => o.status === 'ordered').length
    const totalCapitalInr = orders.reduce((sum, o) => sum + o.totalInr, 0)

    return {
      total,
      pending,
      critical,
      inTransit,
      totalCapitalCr: (totalCapitalInr / 10000000).toFixed(2),
    }
  }, [orders])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          o.id.toLowerCase().includes(q) ||
          o.part.toLowerCase().includes(q) ||
          o.desc.toLowerCase().includes(q) ||
          o.supplier.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [orders, statusFilter, search])

  const handleApprovePO = async (id: string) => {
    try {
      await fetch(`/api/v1/spares/procurement/${id}/approve`, { method: 'POST' })
    } catch {}
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'ordered',
              approvedBy: 'Wing Commander S. Nair',
            }
          : o
      )
    )
    setToastMessage(`Purchase Order ${id} signed off by Wing Commander S. Nair and issued to vendor.`)
    setTimeout(() => setToastMessage(null), 5000)
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#dce3e6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/spares"
              className="p-1.5 rounded-lg bg-white border border-[#dce3e6] text-[#4d606a] hover:text-[#173747] hover:bg-slate-50 transition-colors shadow-2xs mr-1"
            >
              <ArrowLeft size={14} />
            </Link>
            <span className="text-[10px] font-bold text-[#1a4d4a] bg-[#e8f4f3] border border-[#c5e3e0] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              MATERIAL SUPPLY CHAIN · PROCUREMENT
            </span>
            <span className="text-xs text-[#77878f] font-mono">FINANCIAL YEAR 2026-27</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173747] font-heading tracking-tight">
            Defense Aviation Procurement Pipeline
          </h1>
          <p className="text-sm text-[#4d606a] mt-0.5">
            Automated requisitions generated from Weibull prognostic failure bounds and base stockouts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/spares"
            className="btn btn-secondary text-xs shadow-2xs font-semibold flex items-center gap-1.5"
          >
            <Package size={14} />
            <span>Spares Catalog</span>
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
        <div className="surface-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pending Sign-off</span>
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{metrics.pending}</p>
            <span className="text-xs font-semibold text-amber-700">Awaiting Approval</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Requires MEO sign-off</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">In Transit (PO)</span>
            <Clock size={16} className="text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{metrics.inTransit}</p>
            <span className="text-xs font-semibold text-blue-700">Vendor Dispatched</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">HAL &amp; foreign shipments</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-red-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">AOG Urgency Lines</span>
            <ShieldCheck size={16} className="text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{metrics.critical}</p>
            <span className="text-xs font-semibold text-red-700">High Risk</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Directly tied to grounded airframes</p>
        </div>

        <div className="surface-card p-5 border-l-4 border-l-[#1a4d4a]">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Commitment</span>
            <Package size={16} className="text-[#1a4d4a]" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">&#8377;{metrics.totalCapitalCr} Cr</p>
            <span className="text-xs font-semibold text-[#1a4d4a] font-mono">Allocated</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Capital equipment reserve</p>
        </div>
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────── */}
      <div className="surface-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PO number, part, supplier, or airframe..."
              className="gov-input pl-9 text-xs py-2 w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'pending', 'ordered', 'received'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st as any)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all capitalize ${
                  statusFilter === st
                    ? 'bg-[#1a4d4a] text-white border-[#1a4d4a] shadow-xs'
                    : 'bg-white text-[#4d606a] border-[#dce3e6] hover:bg-slate-50'
                }`}
              >
                {st === 'all' ? 'All Orders' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Orders Table ──────────────────────────────────────────────── */}
      <div className="comp-table-container">
        <div className="overflow-x-auto">
          <table className="comp-table">
            <thead>
              <tr>
                <th className="comp-th-feature" style={{ width: '22%' }}>PO Number &amp; Item</th>
                <th className="comp-th-feature" style={{ width: '20%' }}>Supplier &amp; Source</th>
                <th className="comp-th-feature" style={{ width: '16%' }}>Depot &amp; Quantity</th>
                <th className="comp-th-feature" style={{ width: '16%' }}>Financial Total</th>
                <th className="comp-th-feature" style={{ width: '14%' }}>Delivery Window</th>
                <th className="comp-th-feature" style={{ width: '12%', textAlign: 'right' }}>Sign-off</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status]
                const isPending = order.status === 'pending'

                return (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="comp-td-feature">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#173747] font-mono text-sm">{order.id}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border font-mono ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#173747] mt-1">{order.part}</p>
                        <p className="text-[11px] text-[#4d606a] leading-tight">{order.desc}</p>
                        {order.linkedTail && (
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1 rounded inline-block mt-1">
                            Airframe: {order.linkedTail}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="comp-td-feature">
                      <p className="text-xs font-bold text-[#173747]">{order.supplier}</p>
                      <span className="text-[10px] text-slate-500 font-mono">{order.supplierType}</span>
                    </td>

                    <td className="comp-td-feature">
                      <p className="text-xs font-bold text-[#173747]">{order.baseDepot}</p>
                      <p className="text-xs font-mono text-[#4d606a] mt-0.5">
                        {order.qty} {order.unit}
                      </p>
                    </td>

                    <td className="comp-td-feature">
                      <p className="text-xs font-extrabold font-mono text-[#173747]">
                        &#8377;{(order.totalInr / 100000).toFixed(2)} L
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">Date: {order.date}</span>
                    </td>

                    <td className="comp-td-feature">
                      <p className="text-xs font-bold font-mono text-[#173747]">{order.expectedDelivery}</p>
                      <p className="text-[10px] text-[#77878f]">Req: {order.requestedBy}</p>
                    </td>

                    <td className="comp-td-feature text-right">
                      {isPending ? (
                        <button
                          onClick={() => handleApprovePO(order.id)}
                          className="btn btn-primary text-xs px-3 py-1 font-semibold rounded-lg shadow-2xs"
                        >
                          Sign PO
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                          APPROVED
                        </span>
                      )}
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
