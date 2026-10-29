'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ClipboardList, Plus, Search,
  AlertTriangle, Wrench, X, ChevronRight, UserCheck
} from 'lucide-react'

interface WorkOrderItem {
  id: string
  tail: string
  model: string
  component: string
  serial: string
  scope: string
  priority: 'critical' | 'high' | 'routine'
  status: 'draft' | 'approved' | 'in_progress' | 'completed'
  assignedBase: string
  hangarBay: string
  targetDate: string
  durationDays: number
  leadOfficer: string
  approvalLead: string
}

const INITIAL_WORK_ORDERS: WorkOrderItem[] = [
  {
    id: 'WO-2026-0842',
    tail: 'A-001',
    model: 'Dassault Rafale F3R',
    component: 'Port Turbofan Engine #1',
    serial: 'ENG-SN-0042',
    scope: 'High-Pressure Compressor Stage 4 Borescope Endoscopy & Blade Dye Check',
    priority: 'critical',
    status: 'approved',
    assignedBase: 'Ambala AFB',
    hangarBay: 'Hangar Bay Alpha 1',
    targetDate: '2026-10-28',
    durationDays: 2,
    leadOfficer: 'Flight Lt. V. Raghavan',
    approvalLead: 'Wing Commander S. Nair',
  },
  {
    id: 'WO-2026-0839',
    tail: 'A-007',
    model: 'Su-30MKI Flanker-H',
    component: 'Starboard Turbofan Engine #2',
    serial: 'ENG-SN-0091',
    scope: 'Low-Pressure Turbine Thermal Barrier Coating Recoat & Spectrometry',
    priority: 'high',
    status: 'draft',
    assignedBase: 'Jodhpur AFB',
    hangarBay: 'Station Depot S2',
    targetDate: '2026-11-04',
    durationDays: 4,
    leadOfficer: 'Squadron Ldr. A. Kulkarni',
    approvalLead: 'Awaiting Sign-off',
  },
  {
    id: 'WO-2026-0835',
    tail: 'A-014',
    model: 'LCA Tejas Mk1A',
    component: 'Bypass Ducting Assembly',
    serial: 'ENG-SN-0033',
    scope: 'Bypass Duct Ring Seal Refit and Bleed Air Pressure Leak Sensor Test',
    priority: 'routine',
    status: 'in_progress',
    assignedBase: 'Chandigarh AFB',
    hangarBay: 'Base Hangar Beta 2',
    targetDate: '2026-10-22',
    durationDays: 1,
    leadOfficer: 'Flight Lt. P. Sengupta',
    approvalLead: 'Wing Commander M. Rao',
  },
  {
    id: 'WO-2026-0829',
    tail: 'A-022',
    model: 'Mirage 2000-5',
    component: 'Main Landing Gear Undercarriage',
    serial: 'LG-SN-0112',
    scope: 'Hydraulic Retraction Actuator Flushing & Seal Replacement',
    priority: 'routine',
    status: 'completed',
    assignedBase: 'Jodhpur AFB',
    hangarBay: 'Hangar Bay Charlie',
    targetDate: '2026-10-14',
    durationDays: 2,
    leadOfficer: 'Flight Lt. V. Raghavan',
    approvalLead: 'Group Captain K. Verma',
  },
  {
    id: 'WO-2026-0824',
    tail: 'A-031',
    model: 'MiG-29UPG Fulcrum',
    component: 'Accessory Gearbox Drive Unit',
    serial: 'ENG-SN-0078',
    scope: 'Gearbox Lube Line Pressure Sensor Calibration & Chip Detector Flush',
    priority: 'high',
    status: 'approved',
    assignedBase: 'Ambala AFB',
    hangarBay: 'Hangar Bay Alpha 2',
    targetDate: '2026-11-02',
    durationDays: 3,
    leadOfficer: 'Squadron Ldr. N. Joshi',
    approvalLead: 'Wing Commander S. Nair',
  },
  {
    id: 'WO-2026-0818',
    tail: 'A-045',
    model: 'Dassault Rafale F3R',
    component: 'Auxiliary Power Unit (APU)',
    serial: 'APU-SN-0021',
    scope: 'Starter Turbine Impeller De-carbonization & Ignition Lead Overhaul',
    priority: 'routine',
    status: 'draft',
    assignedBase: 'Ambala AFB',
    hangarBay: 'Hangar Bay Alpha 3',
    targetDate: '2026-11-09',
    durationDays: 1,
    leadOfficer: 'Flight Lt. A. Roy',
    approvalLead: 'Awaiting Sign-off',
  },
  {
    id: 'WO-2026-0811',
    tail: 'A-058',
    model: 'Su-30MKI Flanker-H',
    component: 'Fly-By-Wire Flight Control Actuator',
    serial: 'FBW-SN-0055',
    scope: 'Quad-Redundant Actuator Dual-Channel Response Time Testing',
    priority: 'critical',
    status: 'in_progress',
    assignedBase: 'Chandigarh AFB',
    hangarBay: 'Avionics Calibration Bay',
    targetDate: '2026-10-24',
    durationDays: 2,
    leadOfficer: 'Wing Commander D. Sharma',
    approvalLead: 'Air Commodore R. Kapoor',
  },
]

