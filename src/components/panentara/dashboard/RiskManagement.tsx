'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const supplyData = [
  { region: 'Brebes', supply: 85, demand: 70, status: 'Aman' },
  { region: 'Nganjuk', supply: 120, demand: 80, status: 'Oversupply' },
  { region: 'Garut', supply: 140, demand: 90, status: 'Oversupply' },
  { region: 'Magelang', supply: 60, demand: 75, status: 'Kekurangan' },
  { region: 'Kediri', supply: 95, demand: 100, status: 'Aman' },
  { region: 'Banyuwangi', supply: 110, demand: 85, status: 'Lebih' },
]

const alerts = [
  {
    level: 'Kritis',
    color: 'border-red-400/30 bg-red-400/5',
    badge: 'bg-red-400/15 text-red-400',
    icon: '🚨',
    commodity: 'Tomat',
    region: 'Garut & Cianjur',
    message:
      'Produksi meningkat 40% dibanding bulan lalu. Potensi penurunan harga 25–30% dalam 2 minggu.',
    action: 'Percepat penjualan stok atau cari pasar alternatif',
  },
  {
    level: 'Waspada',
    color: 'border-[#f5a623]/30 bg-[#f5a623]/5',
    badge: 'bg-[#f5a623]/15 text-[#f5a623]',
    icon: '⚠️',
    commodity: 'Bawang Merah',
    region: 'Nganjuk & Probolinggo',
    message:
      'Panen serentak diprediksi 3 minggu ke depan. Pasokan bisa melebihi permintaan sebesar 20%.',
    action: 'Pertimbangkan simpan di cold storage atau jadwal ulang panen',
  },
  {
    level: 'Pantau',
    color: 'border-[#5b9bd5]/30 bg-[#5b9bd5]/5',
    badge: 'bg-[#5b9bd5]/15 text-[#5b9bd5]',
    icon: '👁️',
    commodity: 'Jagung',
    region: 'Jawa Timur',
    message: 'Curah hujan tinggi dapat mengganggu panen mekanisasi di area dataran rendah.',
    action: 'Monitor kondisi cuaca dan pastikan drainase lahan baik',
  },
]

const historicalRisk = [
  { month: 'Feb', oversupply: 2, shortage: 1 },
  { month: 'Mar', oversupply: 3, shortage: 0 },
  { month: 'Apr', oversupply: 1, shortage: 2 },
  { month: 'Mei', oversupply: 4, shortage: 1 },
  { month: 'Jun', oversupply: 2, shortage: 3 },
  { month: 'Jul', oversupply: 5, shortage: 1 },
  { month: 'Agt', oversupply: 3, shortage: 2 },
]

export default function RiskManagement() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl text-white mb-1">Manajemen Risiko Produksi</h1>
        <p className="text-white/40 text-sm">
          Deteksi dini oversupply dan kekurangan stok di seluruh wilayah
        </p>
      </div>

      {/* Risk score overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'Risiko Keseluruhan',
            value: 'Sedang',
            score: 52,
            color: 'text-[#f5a623]',
            bg: 'bg-[#f5a623]',
          },
          {
            label: 'Komoditas Berisiko',
            value: '2 Kritis',
            color: 'text-red-400',
            bg: 'bg-red-400',
            score: 75,
          },
          {
            label: 'Wilayah Stabil',
            value: '4 dari 6',
            color: 'text-[#7dc27e]',
            bg: 'bg-[#4fa05c]',
            score: 67,
          },
        ].map((s) => (
          <div key={s.label} className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-5">
            <p className="text-white/40 text-xs mb-3">{s.label}</p>
            <p className={`font-display text-2xl ${s.color} mb-3`}>{s.value}</p>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${s.bg} rounded-full`} style={{ width: `${s.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Active alerts */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-4">
          Alert Aktif
        </p>
        <div className="space-y-3">
          {alerts.map((a) => (
            <div key={a.level + a.commodity} className={`border rounded-2xl p-5 ${a.color}`}>
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-0.5">{a.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${a.badge}`}>
                      {a.level}
                    </span>
                    <span className="text-sm font-semibold text-white">{a.commodity}</span>
                    <span className="text-xs text-white/40">📍 {a.region}</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-2">{a.message}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30">Saran Tindakan:</span>
                    <span className="text-xs text-white/70 font-medium">{a.action}</span>
                  </div>
                </div>
                <button className="shrink-0 text-xs bg-white/10 hover:bg-white/15 text-white/70 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supply vs demand chart */}
      <div className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-6">
        <p className="text-white font-semibold mb-1">Neraca Pasokan vs Permintaan per Wilayah</p>
        <p className="text-white/40 text-xs mb-5">Komoditas: Tomat · Satuan: ton/minggu</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={supplyData} barGap={3} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="region"
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: '#122b17',
                border: '1px solid rgba(79,160,92,0.2)',
                borderRadius: 10,
                fontSize: 12,
                color: '#fff',
              }}
            />
            <Bar dataKey="supply" name="Pasokan" radius={[4, 4, 0, 0]}>
              {supplyData.map((d) => (
                <Cell
                  key={d.region}
                  fill={
                    d.status === 'Oversupply'
                      ? '#e05252'
                      : d.status === 'Kekurangan'
                        ? '#5b9bd5'
                        : '#4fa05c'
                  }
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
            <Bar
              dataKey="demand"
              name="Permintaan"
              fill="rgba(255,255,255,0.15)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          {[
            { color: 'bg-[#4fa05c]', label: 'Aman' },
            { color: 'bg-red-400', label: 'Oversupply' },
            { color: 'bg-[#5b9bd5]', label: 'Kekurangan' },
            { color: 'bg-white/15', label: 'Permintaan' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
              <span className="text-xs text-white/40">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historical */}
      <div className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-6">
        <p className="text-white font-semibold mb-1">Histori Kejadian Risiko</p>
        <p className="text-white/40 text-xs mb-5">
          Jumlah komoditas yang mengalami anomali per bulan
        </p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={historicalRisk}
            barGap={4}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={20}
            />
            <Tooltip
              contentStyle={{
                background: '#122b17',
                border: '1px solid rgba(79,160,92,0.2)',
                borderRadius: 10,
                fontSize: 12,
                color: '#fff',
              }}
            />
            <Bar
              dataKey="oversupply"
              name="Oversupply"
              fill="#e05252"
              fillOpacity={0.7}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="shortage"
              name="Kekurangan"
              fill="#5b9bd5"
              fillOpacity={0.7}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
