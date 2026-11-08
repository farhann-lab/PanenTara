'use client'

import { useState } from 'react'

const recommendations = [
  {
    id: 1,
    priority: 'Segera',
    priorityColor: 'text-[#f5a623] bg-[#f5a623]/10 border-[#f5a623]/20',
    icon: '🌶️',
    title: 'Perluas Lahan Cabai Merah — Peluang Tinggi',
    summary:
      'Harga cabai naik 8% dalam 2 minggu. Proyeksi permintaan Lebaran masih 3 bulan ke depan.',
    confidence: 91,
    roi: '+Rp 4,2 Jt/ha',
    risk: 'Sedang',
    tags: ['Harga Tinggi', 'Demand Tinggi', 'Musim Tepat'],
    detail:
      'Berdasarkan analisis harga historis 3 tahun terakhir, cabai merah secara konsisten mencapai puncak harga 2–3 bulan sebelum Lebaran. Dengan kondisi pasokan saat ini yang rendah di Jawa Tengah dan Jawa Timur, proyeksi harga masih akan meningkat 12–18% dalam 6 minggu ke depan.',
    actions: [
      'Persiapkan lahan tambahan 0.5 ha',
      'Beli benih varietas unggul tahan hujan',
      'Ajukan perluasan ke KUR Pertanian',
    ],
  },
  {
    id: 2,
    priority: 'Direkomendasikan',
    priorityColor: 'text-[#7dc27e] bg-[#4fa05c]/10 border-[#4fa05c]/20',
    icon: '🌱',
    title: 'Jadwalkan Tanam Bawang Putih — Oktober',
    summary:
      'Musim hujan berakhir Oktober. Bawang putih lokal diminati karena impor dibatasi regulasi baru.',
    confidence: 84,
    roi: '+Rp 6,1 Jt/ha',
    risk: 'Rendah',
    tags: ['Regulasi Impor', 'Permintaan Domestik', 'ROI Tinggi'],
    detail:
      'Kebijakan Permentan terbaru membatasi impor bawang putih sebesar 30% mulai Q4 2026. Harga bawang putih lokal diproyeksikan naik 20–25% pada periode Oktober–Desember 2026.',
    actions: [
      'Siapkan lahan kering untuk Oktober',
      'Hubungi 3 pembeli potensial yang sudah teridentifikasi',
      'Ikuti pelatihan budidaya bawang putih dari Dinas Pertanian',
    ],
  },
  {
    id: 3,
    priority: 'Waspada',
    priorityColor: 'text-red-400 bg-red-400/10 border-red-400/20',
    icon: '⚠️',
    title: 'Kurangi Tanam Tomat — Oversupply Jawa Barat',
    summary:
      'Produksi tomat di Garut dan Cianjur meningkat 40%. Harga berisiko turun 25% bulan depan.',
    confidence: 87,
    roi: 'Hindari Rugi Rp 2,8 Jt/ha',
    risk: 'Tinggi',
    tags: ['Oversupply', 'Harga Turun', 'Mitigasi Risiko'],
    detail:
      'Data produksi dari 3 kabupaten di Jawa Barat menunjukkan peningkatan signifikan. Jika tren berlanjut, pasar Jakarta dan Bandung akan mengalami kelebihan pasokan sekitar 35% dalam 3–4 minggu ke depan.',
    actions: [
      'Pertimbangkan tunda tanam 6–8 minggu',
      'Alihkan lahan ke komoditas alternatif',
      'Jika sudah tanam, percepat panen dan jual sekarang',
    ],
  },
]

const plantingCalendar = [
  { month: 'Agt 26', crops: ['Cabai Merah ✓', 'Kedelai'], status: 'Sekarang' },
  { month: 'Sep 26', crops: ['Cabai Rawit', 'Jagung'], status: 'Segera' },
  { month: 'Okt 26', crops: ['Bawang Putih ★', 'Kubis'], status: 'Rekomendasi' },
  { month: 'Nov 26', crops: ['Bawang Merah'], status: 'Biasa' },
  { month: 'Des 26', crops: ['Tomat', 'Paprika'], status: 'Biasa' },
  { month: 'Jan 27', crops: ['Cabai Merah ★', 'Terong'], status: 'Rekomendasi' },
]

