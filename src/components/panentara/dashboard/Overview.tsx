'use client'

import { useRouter } from 'next/navigation'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

const revenueData = [
  { day: 'Sen', v: 1200000 },
  { day: 'Sel', v: 1850000 },
  { day: 'Rab', v: 1400000 },
  { day: 'Kam', v: 2100000 },
  { day: 'Jum', v: 1900000 },
  { day: 'Sab', v: 2400000 },
  { day: 'Min', v: 2200000 },
]

export default function Overview() {
  const router = useRouter()
  const stats = [
    { label: 'Pendapatan Bulan Ini', value: 'Rp 14,2 Jt', change: '+18%', up: true, icon: '💰' },
    {
      label: 'Komoditas Aktif',
      value: '4 Lahan',
      change: '2 panen bulan ini',
      up: true,
      icon: '🌾',
    },
    {
      label: 'Buyer Match Baru',
      value: '3 Pembeli',
      change: 'Butuh respons',
      up: null,
      icon: '🤝',
    },
    {
      label: 'Alert Risiko',
      value: '1 Peringatan',
      change: 'Oversupply tomat',
      up: false,
      icon: '⚠️',
    },
  ]

  const activities = [
    {
      icon: '🤝',
      text: 'PT Segar Nusantara mengirim penawaran untuk 2 ton Cabai Merah',
      time: '10 menit lalu',
      dot: 'bg-[#4fa05c]',
    },
    {
      icon: '📊',
      text: 'Harga Bawang Merah turun 4% di Pasar Induk Kramat Jati',
      time: '45 menit lalu',
      dot: 'bg-[#f5a623]',
    },
    {
      icon: '🌧️',
      text: 'Peringatan cuaca: hujan lebat diprediksi 3 hari ke depan di Brebes',
      time: '2 jam lalu',
      dot: 'bg-[#5b9bd5]',
    },
    {
      icon: '🧠',
      text: 'Rekomendasi AI: Pertimbangkan tanam Cabai Rawit bulan depan',
      time: '5 jam lalu',
      dot: 'bg-[#a855f7]',
    },
    {
      icon: '✅',
      text: 'Transaksi dengan CV Hijau Makmur selesai — Rp 2.800.000',
      time: 'Kemarin',
      dot: 'bg-[#4fa05c]',
    },
  ]

  const quickActions = [
    { label: 'Market Intelligence', icon: '📊', path: '/dashboard/market', color: 'bg-[#122b17]' },
    { label: 'Cari Pembeli', icon: '🤝', path: '/dashboard/buyer-matching', color: 'bg-[#2d1a0e]' },
    { label: 'Cek Cuaca', icon: '🌤️', path: '/dashboard/weather', color: 'bg-[#0e1a2d]' },
    { label: 'Rekomendasi AI', icon: '🧠', path: '/dashboard/ai', color: 'bg-[#1a0e2d]' },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-white mb-1" style={{ fontFamily: 'Kadwa, serif' }}>
          Selamat pagi, Rasya👋
        </h1>
        <p className="text-white/45 text-sm">
          Senin, 3 Agustus 2026 · Cuaca Padang: 29°C, Berawan Sebagian
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xl">{s.icon}</span>
              {s.up !== null && (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${s.up ? 'text-[#7dc27e] bg-[#1e4226]' : 'text-[#f5a623] bg-[#2d1a0e]'}`}
                >
                  {s.change}
                </span>
              )}
            </div>
            <p className="text-white font-bold text-xl leading-none mb-1">{s.value}</p>
            <p className="text-white/40 text-xs">{s.label}</p>
            {s.up === null && <p className="text-[#f5a623] text-xs mt-1">{s.change}</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-[#0a1a0e] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white font-semibold">Pendapatan Mingguan</p>
              <p className="text-white/40 text-xs mt-0.5">28 Jul – 3 Agt 2026</p>
            </div>
            <span className="text-xs text-[#7dc27e] bg-[#1e4226] px-2.5 py-1 rounded-full font-semibold">
              +18% dari pekan lalu
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4fa05c" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4fa05c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#122b17',
                  border: '1px solid rgba(79,160,92,0.2)',
                  borderRadius: 10,
                  fontSize: 12,
                  color: '#fff',
                }}
                formatter={(v) => [`Rp ${((v as number) / 1000000).toFixed(1)} Jt`, 'Pendapatan']}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke="#4fa05c"
                strokeWidth={2}
                fill="url(#revGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#4fa05c' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-6">
          <p className="text-white font-semibold mb-4">Akses Cepat</p>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => router.push(a.path)}
                className={`${a.color} border border-white/5 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-white/15 transition-all group`}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {a.icon}
                </span>
                <span className="text-xs text-white/60 text-center leading-tight group-hover:text-white">
                  {a.label}
                </span>
              </button>
            ))}
          </div>

          {/* Weather strip */}
          <div className="mt-4 bg-[#0e1a2d]/80 border border-[#5b9bd5]/15 rounded-xl p-4">
            <p className="text-white/40 text-xs mb-2">Cuaca 3 Hari ke Depan</p>
            <div className="flex justify-between">
              {[
                { d: 'Sel', icon: '🌧️', t: '24°' },
                { d: 'Rab', icon: '⛈️', t: '22°' },
                { d: 'Kam', icon: '🌤️', t: '27°' },
              ].map((w) => (
                <div key={w.d} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-white/40">{w.d}</span>
                  <span className="text-base">{w.icon}</span>
                  <span className="text-xs text-white font-medium">{w.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-6">
        <p className="text-white font-semibold mb-5">Aktivitas Terbaru</p>
        <div className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                className={`w-8 h-8 rounded-full ${a.dot}/20 flex items-center justify-center shrink-0 text-sm`}
              >
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/70 leading-snug">{a.text}</p>
                <p className="text-xs text-white/30 mt-1">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
