'use client'

import { useState, useEffect } from 'react'
import { Shield, Database, Lock, RefreshCw } from 'lucide-react'

interface AuditItem {
  id?: string
  action: string
  target: string
  user: string
  time?: string
  created_at?: string
  details?: string
}

const DEFAULT_AUDIT: AuditItem[] = [
  { action: 'APPROVE_SCHEDULE_SLOT', target: 'Slot #H1 (A-001)', user: 'commander', time: '10 mins ago' },
  { action: 'OVERRIDE_TECH_SNAG', target: 'Snag #2041 (ENG-SN-0042)', user: 'meo', time: '42 mins ago' },
  { action: 'INGEST_CMAPSS_STREAM', target: 'FD001 (10 units)', user: 'admin', time: '2 hours ago' },
  { action: 'APPROVE_PO', target: 'PO-2026-0104 (Compressor Blades)', user: 'logistics', time: '4 hours ago' },
  { action: 'LOCK_SLOT_OVERHAUL', target: 'Slot #H2 (A-007)', user: 'commander', time: '6 hours ago' },
]

export default function AdminPage() {
  const [auditLogs, setAuditLogs] = useState<AuditItem[]>(DEFAULT_AUDIT)
  const [loading, setLoading] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/admin/audit')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setAuditLogs(data)
        }
      }
    } catch {
      // keep fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <div className="space-y-6">
      {/* ── Title Row ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield size={24} className="text-sky-700" /> System Governance &amp; Immutable Audit
          </h1>
          <p className="text-sm text-slate-500 font-medium">Model lineage registry, role-based access, and tamper-evident audit trails</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            ADMINISTRATOR PRIVILEGES ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Registry Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Database size={18} className="text-sky-700" />
            <h2 className="font-bold text-slate-900 text-sm">Offline Model Registry (MLflow)</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            All model weights, conformal non-conformity quantiles, and training metrics are persisted locally in MinIO/MLflow without cloud dependencies.
          </p>

          <div className="space-y-2.5">
            {[
              { name: 'flare-rul-histgbm-v1', type: 'HistGradientBoosting (Tier 2)', status: 'Production', score: 'RMSE 18.13' },
              { name: 'flare-rul-mlp-v1', type: 'Neural MLP (Tier 3)', status: 'Staging Candidate', score: 'RMSE 17.55' },
              { name: 'flare-rul-ridge-baseline', type: 'Ridge Baseline (Tier 1)', status: 'Archived Baseline', score: 'RMSE 22.66' },
            ].map(m => (
              <div key={m.name} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold font-mono text-slate-900">{m.name}</p>
                  <p className="text-slate-500 text-[11px]">{m.type}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${m.status === 'Production' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {m.status}
                  </span>
                  <p className="text-[11px] font-mono font-bold text-slate-700 mt-0.5">{m.score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Append-Only Audit Log Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-amber-700" />
              <h2 className="font-bold text-slate-900 text-sm">Append-Only Audit Log Enforcement</h2>
            </div>
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="text-xs text-slate-500 hover:text-slate-800 p-1 rounded transition-colors"
              title="Refresh audit logs"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Strict append-only logging enforced at database level. State mutations (work orders, schedule locks, alarm resolutions) generate unmodifiable audit entries.
          </p>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {auditLogs.map((a, i) => (
              <div key={a.id || i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold font-mono text-slate-900 text-[11px]">{a.action}</p>
                  <p className="text-slate-500 text-[11px]">{a.target}</p>
                  {a.details && <p className="text-[10px] text-slate-400 truncate max-w-xs">{a.details}</p>}
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-[11px] text-sky-800 font-bold bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                    {a.user}
                  </span>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    {a.time || (a.created_at ? new Date(a.created_at).toLocaleTimeString() : 'Recent')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