export default function AIRecommendations() {
  const [expanded, setExpanded] = useState<number | null>(1)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Rekomendasi AI</h1>
          <p className="text-white/40 text-sm">
            Analisis personal berdasarkan lahan, histori, dan data pasar Anda
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40 bg-[#0a1a0e] border border-white/5 rounded-xl px-4 py-2">
          <span>🧠</span> Diperbarui 2 jam lalu · GPT-Agri v3.1
        </div>
      </div>

      {/* Profile summary */}
      <div className="bg-[#0e1a2d]/60 border border-[#5b9bd5]/15 rounded-2xl p-5 flex flex-wrap gap-6">
        <div>
          <p className="text-white/35 text-xs mb-1">Profil Lahan</p>
          <p className="text-white font-semibold text-sm">2.5 ha · Brebes, Jawa Tengah</p>
        </div>
        <div>
          <p className="text-white/35 text-xs mb-1">Komoditas Aktif</p>
          <p className="text-white font-semibold text-sm">Cabai Merah, Tomat, Bawang Merah</p>
        </div>
        <div>
          <p className="text-white/35 text-xs mb-1">Skor Profitabilitas</p>
          <p className="text-[#7dc27e] font-bold text-sm">82/100 — Sangat Baik</p>
        </div>
        <div>
          <p className="text-white/35 text-xs mb-1">Rekomendasi Aktif</p>
          <p className="text-[#f5a623] font-semibold text-sm">3 tindakan diperlukan</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">
          Rekomendasi Prioritas
        </p>
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-[#0a1a0e] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
          >
            <button
              className="w-full flex items-start gap-4 p-5 text-left"
              onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
            >
              <span className="text-2xl mt-0.5">{rec.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${rec.priorityColor}`}
                  >
                    {rec.priority}
                  </span>
                  {rec.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{rec.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{rec.summary}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[#7dc27e] font-bold text-sm">{rec.roi}</p>
                <p className="text-white/30 text-xs">estimasi ROI</p>
                <div className="mt-2 flex items-center gap-1 justify-end">
                  <span className="text-[10px] text-white/30">Keyakinan</span>
                  <span className="text-xs text-white font-semibold">{rec.confidence}%</span>
                </div>
              </div>
            </button>

            {expanded === rec.id && (
              <div className="border-t border-white/5 p-5 space-y-4">
                <p className="text-sm text-white/60 leading-relaxed">{rec.detail}</p>
                <div>
                  <p className="text-xs text-white/35 font-semibold uppercase tracking-wide mb-3">
                    Langkah Tindakan
                  </p>
                  <div className="space-y-2">
                    {rec.actions.map((a, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#1e4226] flex items-center justify-center text-[10px] text-[#7dc27e] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-white/65 leading-snug">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 bg-[#f5a623] text-[#0a1a0e] font-bold py-2.5 rounded-xl text-xs hover:bg-[#f7bd58] transition-colors">
                    Terapkan Rekomendasi
                  </button>
                  <button className="px-4 py-2.5 border border-white/15 rounded-xl text-xs text-white/50 hover:border-white/25 hover:text-white transition-colors">
                    Abaikan
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Planting calendar */}
      <div className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-6">
        <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-4">
          Kalender Tanam Optimal
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {plantingCalendar.map((m) => (
            <div
              key={m.month}
              className={`rounded-xl p-3 border ${
                m.status === 'Sekarang'
                  ? 'bg-[#1e4226] border-[#4fa05c]/30'
                  : m.status === 'Rekomendasi'
                    ? 'bg-[#f5a623]/5 border-[#f5a623]/20'
                    : m.status === 'Segera'
                      ? 'bg-white/3 border-white/10'
                      : 'bg-white/2 border-white/5'
              }`}
            >
              <p
                className={`text-xs font-semibold mb-2 ${
                  m.status === 'Sekarang'
                    ? 'text-[#7dc27e]'
                    : m.status === 'Rekomendasi'
                      ? 'text-[#f5a623]'
                      : 'text-white/40'
                }`}
              >
                {m.month}
              </p>
              {m.crops.map((c) => (
                <p key={c} className="text-xs text-white/60 leading-relaxed">
                  {c}
                </p>
              ))}
              {m.status === 'Sekarang' && (
                <span className="text-[9px] text-[#4fa05c] font-bold mt-1 block">● Aktif</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
