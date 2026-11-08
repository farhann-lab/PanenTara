'use client'

import { useState } from 'react'

const categories = ['Semua', 'Harga Pasar', 'Kebijakan', 'Teknologi', 'Cuaca', 'Ekspor/Impor']

const news = [
  {
    id: 1,
    category: 'Kebijakan',
    tag: 'Kebijakan',
    time: '2 jam lalu',
    headline: 'Kementan Batasi Impor Bawang Putih 30% di Q4 2026 — Peluang Bagi Petani Lokal',
    summary:
      'Permentan terbaru mengatur pembatasan kuota impor bawang putih sebesar 30% mulai Oktober 2026. Kebijakan ini diproyeksikan mendorong harga bawang putih lokal naik 20–25%.',
    source: 'Kementerian Pertanian RI',
    impact: 'Positif',
    impactColor: 'text-[#7dc27e] bg-[#1e4226]',
    img: 'photo-1464226184884-fa280b87c399?w=400&h=200&fit=crop&auto=format&q=80',
    featured: true,
  },
  {
    id: 2,
    category: 'Harga Pasar',
    tag: 'Harga Pasar',
    time: '4 jam lalu',
    headline: 'Harga Cabai Merah Tembus Rp 45.000/kg di Kramat Jati — Tertinggi 8 Bulan Terakhir',
    summary:
      'Kenaikan harga dipicu oleh curah hujan tinggi di sentra produksi Jawa Tengah yang mengurangi pasokan. Pedagang memprediksi harga masih akan naik 5–10% dalam minggu ini.',
    source: 'Info Pangan Jakarta',
    impact: 'Positif',
    impactColor: 'text-[#7dc27e] bg-[#1e4226]',
    img: 'photo-1588668214407-6ea9a6d8c272?w=400&h=200&fit=crop&auto=format&q=80',
    featured: false,
  },
  {
    id: 3,
    category: 'Teknologi',
    tag: 'Teknologi',
    time: '6 jam lalu',
    headline: 'Drone Pertanian Bersubsidi dari Kementan untuk 10.000 Petani Terdaftar',
    summary:
      'Program subsidi drone penyemprotan pestisida dan pupuk dari Kementerian Pertanian akan dimulai September 2026. Petani terdaftar mendapat subsidi 50% dari harga sewa.',
    source: 'Kementerian Pertanian RI',
    impact: 'Positif',
    impactColor: 'text-[#7dc27e] bg-[#1e4226]',
    img: 'photo-1586771107445-d3ca888129ff?w=400&h=200&fit=crop&auto=format&q=80',
    featured: false,
  },
  {
    id: 4,
    category: 'Ekspor/Impor',
    tag: 'Ekspor/Impor',
    time: '1 hari lalu',
    headline: 'Indonesia Buka Peluang Ekspor Cabai ke Malaysia dan Singapura — Pasar Baru Menanti',
    summary:
      'MoU ekspor komoditas hortikultura antara Indonesia, Malaysia, dan Singapura resmi ditandatangani. Ekspor cabai merah dan bawang merah diproyeksikan mencapai 5.000 ton per tahun.',
    source: 'Kementerian Perdagangan RI',
    impact: 'Positif',
    impactColor: 'text-[#7dc27e] bg-[#1e4226]',
    img: 'photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&auto=format&q=80',
    featured: false,
  },
  {
    id: 5,
    category: 'Cuaca',
    tag: 'Cuaca',
    time: '1 hari lalu',
    headline:
      'BMKG: La Niña Lemah Diprediksi Berlanjut Hingga November — Waspadai Hujan Lebih Tinggi',
    summary:
      'Fenomena La Niña lemah yang sedang berlangsung diprediksi akan meningkatkan curah hujan di Jawa dan Sumatera hingga 30% di atas normal. Petani disarankan meningkatkan drainase lahan.',
    source: 'BMKG',
    impact: 'Waspada',
    impactColor: 'text-[#f5a623] bg-[#2d1a0e]',
    img: 'photo-1504608524841-42584120d693?w=400&h=200&fit=crop&auto=format&q=80',
    featured: false,
  },
  {
    id: 6,
    category: 'Kebijakan',
    tag: 'Kebijakan',
    time: '2 hari lalu',
    headline:
      'KUR Pertanian 2026 Naik Plafon — Petani Kini Bisa Pinjam Hingga Rp 100 Juta Tanpa Agunan',
    summary:
      'Pemerintah merevisi ketentuan KUR Pertanian dengan menaikkan plafon tanpa agunan dari Rp 50 juta menjadi Rp 100 juta. Bunga tetap 6% per tahun.',
    source: 'OJK Indonesia',
    impact: 'Positif',
    impactColor: 'text-[#7dc27e] bg-[#1e4226]',
    img: 'photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop&auto=format&q=80',
    featured: false,
  },
]

