'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authenticate, type AuthActionState } from '@/app/(frontend)/login/actions'

const initialState: AuthActionState = {
  ok: false,
  message: '',
}

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'petani' | 'pembeli'>('petani')
  const [state, formAction, pending] = useActionState(authenticate, initialState)

  useEffect(() => {
    if (state.ok && state.next) {
      router.push(state.next)
      router.refresh()
    }
  }, [router, state])

  return (
    <div className="min-h-screen flex font-sans antialiased" translate="no">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=1600&fit=crop&auto=format&q=90"
          alt="Rice terrace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#060e08]/85 via-[#0a1a0e]/70 to-[#1e4226]/50" />
        <div className="relative z-10 flex flex-col h-full p-10">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/panentara/logo.png"
              alt="PanenTara logo"
              className="h-11 w-11 object-contain"
            />
            <span
              style={{ fontFamily: 'Play, sans-serif' }}
              className="text-2xl text-white tracking-tight"
            >
              PanenTara
            </span>
          </Link>
          <div className="flex-1 flex flex-col justify-end pb-10">
            <div className="inline-flex items-center gap-2 bg-[#1e4226]/60 border border-[#4fa05c]/20 rounded-full px-3 py-1.5 mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fa05c] animate-pulse" />
              <span className="text-xs text-[#7dc27e] font-medium">
                Platform AI · Agrikultur Indonesia
              </span>
            </div>
            <h2
              className="text-4xl text-white leading-tight mb-4"
              style={{ fontFamily: '"Libertinus Math", serif' }}
            >
              {'Data real-time untuk '}
              <span className="text-[#7dc27e]">{'keputusan yang tepat'}</span>
            </h2>
            <p className="text-white/55 text-base leading-relaxed max-w-sm">
              Bergabunglah dengan 12.400+ petani dan pembeli yang sudah menggunakan PanenTara untuk
              terhubung dan bertransaksi lebih cerdas.
            </p>
            <div className="mt-8 flex items-center gap-4">
              {[
                { n: '12.400+', l: 'Petani Aktif' },
                { n: '340+', l: 'Komoditas' },
                { n: '68%', l: 'Hemat Kerugian' },
              ].map((s) => (
                <div key={s.l} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <p className="text-white font-bold text-lg leading-none">{s.n}</p>
                  <p className="text-white/40 text-xs mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 bg-[#faf7f2] flex flex-col justify-center items-center px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-10">
          <div className="flex items-center gap-2">
            <img
              src="/panentara/logo.png"
              alt="PanenTara logo"
              className="h-9 w-9 object-contain"
            />
            <span
              style={{ fontFamily: 'Play, sans-serif' }}
              className="text-xl text-[#0a1a0e] tracking-tight"
            >
              PanenTara
            </span>
          </div>
        </Link>

        <div className="w-full max-w-md">
          {/* Tab toggle */}
          <div className="flex bg-[#ede4d3]/60 rounded-xl p-1 mb-8">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === m ? 'bg-white text-[#0a1a0e] shadow-sm' : 'text-[#4a2e1a]/60 hover:text-[#0a1a0e]'}`}
              >
                {m === 'login' ? 'Masuk' : 'Daftar'}
              </button>
            ))}
          </div>

          <div className="mb-8">
            <h1
              className="text-3xl text-[#0a1a0e] mb-2"
              style={{ fontFamily: '"Libertinus Math", serif' }}
            >
              {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
            </h1>
            <p className="text-[#4a2e1a]/55 text-sm">
              {mode === 'login'
                ? 'Masuk ke dashboard PanenTara Anda'
                : 'Daftar gratis — tidak perlu kartu kredit'}
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="mode" value={mode} />
            <input type="hidden" name="role" value={role} />
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#0a1a0e] mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Budi Santoso"
                    className="w-full bg-white border border-[#ede4d3] rounded-xl px-4 py-3 text-sm text-[#0a1a0e] placeholder-[#4a2e1a]/35 focus:outline-none focus:border-[#4fa05c] focus:ring-2 focus:ring-[#4fa05c]/15 transition-all"
                    required
                  />
                  {state.fieldErrors?.name && (
                    <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.name}</p>
                  )}
                </div>

                {/* Role selector */}
                <div>
                  <label className="block text-sm font-medium text-[#0a1a0e] mb-2">
                    Saya adalah
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'petani', icon: '🌾', label: 'Petani', sub: 'Jual hasil panen' },
                      {
                        val: 'pembeli',
                        icon: '🏪',
                        label: 'Pembeli / Seller',
                        sub: 'Beli komoditas',
                      },
                    ].map((r) => (
                      <button
                        key={r.val}
                        type="button"
                        onClick={() => setRole(r.val as 'petani' | 'pembeli')}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${role === r.val ? 'border-[#4fa05c] bg-[#f0f9f1]' : 'border-[#ede4d3] bg-white hover:border-[#b2dcb3]'}`}
                      >
                        <span className="text-xl">{r.icon}</span>
                        <div className="text-left">
                          <p
                            className={`text-sm font-semibold ${role === r.val ? 'text-[#377a44]' : 'text-[#0a1a0e]'}`}
                          >
                            {r.label}
                          </p>
                          <p className="text-xs text-[#4a2e1a]/50">{r.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[#0a1a0e] mb-2">Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a2e1a]/35">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect
                      x="1.5"
                      y="3.5"
                      width="13"
                      height="9"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path d="M1.5 5.5L8 9.5L14.5 5.5" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  className="w-full bg-white border border-[#ede4d3] rounded-xl pl-10 pr-4 py-3 text-sm text-[#0a1a0e] placeholder-[#4a2e1a]/35 focus:outline-none focus:border-[#4fa05c] focus:ring-2 focus:ring-[#4fa05c]/15 transition-all"
                  required
                />
              </div>
              {state.fieldErrors?.email && (
                <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#0a1a0e]">Password</label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a2e1a]/35">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect
                      x="3.5"
                      y="7"
                      width="9"
                      height="7"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path d="M5 7V5a3 3 0 116 0v2" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-white border border-[#ede4d3] rounded-xl pl-10 pr-12 py-3 text-sm text-[#0a1a0e] placeholder-[#4a2e1a]/35 focus:outline-none focus:border-[#4fa05c] focus:ring-2 focus:ring-[#4fa05c]/15 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a2e1a]/40 hover:text-[#4a2e1a] transition-colors"
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 8C2 8 4.5 3 8 3C11.5 3 14 8 14 8C14 8 11.5 13 8 13C4.5 13 2 8 2 8Z"
                        stroke="currentColor"
                        strokeWidth="1.3"
                      />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                      <path
                        d="M2 2L14 14"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 8C2 8 4.5 3 8 3C11.5 3 14 8 14 8C14 8 11.5 13 8 13C4.5 13 2 8 2 8Z"
                        stroke="currentColor"
                        strokeWidth="1.3"
                      />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  )}
                </button>
              </div>
              {state.fieldErrors?.password && (
                <p className="mt-1.5 text-xs text-red-600">{state.fieldErrors.password}</p>
              )}
              {mode === 'register' && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${password.length >= i * 2 ? 'bg-[#4fa05c]' : 'bg-[#ede4d3]'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {mode === 'register' && (
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 w-4 h-4 rounded border-[#ede4d3] accent-[#4fa05c]"
                />
                <span className="text-xs text-[#4a2e1a]/60 leading-relaxed">
                  Saya setuju dengan{' '}
                  <a href="#" className="text-[#377a44] font-medium">
                    Syarat & Ketentuan
                  </a>{' '}
                  dan{' '}
                  <a href="#" className="text-[#377a44] font-medium">
                    Kebijakan Privasi
                  </a>{' '}
                  PanenTara
                </span>
              </label>
            )}

            {state.message && !state.ok && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#0a1a0e] hover:bg-[#1e4226] text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {pending ? (
                <svg
                  className="animate-spin"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="20 10"
                  />
                </svg>
              ) : mode === 'login' ? (
                'Masuk ke Dashboard'
              ) : (
                'Buat Akun Sekarang'
              )}
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#ede4d3]" />
              </div>
              <span className="relative bg-[#fdfbf7] px-3 text-[11px] uppercase tracking-wider text-[#4a2e1a]/40 font-semibold">
                atau pratinjau langsung
              </span>
            </div>

            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full border border-[#4fa05c]/30 hover:border-[#4fa05c] bg-[#122b17]/10 hover:bg-[#122b17]/20 text-[#377a44] font-bold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <span>✨</span>
              <span>Jelajahi Demo Dashboard & Buyer Matching</span>
            </button>
          </form>

          <p className="text-center text-xs text-[#4a2e1a]/50 mt-6">
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[#377a44] font-semibold hover:text-[#4fa05c] transition-colors"
            >
              {mode === 'login' ? 'Daftar Gratis' : 'Masuk'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