const PRIORITY_CONFIG: Record<
  WorkOrderItem['priority'],
  { label: string; badge: string }
> = {
  critical: { label: 'Sortie Critical', badge: 'bg-red-50 text-red-800 border-red-200' },
  high:     { label: 'High Priority',  badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  routine:  { label: 'Routine Maint.', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
}

const STATUS_CONFIG: Record<
  WorkOrderItem['status'],
  { label: string; badge: string; dot: string }
> = {
  draft:       { label: 'Draft / Pending', badge: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
  approved:    { label: 'Approved & Slotted', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  in_progress: { label: 'In Hangar Bay', badge: 'bg-blue-50 text-blue-800 border-blue-200', dot: 'bg-blue-500 animate-pulse' },
  completed:   { label: 'Signed Off', badge: 'bg-purple-50 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
}

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState<WorkOrderItem[]>(INITIAL_WORK_ORDERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | WorkOrderItem['status']>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | WorkOrderItem['priority']>('all')
  const [modalOpen, setModalOpen] = useState(false)

  // Form State for New Work Order
  const [newTail, setNewTail] = useState('A-001')
  const [newComponent, setNewComponent] = useState('Port Turbofan Engine #1')
  const [newScope, setNewScope] = useState('')
  const [newPriority, setNewPriority] = useState<WorkOrderItem['priority']>('high')
  const [newBase, setNewBase] = useState('Ambala AFB')
  const [newDate, setNewDate] = useState('2026-11-05')

  const counts = useMemo(() => {
    return {
      total: orders.length,
      critical: orders.filter((o) => o.priority === 'critical').length,
      inProgress: orders.filter((o) => o.status === 'in_progress').length,
      pending: orders.filter((o) => o.status === 'draft').length,
      completed: orders.filter((o) => o.status === 'completed').length,
    }
  }, [orders])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (priorityFilter !== 'all' && o.priority !== priorityFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const match =
          o.id.toLowerCase().includes(q) ||
          o.tail.toLowerCase().includes(q) ||
          o.component.toLowerCase().includes(q) ||
          o.scope.toLowerCase().includes(q) ||
          o.assignedBase.toLowerCase().includes(q) ||
          o.leadOfficer.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [orders, statusFilter, priorityFilter, search])

  const handleApprove = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: 'approved', approvalLead: 'Wing Commander S. Nair' } : o
      )
    )
  }

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newScope.trim()) return

    const newOrder: WorkOrderItem = {
      id: `WO-2026-${String(850 + orders.length)}`,
      tail: newTail,
      model: newTail === 'A-001' ? 'Dassault Rafale F3R' : 'Su-30MKI Flanker-H',
      component: newComponent,
      serial: `ENG-SN-00${String(10 + orders.length)}`,
      scope: newScope,
      priority: newPriority,
      status: 'draft',
      assignedBase: newBase,
      hangarBay: `${newBase.split(' ')[0]} Hangar Alpha 1`,
      targetDate: newDate,
      durationDays: 2,
      leadOfficer: 'Flight Lt. V. Raghavan',
      approvalLead: 'Awaiting Sign-off',
    }

    setOrders([newOrder, ...orders])
    setNewScope('')
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-[#dce3e6]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-[#1a4d4a] bg-[#e8f4f3] border border-[#c5e3e0] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              FLIGHT-LINE ENGINEERING DIRECTIVES
            </span>
            <span className="text-xs text-[#77878f] font-mono">APPEND-ONLY AUDIT STAMPED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173747] font-heading tracking-tight">
            Maintenance Work Order Command
          </h1>
          <p className="text-sm text-[#4d606a] mt-0.5">
            Technical directives, borescope inspections, and certified hangar bay slot assignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary text-xs shadow-xs font-semibold flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Generate Work Directive</span>
          </button>
        </div>
      </div>

      {/* ── 4 KPI Metric Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div className="surface-card p-5 border-l-4 border-l-slate-700">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Directives</span>
            <ClipboardList size={16} className="text-slate-700" />
          </div>
          <p className="text-3xl font-extrabold text-[#173747] font-mono">{counts.total}</p>
          <p className="text-xs text-[#77878f] mt-1">Across 3 IAF operating sectors</p>
        </div>

        {/* Card 2: Critical */}
        <div className="surface-card p-5 border-l-4 border-l-red-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Sortie Critical</span>
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#173747] font-mono">{counts.critical}</p>
            <span className="text-xs font-semibold text-red-700">Immediate Priority</span>
          </div>
          <p className="text-xs text-[#77878f] mt-1">Conformal RUL &lt; 30 cyc triggers</p>
        </div>

        {/* Card 3: In Progress */}
        <div className="surface-card p-5 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">In Hangar Bays</span>
            <Wrench size={16} className="text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#173747] font-mono">{counts.inProgress}</p>
          <p className="text-xs text-[#77878f] mt-1">Active technician shifts assigned</p>
        </div>

        {/* Card 4: Sign-off Pending */}
        <div className="surface-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Awaiting Sign-off</span>
            <UserCheck size={16} className="text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-[#173747] font-mono">{counts.pending}</p>
          <p className="text-xs text-[#77878f] mt-1">Awaiting MEO officer review</p>
        </div>
      </div>

      {/* ── Toolbar: Search & Filters ─────────────────────────────────── */}
      <div className="surface-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search WO ID, airframe tail (e.g. A-001), scope, or officer..."
              className="gov-input pl-9 text-xs py-2 w-full"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: `All (${counts.total})` },
              { id: 'draft', label: `Pending (${counts.pending})` },
              { id: 'approved', label: 'Approved' },
              { id: 'in_progress', label: `In Bay (${counts.inProgress})` },
              { id: 'completed', label: `Done (${counts.completed})` },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id as any)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
                  statusFilter === s.id
                    ? 'bg-[#1a4d4a] text-white border-[#1a4d4a] shadow-xs'
                    : 'bg-white text-[#4d606a] border-[#dce3e6] hover:bg-slate-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter Subrow */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#edf2f4]">
          <span className="text-[11px] font-bold text-[#77878f] uppercase tracking-wider mr-1">Urgency Priority:</span>
          {[
            { id: 'all', label: 'All Priorities' },
            { id: 'critical', label: `Critical (${counts.critical})` },
            { id: 'high', label: 'High Priority' },
            { id: 'routine', label: 'Routine Depot' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPriorityFilter(p.id as any)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${
                priorityFilter === p.id
                  ? 'bg-[#173747] text-white font-bold'
                  : 'text-[#4d606a] hover:bg-slate-100 border border-transparent'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Work Order Manifest Table ─────────────────────────────────── */}
      <div className="comp-table-container">
        <div className="overflow-x-auto">
          <table className="comp-table">
            <thead>
              <tr>
                <th className="comp-th-feature" style={{ width: '20%' }}>Directive ID &amp; Tail</th>
                <th className="comp-th-feature" style={{ width: '32%' }}>Technical Scope &amp; Component</th>
                <th className="comp-th-feature" style={{ width: '18%' }}>Station &amp; Hangar Slot</th>
                <th className="comp-th-feature" style={{ width: '16%' }}>Lifecycle State</th>
                <th className="comp-th-feature" style={{ width: '14%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((wo) => {
                const prio = PRIORITY_CONFIG[wo.priority]
                const stat = STATUS_CONFIG[wo.status]

                return (
                  <tr key={wo.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Directive ID & Tail */}
                    <td className="comp-td-feature">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-[#173747] shrink-0">
                          {wo.tail.replace('A-', '')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[#173747] font-mono text-sm">{wo.id}</span>
                          </div>
                          <p className="text-xs text-[#4d606a] font-semibold">
                            Tail {wo.tail} · <span className="font-normal">{wo.model}</span>
                          </p>
                          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.2 rounded-full border ${prio.badge}`}>
                            {prio.label}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Scope & Component */}
                    <td className="comp-td-feature">
                      <p className="text-xs font-bold text-[#173747] leading-tight mb-1">{wo.scope}</p>
                      <p className="text-xs text-[#4d606a]">
                        Target: <strong>{wo.component}</strong> ({wo.serial})
                      </p>
                      <p className="text-[11px] text-[#77878f] mt-1 font-mono">
                        Lead: {wo.leadOfficer} · Sign-off: {wo.approvalLead}
                      </p>
                    </td>

                    {/* Station & Hangar */}
                    <td className="comp-td-feature">
                      <p className="text-xs font-semibold text-[#173747]">{wo.assignedBase}</p>
                      <p className="text-xs text-[#4d606a] font-medium">{wo.hangarBay}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#77878f] font-mono">
                        <span>Slot: {wo.targetDate}</span>
                        <span>({wo.durationDays}d est)</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="comp-td-feature">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${stat.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                        <span>{stat.label}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="comp-td-feature text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {wo.status === 'draft' && (
                          <button
                            onClick={() => handleApprove(wo.id)}
                            className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        <Link
                          href={`/aircraft/${wo.tail}`}
                          className="p-1.5 rounded-lg border border-[#dce3e6] text-[#4d606a] hover:text-[#173747] hover:bg-slate-100 transition-colors"
                          title="View aircraft diagnostics"
                        >
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400 text-sm">
                    No work directives found matching &quot;{search}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Create Work Order ─────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#dce3e6] shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#edf2f4]">
              <div>
                <h3 className="text-base font-bold text-[#173747] font-heading">
                  Authorize New Maintenance Work Order
                </h3>
                <p className="text-xs text-[#77878f]">
                  Logs immutable engineering directive to PostgreSQL audit ledger
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#173747] mb-1">Airframe Tail</label>
                  <select
                    value={newTail}
                    onChange={(e) => setNewTail(e.target.value)}
                    className="gov-input"
                  >
                    <option value="A-001">A-001 (Rafale F3R)</option>
                    <option value="A-007">A-007 (Su-30MKI)</option>
                    <option value="A-014">A-014 (LCA Tejas)</option>
                    <option value="A-022">A-022 (Mirage 2000)</option>
                    <option value="A-045">A-045 (Rafale F3R)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#173747] mb-1">Station Airbase</label>
                  <select
                    value={newBase}
                    onChange={(e) => setNewBase(e.target.value)}
                    className="gov-input"
                  >
                    <option value="Ambala AFB">Ambala AFB</option>
                    <option value="Chandigarh AFB">Chandigarh AFB</option>
                    <option value="Jodhpur AFB">Jodhpur AFB</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#173747] mb-1">Subsystem Component</label>
                <input
                  type="text"
                  value={newComponent}
                  onChange={(e) => setNewComponent(e.target.value)}
                  className="gov-input"
                  placeholder="e.g. Engine #1 High-Pressure Compressor"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#173747] mb-1">Technical Directive Scope &amp; Tasks</label>
                <textarea
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  className="gov-input h-20 resize-none"
                  placeholder="Detail inspection procedures, borescope checkpoints, and part replacement directives..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#173747] mb-1">Operational Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="gov-input"
                  >
                    <option value="critical">Sortie Critical (P1)</option>
                    <option value="high">High Priority (P2)</option>
                    <option value="routine">Routine Inspection (P3)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#173747] mb-1">Target Hangar Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="gov-input"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#edf2f4]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs font-semibold">
                  Submit Work Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
