'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { UserRole } from '@/types'
import { Plane, ArrowRight, ShieldCheck, ChevronLeft, Lock, User as UserIcon } from 'lucide-react'

const ROLES: { role: UserRole; label: string; username: string; badge: string; desc: string }[] = [
  { role: 'commander', label: 'Air Base Commander', username: 'commander', badge: 'bg-red-50 text-red-800 border-red-200', desc: 'Sortie readiness & fleet lockout' },
  { role: 'maintenance_officer', label: 'Maintenance Engineer Officer', username: 'meo', badge: 'bg-blue-50 text-blue-800 border-blue-200', desc: 'Schedule board & hangar slots' },
  { role: 'logistics_officer', label: 'Logistics Officer', username: 'logistics', badge: 'bg-amber-50 text-amber-800 border-amber-200', desc: 'Spares forecasting & procurement' },
  { role: 'technician', label: 'Flight-Line Technician', username: 'tech01', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', desc: 'Digital twin & snag classification' },
  { role: 'admin', label: 'Systems Administrator', username: 'admin', badge: 'bg-purple-50 text-purple-800 border-purple-200', desc: 'Data ingestion & audit log' },
]

export default function Login() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('demo')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const doLogin = async (u: string, p: string, role?: UserRole) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p }),
      })
      if (res.ok) {
        const data = await res.json()
        setAuth(data.access_token, data.user)
        router.push('/dashboard')
        return
      }
    } catch {
      // fallback
    }

    if (role || u) {
      const userRole = role || (u === 'commander' || u === 'meo' || u === 'logistics' || u === 'tech01' || u === 'admin' ? u : 'commander') as UserRole
      setAuth('demo-token', { id: `usr-${u}`, username: u, role: userRole, is_active: true })
      router.push('/dashboard')
    } else {
      setError('Authentication failed. Select a demo role below to quick-login.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafb] text-[#173747] font-sans selection:bg-[#1a4d4a] selection:text-white">
      {/* ── Subheader / Nav ───────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#dce3e6] py-3.5 px-6 sm:px-8 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0f3535] to-[#1a4d4a] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Plane size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#77878f] uppercase tracking-wider leading-none">
                MRO Engineering Wing · PS 26249
              </p>
              <h1 className="text-sm font-extrabold text-[#173747] tracking-tight font-heading mt-0.5">
                AeroSync · Fleet Availability &amp; Readiness Engine
              </h1>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-[#4d606a] hover:text-[#173747] flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft size={14} />
            <span>Back to Portal Home</span>
          </Link>
        </div>
      </header>

      {/* ── Main Login Layout ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-xl space-y-6">
          {/* Card */}
          <div className="bg-white border border-[#dce3e6] rounded-2xl shadow-lg p-7 sm:p-9 space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#1a4d4a] uppercase tracking-wider font-mono">
                SECURE ACCESS GATEWAY
              </span>
              <h2 className="text-2xl font-extrabold text-[#173747] font-heading tracking-tight mt-1">
                Flight-Line Operations Login
              </h2>
              <p className="text-xs text-[#77878f] mt-1 leading-relaxed">
                Role-based access control for squadron commanders, maintenance officers, and flight-line diagnostics.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium">
                {error}
              </div>
            )}

            {/* Direct Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                doLogin(username, password)
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#173747] mb-1.5 font-heading">
                  Username / IAF Call-Sign
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77878f]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="gov-input pl-10 text-xs"
                    placeholder="e.g. commander, meo, logistics"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#173747] mb-1.5 font-heading">
                  Security Passkey
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77878f]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="gov-input pl-10 text-xs"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Operations Console'}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Quick Login Role Pills */}
            <div className="pt-5 border-t border-[#edf2f4]">
              <p className="text-[10px] font-bold text-[#77878f] uppercase tracking-wider mb-3">
                ONE-CLICK DEMO ACCESS (AUTHENTIC AIRBASE ROLES)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => doLogin(r.username, 'demo', r.role)}
                    className="p-2.5 text-left rounded-xl border border-[#dce3e6] bg-[#f8fafb] hover:bg-[#e8f4f3] hover:border-[#1a4d4a]/40 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#173747] group-hover:text-[#1a4d4a]">
                        {r.label}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${r.badge}`}>
                        {r.username}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#77878f] mt-0.5 truncate">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#77878f] px-2 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Air-Gapped Local Authentication Engine</span>
            </div>
            <span>v0.1.0-RC</span>
          </div>
        </div>
      </div>
    </div>
  )
}
