'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import ProfilePanel from './ProfilePanel'
import { logout } from '@/app/(frontend)/login/actions'
import { switchDemoPersona } from '@/app/(frontend)/dashboard/buyer-matching/actions'
import type { CurrentAppUser } from '@/lib/app-auth'

const navItems = [
  { path: '/dashboard', label: 'Ikhtisar', icon: '⊞', exact: true },
  { path: '/dashboard/market', label: 'Market Intelligence', icon: '📊' },
  { path: '/dashboard/buyer-matching', label: 'Buyer Matching', icon: '🤝' },
  { path: '/dashboard/weather', label: 'Prediksi Cuaca', icon: '🌤️' },
  { path: '/dashboard/ai', label: 'Rekomendasi AI', icon: '🧠' },
  { path: '/dashboard/risk', label: 'Manajemen Risiko', icon: '📉' },
  { path: '/dashboard/news', label: 'Berita & Kebijakan', icon: '🗞️' },
]

export default function DashboardShell({
  children,
  user,
  isDemo = false,
}: {
  children: React.ReactNode
  user: CurrentAppUser
  isDemo?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleToggleDemoRole = () => {
    const nextRole = user.role === 'petani' ? 'pembeli' : 'petani'
    startTransition(async () => {
      await switchDemoPersona(nextRole)
      router.refresh()
    })
  }

  const isActive = (item: (typeof navItems)[0]) =>
    item.exact ? pathname === item.path : pathname.startsWith(item.path)

  return (
    <div
      className="flex h-screen bg-[#060e08] font-sans antialiased overflow-hidden"
      translate="no"
    >
      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col bg-[#0a1a0e] border-r border-white/5
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <img
                src="/panentara/logo.png"
                alt="PanenTara logo"
                className="h-9 w-9 object-contain"
              />
              <span
                style={{ fontFamily: 'Play, sans-serif' }}
                className="text-lg text-white tracking-tight"
              >
                PanenTara
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/40 hover:text-white p-1"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2L12 12M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* User pill */}
        <div className="mx-4 my-3 bg-[#122b17]/60 rounded-xl px-3 py-2.5 flex items-center gap-3">
          <img
            src="/panentara/avatar-profile.jpeg"
            alt="User"
            className="w-8 h-8 rounded-full object-cover bg-[#1e4226]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user.name}</p>
            <p className="text-white/40 text-[10px]">
              {user.role === 'petani' ? 'Petani / Penjual' : 'Pembeli'} ·{' '}
              {user.location || 'Indonesia'}
            </p>
          </div>
          {isDemo ? (
            <span className="text-[9px] uppercase tracking-wider font-bold bg-[#f5a623]/20 text-[#f5a623] border border-[#f5a623]/30 px-1.5 py-0.5 rounded-md shrink-0">
              Demo
            </span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-[#4fa05c] shrink-0" />
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-white/25 font-semibold px-3 py-2 mt-1">
            Menu Utama
          </p>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive(item)
                  ? 'bg-[#1e4226] text-white font-semibold'
                  : 'text-white/55 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.label === 'Buyer Matching' && (
                <span className="text-[10px] bg-[#f5a623] text-[#0a1a0e] font-bold px-1.5 py-0.5 rounded-full">
                  3
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Upgrade CTA */}
        <div className="mx-3 mb-4 bg-gradient-to-br from-[#1e4226] to-[#2a5c34] rounded-xl p-4 border border-[#4fa05c]/20">
          <p className="text-white text-xs font-semibold mb-1">
            {isDemo ? 'Pratinjau Demo PanenTara' : 'Upgrade ke Pro'}
          </p>
          <p className="text-white/50 text-[10px] leading-relaxed mb-3">
            {isDemo
              ? 'Anda menjelajahi fitur dalam Mode Demo. Daftar untuk menyimpan data panen dan chat transaksi nyata.'
              : 'Akses Buyer Matching tak terbatas & Market Intelligence real-time'}
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#f5a623] text-[#0a1a0e] text-xs font-bold py-2 rounded-lg hover:bg-[#f7bd58] transition-colors"
          >
            {isDemo ? 'Masuk / Buat Akun' : 'Coba 14 Hari Gratis'}
          </button>
        </div>

        {/* Bottom links */}
        <div className="px-3 pb-4 border-t border-white/5 pt-3 space-y-0.5">
          {[
            { icon: '⚙️', label: 'Pengaturan' },
            { icon: '❓', label: 'Bantuan' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 text-sm transition-all"
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button
            onClick={async () => {
              if (!isDemo) {
                await logout()
              }
              router.push('/login')
              router.refresh()
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/5 text-sm transition-all"
          >
            <span className="text-base w-5 text-center">🚪</span>
            {isDemo ? 'Masuk Akun Asli' : 'Keluar'}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-[#0a1a0e]/80 backdrop-blur-sm border-b border-white/5 px-6 py-3.5 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 4H16M2 9H16M2 14H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="flex-1 relative max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M10 10L12.5 12.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari komoditas, pembeli, berita..."
              className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white/70 placeholder-white/25 focus:outline-none focus:border-white/20 focus:bg-white/8 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {isDemo && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/30 text-xs text-[#f5a623]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] animate-pulse" />
                  <span className="font-semibold">Mode Demo</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDemoRole}
                  disabled={isPending}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#1e4226] hover:bg-[#285733] border border-[#4fa05c]/30 text-[#7dc27e] font-medium transition-colors disabled:opacity-50"
                  title="Klik untuk beralih perspektif Petani atau Pembeli"
                >
                  {isPending ? 'Beralih...' : user.role === 'petani' ? 'Peran: Petani (Ubah)' : 'Peran: Pembeli (Ubah)'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-xs px-3 py-1 rounded-full bg-[#f5a623] hover:bg-[#f7bd58] text-[#0a1a0e] font-bold transition-colors"
                >
                  Masuk / Daftar
                </button>
              </div>
            )}
            <button className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
              <span>🔔</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f5a623] border border-[#0a1a0e]" />
            </button>
            <button
              onClick={() => setProfileOpen(true)}
              className="rounded-full ring-2 ring-transparent hover:ring-[#4fa05c]/50 transition-all"
            >
              <img
                src="/panentara/avatar-topbar.jpeg"
                alt="User"
                className="w-8 h-8 rounded-full object-cover bg-[#1e4226]"
              />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#060e08]">{children}</main>
      </div>

      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  )
}
