'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Bell, Calendar, Plane, Activity,
  Package, ClipboardList, BarChart2, Upload, FlaskConical,
  Shield, LogOut, ChevronDown, ExternalLink, Home
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { UserRole } from '@/types'
import MROCopilot from '../ui/MROCopilot'

const ROLE_COLORS: Record<UserRole, string> = {
  commander: 'bg-red-50 text-red-700 border border-red-200',
  maintenance_officer: 'bg-blue-50 text-blue-700 border border-blue-200',
  logistics_officer: 'bg-amber-50 text-amber-700 border border-amber-200',
  technician: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  admin: 'bg-purple-50 text-purple-700 border border-purple-200',
}

const ROLE_LABELS: Record<UserRole, string> = {
  commander: 'Commander',
  maintenance_officer: 'Maint. Officer',
  logistics_officer: 'Logistics',
  technician: 'Technician',
  admin: 'System Admin',
}

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
  roles?: UserRole[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

const NAV: NavSection[] = [
  {
    title: 'OPERATIONS',
    items: [
      { to: '/dashboard', label: 'Fleet Overview', icon: <LayoutDashboard size={15} /> },
      { to: '/alarms', label: 'Alarm Queue', icon: <Bell size={15} /> },
      { to: '/schedule', label: 'Schedule Board', icon: <Calendar size={15} />, roles: ['maintenance_officer', 'commander', 'admin'] },
    ],
  },
  {
    title: 'FLEET & ASSETS',
    items: [
      { to: '/aircraft', label: 'Aircraft Roster', icon: <Plane size={15} /> },
      { to: '/twin', label: 'Digital Twin', icon: <Activity size={15} /> },
      { to: '/work-orders', label: 'Work Orders', icon: <ClipboardList size={15} /> },
    ],
  },
  {
    title: 'LOGISTICS',
    items: [
      { to: '/spares', label: 'Spares & Parts', icon: <Package size={15} />, roles: ['logistics_officer', 'maintenance_officer', 'admin'] },
      { to: '/simulation', label: 'Readiness Sim.', icon: <BarChart2 size={15} />, roles: ['commander', 'maintenance_officer', 'admin'] },
    ],
  },
  {
    title: 'SYSTEM & BENCHMARK',
    items: [
      { to: '/ingestion', label: 'Data Ingestion', icon: <Upload size={15} />, roles: ['admin'] },
      { to: '/evaluation', label: 'C-MAPSS Ladder', icon: <FlaskConical size={15} />, roles: ['admin', 'maintenance_officer'] },
      { to: '/admin', label: 'Audit Ledger', icon: <Shield size={15} />, roles: ['admin'] },
    ],
  },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, setAuth, logout } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // If not authenticated, default to demo commander so preview works immediately without login friction
    if (!user) {
      setAuth('demo-token', {
        id: 'usr-1',
        username: 'commander',
        role: 'commander',
        name: 'Air Commodore K. Rathore',
        email: 'commander@iaf.aero',
        unit: 'Western Air Command',
        is_active: true,
      })
    }
  }, [user, setAuth])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const currentUser = user || {
    id: 'usr-1',
    username: 'commander',
    role: 'commander' as UserRole,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafb] text-[#173747] font-sans">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 flex flex-col justify-between bg-white border-r border-[#dce3e6] shadow-2xs z-20">
        <div>
          {/* Brand */}
          <div className="p-4 border-b border-[#edf2f4]">
            <Link href="/" className="flex items-center gap-2.5 group" title="Return to Public Landing Page">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0f3535] to-[#1a4d4a] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Plane size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-heading font-extrabold text-[#173747] text-sm tracking-tight leading-none">AeroSync</p>
                  <span className="text-[9px] font-mono font-bold bg-[#e8f4f3] text-[#1a4d4a] px-1 py-0.2 rounded border border-[#c5e3e0]">
                    PS249
                  </span>
                </div>
                <p className="text-[10px] text-[#77878f] font-medium leading-none mt-1">Air Power Fleet MRO</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            {NAV.map((section) => {
              const visible = section.items.filter(
                (item) => !item.roles || item.roles.includes(currentUser.role as UserRole)
              )
              if (visible.length === 0) return null

              return (
                <div key={section.title}>
                  <p className="text-[10px] font-bold text-[#77878f] uppercase tracking-wider px-2.5 mb-1.5">
                    {section.title}
                  </p>
                  <div className="space-y-0.5">
                    {visible.map((item) => {
                      const isActive = pathname === item.to || pathname?.startsWith(item.to + '/')
                      return (
                        <Link
                          key={item.to}
                          href={item.to}
                          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-100 ${
                            isActive
                              ? 'bg-[#e8f4f3] text-[#1a4d4a] border-l-3 border-[#1a4d4a] shadow-2xs'
                              : 'text-[#4d606a] hover:text-[#173747] hover:bg-slate-50'
                          }`}
                        >
                          <span className="shrink-0 opacity-80">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Link back to landing page */}
            <div className="pt-2 border-t border-[#edf2f4]">
              <Link
                href="/"
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#77878f] hover:text-[#173747] hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Home size={14} />
                  <span>Public Landing Page</span>
                </span>
                <ExternalLink size={12} className="opacity-60" />
              </Link>
            </div>
          </nav>
        </div>

        {/* User Profile Bar */}
        {mounted && (
          <div className="p-3 border-t border-[#edf2f4] bg-[#f8fafb]/80">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-[#dce3e6]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0f3535] to-[#1a4d4a] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {currentUser.username ? currentUser.username[0].toUpperCase() : 'U'}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold text-[#173747] truncate leading-tight">{currentUser.username}</p>
                    <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.2 rounded-full mt-0.5 ${ROLE_COLORS[currentUser.role as UserRole] ?? 'bg-slate-100 text-slate-600'}`}>
                      {ROLE_LABELS[currentUser.role as UserRole] ?? currentUser.role}
                    </span>
                  </div>
                </div>
                <ChevronDown size={13} className="text-[#77878f] shrink-0" />
              </button>

              {showUserMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-1 rounded-lg border border-[#dce3e6] bg-white shadow-lg overflow-hidden z-30">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* ── Main Area ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>

        {/* Global Floating MRO Copilot Assistant */}
        <MROCopilot />
      </div>
    </div>
  )
}