export default function News() {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [search, setSearch] = useState('')

  const filtered = news.filter(
    (n) =>
      (activeCategory === 'Semua' || n.category === activeCategory) &&
      (search === '' ||
        n.headline.toLowerCase().includes(search.toLowerCase()) ||
        n.summary.toLowerCase().includes(search.toLowerCase())),
  )

  const featured = filtered.find((n) => n.featured)
  const rest = filtered.filter((n) => !n.featured)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Berita & Kebijakan Pertanian</h1>
          <p className="text-white/40 text-sm">
            Terkurasi AI · Hanya berita relevan untuk komoditas Anda
          </p>
        </div>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            width="13"
            height="13"
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berita..."
            className="bg-[#0a1a0e] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/70 placeholder-white/25 focus:outline-none focus:border-white/20 w-52"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${activeCategory === c ? 'bg-[#1e4226] text-[#7dc27e] border border-[#4fa05c]/30' : 'text-white/45 bg-[#0a1a0e] border border-white/5 hover:border-white/15'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured article */}
      {featured && (
        <div className="bg-[#0a1a0e] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors cursor-pointer group">
          <div className="grid lg:grid-cols-2">
            <div className="relative h-48 lg:h-auto bg-[#122b17]">
              <img
                src={`https://images.unsplash.com/${featured.img}`}
                alt={featured.headline}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-85 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1a0e]/60 hidden lg:block" />
            </div>
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-[#f5a623] text-[#0a1a0e] font-bold px-2.5 py-1 rounded-full">
                  Pilihan Editor
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${featured.impactColor}`}
                >
                  {featured.impact}
                </span>
              </div>
              <h2 className="text-white font-semibold text-lg leading-snug mb-3 group-hover:text-[#7dc27e] transition-colors">
                {featured.headline}
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{featured.summary}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/30">{featured.source}</span>
                <span className="text-white/15">·</span>
                <span className="text-xs text-white/30">{featured.time}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((n) => (
          <div
            key={n.id}
            className="bg-[#0a1a0e] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors cursor-pointer group"
          >
            <div className="relative h-36 bg-[#122b17]">
              <img
                src={`https://images.unsplash.com/${n.img}`}
                alt={n.headline}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0e]/80 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="text-[10px] bg-[#0a1a0e]/80 text-white/60 px-2 py-0.5 rounded-full border border-white/10">
                  {n.tag}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${n.impactColor}`}>
                  {n.impact}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white text-sm font-semibold leading-snug mb-2 group-hover:text-[#7dc27e] transition-colors line-clamp-2">
                {n.headline}
              </h3>
              <p className="text-white/45 text-xs leading-relaxed line-clamp-2 mb-3">{n.summary}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/25">{n.source}</span>
                <span className="text-xs text-white/25">{n.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl mb-4 block">🔍</span>
          <p className="text-white/40 text-sm">Tidak ada berita yang cocok dengan filter Anda</p>
        </div>
      )}
    </div>
  )
}
