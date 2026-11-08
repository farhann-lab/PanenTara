'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0a1a0e]/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-18">
        <a href="#" className="flex items-center gap-3 group">
          <img
            src="/panentara/logo.png"
            alt="PanenTara logo"
            className="h-10 w-10 object-contain"
          />
          <span
            style={{ fontFamily: 'Play, sans-serif' }}
            className="text-xl text-white tracking-tight"
          >
            PanenTara
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {['Fitur', 'Cara Kerja', 'Harga', 'Blog'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-white/60 hover:text-white font-medium transition-colors px-4 py-2"
          >
            Masuk
          </button>
          <button
            onClick={() => router.push('/login')}
            className="text-sm bg-[#f5a623] text-[#0a1a0e] font-semibold px-4 py-2 rounded-lg hover:bg-[#f7bd58] transition-colors duration-200"
          >
            Mulai Gratis
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white/70 hover:text-white p-1"
        >
          <div className="w-5 h-0.5 bg-current mb-1.5" />
          <div className="w-5 h-0.5 bg-current mb-1.5" />
          <div className="w-5 h-0.5 bg-current" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0a1a0e]/98 backdrop-blur-md border-t border-white/5 px-6 py-6 flex flex-col gap-4">
          {['Fitur', 'Cara Kerja', 'Harga', 'Blog'].map((item) => (
            <a key={item} href="#" className="text-white/70 hover:text-white font-medium py-1">
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
            <button
              onClick={() => router.push('/login')}
              className="text-white/70 font-medium py-1 text-left"
            >
              Masuk
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-[#f5a623] text-[#0a1a0e] font-semibold text-center py-2.5 rounded-lg"
            >
              Mulai Gratis
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

function DashboardCard() {
  const commodities = [
    { name: 'Cabai Merah', price: 'Rp 42.500', change: '+8.2%', up: true },
    { name: 'Bawang Merah', price: 'Rp 28.000', change: '-2.1%', up: false },
    { name: 'Tomat', price: 'Rp 11.200', change: '+14.7%', up: true },
    { name: 'Jagung', price: 'Rp 6.800', change: '+1.3%', up: true },
  ]
  return (
    <div className="bg-[#0a1a0e]/80 backdrop-blur-sm border border-[#4fa05c]/15 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-0.5">
            Market Intelligence
          </p>
          <p className="text-white font-semibold">Harga Komoditas Hari Ini</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#1e4226]/60 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4fa05c] animate-pulse" />
          <span className="text-xs text-[#7dc27e]">Live</span>
        </div>
      </div>
      <div className="space-y-2 mb-5">
        {commodities.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between bg-[#122b17]/40 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.up ? 'bg-[#1e4226]' : 'bg-[#2d1a0e]'}`}
              >
                <span className="text-base">
                  {c.name === 'Cabai Merah'
                    ? '🌶'
                    : c.name === 'Bawang Merah'
                      ? '🧅'
                      : c.name === 'Tomat'
                        ? '🍅'
                        : '🌽'}
                </span>
              </div>
              <span className="text-sm text-white/80 font-medium">{c.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-white font-semibold">{c.price}</p>
              <p className={`text-xs font-medium ${c.up ? 'text-[#7dc27e]' : 'text-[#f5a623]'}`}>
                {c.change}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#f5a623]/10 border border-[#f5a623]/20 rounded-xl px-4 py-3 flex items-start gap-3">
        <span className="text-lg mt-0.5">💡</span>
        <div>
          <p className="text-xs text-[#f5a623] font-semibold mb-0.5">Rekomendasi AI</p>
          <p className="text-xs text-white/60 leading-relaxed">
            Harga cabai naik signifikan. Pertimbangkan memperluas lahan atau jadwalkan panen lebih
            awal.
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between bg-[#122b17]/40 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⛅</span>
          <span className="text-sm text-white/70">Cuaca Hari Ini · Padang</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white font-medium">28°C</span>
          <span className="text-xs text-[#7dc27e] bg-[#1e4226] px-2 py-0.5 rounded-full">
            Optimal
          </span>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const router = useRouter()
  return (
    <section className="relative min-h-screen bg-[#060e08] overflow-hidden flex flex-col justify-center">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #1e4226 0%, transparent 50%), radial-gradient(circle at 80% 20%, #122b17 0%, transparent 45%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#4fa05c 1px, transparent 1px), linear-gradient(90deg, #4fa05c 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute inset-0 bg-[#060e08]">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2400&h=1400&fit=crop&auto=format&q=90"
          alt="Rice field"
          className="w-full h-full object-cover opacity-10 mix-blend-luminosity"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1e4226]/60 border border-[#4fa05c]/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fa05c] animate-pulse" />
              <span className="text-xs text-[#7dc27e] font-medium tracking-wide uppercase">
                AI-Powered Agri Intelligence
              </span>
            </div>
            <h1 className="font-display text-[3rem] lg:text-[4.25rem] leading-[1.05] text-white mb-6">
              {'Panen Lebih Cerdas, '}
              <span className="text-[#7dc27e]">{'Bukan Lebih Keras'}</span>
            </h1>
            <p className="text-lg text-white/55 leading-relaxed mb-10 max-w-lg">
              PanenTara mengintegrasikan data cuaca, harga komoditas, dan permintaan pasar secara
              real-time — sehingga setiap keputusan tanam Anda didukung oleh data, bukan perkiraan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center justify-center gap-2 bg-[#f5a623] text-[#0a1a0e] font-semibold px-6 py-3.5 rounded-lg hover:bg-[#f7bd58] transition-colors duration-200"
              >
                Mulai Gratis
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white border border-white/15 hover:border-white/30 px-6 py-3.5 rounded-lg transition-all duration-200 font-medium"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M6.5 5.5L10.5 8L6.5 10.5V5.5Z" fill="currentColor" />
                </svg>
                Lihat Demo
              </button>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2">
                {[
                  'photo-1507003211169-0a1dd7228f2d',
                  'photo-1500648767791-00dcc994a43e',
                  'photo-1438761681033-6461ffad8d80',
                  'photo-1472099645785-5658abf4ff4e',
                ].map((id, i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/${id}?w=96&h=96&fit=crop&auto=format&q=85`}
                    alt="Petani"
                    className="w-8 h-8 rounded-full border-2 border-[#060e08] object-cover bg-[#1e4226]"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            <DashboardCard />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060e08] to-transparent" />
    </section>
  )
}

function Stats() {
  const items = [
    { value: '12.400+', label: 'Petani Aktif', sub: 'di 24 provinsi' },
    { value: '340+', label: 'Komoditas', sub: 'dipantau real-time' },
    { value: '68%', label: 'Kurangi Kerugian', sub: 'akibat oversupply' },
    { value: 'Rp 2,8M', label: 'Potensi Pendapatan', sub: 'rata-rata per petani/tahun' },
  ]
  return (
    <section className="bg-[#f5a623] py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#0a1a0e]/15">
          {items.map((item, i) => (
            <div key={i} className="lg:px-10 first:pl-0 last:pr-0 text-center lg:text-left">
              <p className="font-display text-4xl lg:text-5xl text-[#0a1a0e] leading-none mb-1">
                {item.value}
              </p>
              <p className="text-[#0a1a0e] font-semibold text-sm mb-0.5">{item.label}</p>
              <p className="text-[#2a5c34] text-xs font-medium">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const router = useRouter()
  const features = [
    {
      icon: '📊',
      title: 'Market Intelligence',
      desc: 'Pantau harga komoditas, tren permintaan, dan pergerakan pasar secara real-time dari seluruh pasar induk di Indonesia.',
      tag: 'Real-time Data',
      path: '/dashboard/market',
    },
    {
      icon: '🤝',
      title: 'Buyer Matching',
      desc: 'Sistem pencocokan otomatis menghubungkan Anda dengan pembeli yang membutuhkan komoditas spesifik sebelum masa panen tiba.',
      tag: 'AI Matching',
      path: '/dashboard/buyer-matching',
    },
    {
      icon: '🌤️',
      title: 'Prediksi Cuaca Pertanian',
      desc: 'Data cuaca hiperlokal 14-hari dengan model risiko spesifik komoditas — bukan sekadar ramalan umum.',
      tag: 'Hiperlokal',
      path: '/dashboard/weather',
    },
    {
      icon: '🧠',
      title: 'Rekomendasi Budidaya AI',
      desc: 'Sistem AI menganalisis kondisi lokal, historis harga, dan proyeksi pasar untuk memberi saran jadwal tanam yang optimal.',
      tag: 'Keputusan Data',
      path: '/dashboard/ai',
    },
    {
      icon: '📉',
      title: 'Manajemen Risiko Produksi',
      desc: 'Deteksi dini potensi oversupply di wilayah Anda dengan alert sebelum terjadi kerugian massal di rantai pasok.',
      tag: 'Pencegahan',
      path: '/dashboard/risk',
    },
    {
      icon: '🗞️',
      title: 'Berita & Kebijakan Pertanian',
      desc: 'Agregasi berita, regulasi, dan kebijakan pemerintah yang relevan, disaring dan disajikan sesuai komoditas Anda.',
      tag: 'Terkurasi AI',
      path: '/dashboard/news',
    },
  ]
  return (
    <section id="fitur" className="bg-[#faf7f2] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-widest text-[#377a44] font-semibold mb-4">
            Fitur Unggulan
          </p>
          <h2 className="font-display text-4xl lg:text-5xl text-[#0a1a0e] leading-tight mb-5">
            Analisis data yang siap membantu anda
          </h2>
          <p className="text-[#4a2e1a]/60 text-lg leading-relaxed">
            Dari lahan ke pasar — semua informasi yang Anda butuhkan tersaji dalam satu platform
            terintegrasi.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <button
              key={i}
              onClick={() => router.push(f.path)}
              className="group bg-white border border-[#ede4d3] rounded-2xl p-6 hover:border-[#4fa05c]/40 hover:shadow-lg hover:shadow-[#4fa05c]/5 transition-all duration-300 text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-[#f0f9f1] flex items-center justify-center mb-4 text-xl group-hover:bg-[#ddf0de] transition-colors duration-200">
                {f.icon}
              </div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-[#0a1a0e] text-base leading-snug">{f.title}</h3>
                <span className="shrink-0 text-xs text-[#377a44] bg-[#f0f9f1] px-2 py-1 rounded-full font-medium border border-[#b2dcb3]/50">
                  {f.tag}
                </span>
              </div>
              <p className="text-sm text-[#4a2e1a]/60 leading-relaxed">{f.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-[#377a44] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Lihat Prototype
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6H10M10 6L7 3M10 6L7 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const items = [
    {
      quote:
        'Dulu saya sering merugi karena harga cabai anjlok saat panen raya. Sekarang dengan PanenTara, saya tahu kapan waktu yang tepat tanam — dan sudah ada pembeli sebelum panen.',
      name: 'Pak Sumarno',
      role: 'Petani Cabai, Brebes',
      img: 'photo-1506277886164-e25aa3f4ef7f?w=128&h=128&fit=crop&auto=format&q=85',
    },
    {
      quote:
        'Market Intelligence PanenTara membantu saya memantau harga di berbagai kota sekaligus. Saya tidak lagi bergantung pada informasi tengkulak yang sering tidak akurat.',
      name: 'Bu Yanti Rahayu',
      role: 'Petani Bawang, Nganjuk',
      img: 'photo-1531746020798-e6953c6e8e04?w=128&h=128&fit=crop&auto=format&q=85',
    },
    {
      quote:
        'Fitur cuaca hiperlokal sangat membantu. Saya bisa antisipasi hama dan penyakit lebih awal karena tahu kondisi kelembaban yang akurat di lahan saya.',
      name: 'Mas Hendra Wijaya',
      role: 'Petani Tomat, Malang',
      img: 'photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&auto=format&q=85',
    },
  ]
  return (
    <section className="bg-[#0a1a0e] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-[#7dc27e] font-semibold mb-4">
            Cerita Petani
          </p>
          <h2 className="font-display text-4xl lg:text-5xl text-white leading-tight">
            {'Dibuktikan di lapangan, '}
            <span className="text-[#7dc27e]">{'bukan di ruang rapat'}</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <div key={i} className="bg-[#122b17]/40 border border-[#4fa05c]/10 rounded-2xl p-6">
              <div className="flex mb-4 gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="#f5a623">
                    <path d="M7 1L8.854 5.146H13.5L9.823 7.854L11.177 12L7 9.292L2.823 12L4.177 7.854L0.5 5.146H5.146L7 1Z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={`https://images.unsplash.com/${t.img}`}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover bg-[#1e4226]"
                />
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const [annual, setAnnual] = useState(false)
  const router = useRouter()

  const plans = [
    {
      name: 'Gratis',
      price: 'Rp 0',
      period: 'selamanya',
      desc: 'Untuk petani yang baru mulai menggunakan data dalam pengambilan keputusan.',
      features: [
        'Analisis suply-demand komoditas',
        'Informasi cuaca & kondisi wilayah',
        'Insight AI dasar',
        'Berita & Market Update',
        'Smart Alert',
      ],
      cta: 'Mulai Gratis',
      highlight: false,
    },
    {
      name: 'Premium',
      price: annual ? 'Rp 23.000' : 'Rp 29.000',
      period: annual ? '/bulan, tagih tahunan' : '/bulan',
      desc: 'Untuk petani aktif yang ingin memaksimalkan hasil dan akses ke pembeli.',
      features: [
        'Insight AI yang lebih mendalam',
        'Analisis profitabilitas komoditas',
        'Simulasi strategi usaha tani',
        'Dashboard analitik premium',
        'Laporan analisis siap unduh (PDF)',
        'Prioritas akses Buyer Matching',
        'Riwayat analisis tanpa batas',
      ],
      cta: 'Coba 14 Hari Gratis',
      highlight: true,
    },
    {
      name: 'Koperasi/Kelembagaan',
      price: 'Rp 299.000',
      period: 'hubungi kami',
      desc: 'Untuk koperasi tani, dinas pertanian, atau aggregator dengan kebutuhan skala besar.',
      features: [
        'Semua fitur Pro',
        'Buyer Matching tak terbatas',
        'API integrasi',
        'Dashboard koperasi',
        'Manajer akun dedikasi',
        'Pelatihan on-site',
        'SLA & dukungan prioritas',
      ],
      cta: 'Hubungi Tim Kami',
      highlight: false,
    },
  ]

  return (
    <section id="harga" className="bg-[#faf7f2] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-[#377a44] font-semibold mb-4">
            Harga
          </p>
          <h2 className="font-display text-4xl lg:text-5xl text-[#0a1a0e] leading-tight mb-5">
            Investasi yang sepadan
          </h2>
          <p className="text-[#4a2e1a]/60 text-lg max-w-xl mx-auto mb-8">
            Dimulai dari gratis — upgrade kapan saja saat kebutuhan Anda bertumbuh.
          </p>

          <div className="inline-flex items-center gap-3 bg-[#ede4d3]/60 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`text-sm px-4 py-2 rounded-full font-medium transition-all ${!annual ? 'bg-white text-[#0a1a0e] shadow-sm' : 'text-[#4a2e1a]/60'}`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`text-sm px-4 py-2 rounded-full font-medium transition-all ${annual ? 'bg-white text-[#0a1a0e] shadow-sm' : 'text-[#4a2e1a]/60'}`}
            >
              Tahunan
              <span className="ml-2 text-xs bg-[#ddf0de] text-[#377a44] px-1.5 py-0.5 rounded-full">
                Hemat 17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-7 border transition-all duration-300 ${
                plan.highlight
                  ? 'bg-[#0a1a0e] border-[#4fa05c]/30 shadow-2xl shadow-[#0a1a0e]/20 scale-[1.02]'
                  : 'bg-white border-[#ede4d3] hover:border-[#4fa05c]/20'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f5a623] text-[#0a1a0e] text-xs font-bold px-4 py-1.5 rounded-full">
                  Paling Populer
                </div>
              )}
              <p
                className={`font-semibold text-sm mb-2 ${plan.highlight ? 'text-[#7dc27e]' : 'text-[#377a44]'}`}
              >
                {plan.name}
              </p>
              <div className="mb-1">
                <span
                  className={`font-display text-4xl ${plan.highlight ? 'text-white' : 'text-[#0a1a0e]'}`}
                >
                  {plan.price}
                </span>
              </div>
              <p
                className={`text-xs mb-4 ${plan.highlight ? 'text-white/40' : 'text-[#4a2e1a]/40'}`}
              >
                {plan.period}
              </p>
              <p
                className={`text-sm leading-relaxed mb-7 ${plan.highlight ? 'text-white/55' : 'text-[#4a2e1a]/60'}`}
              >
                {plan.desc}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2.5">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-[#1e4226]' : 'bg-[#ddf0de]'}`}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M1.5 4L3.2 6L6.5 2"
                          stroke={plan.highlight ? '#7dc27e' : '#377a44'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span
                      className={`text-sm ${plan.highlight ? 'text-white/70' : 'text-[#4a2e1a]/70'}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push('/login')}
                className={`block w-full text-center text-sm font-semibold py-3 rounded-lg transition-colors duration-200 ${
                  plan.highlight
                    ? 'bg-[#f5a623] text-[#0a1a0e] hover:bg-[#f7bd58]'
                    : 'bg-[#0a1a0e] text-white hover:bg-[#1e4226]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  const router = useRouter()
  return (
    <section className="bg-[#060e08] py-24 lg:py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 100%, #1e4226, transparent)`,
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-[#7dc27e] font-semibold mb-6">
          Mulai Sekarang
        </p>
        <h2 className="font-display text-4xl lg:text-6xl text-white leading-tight mb-7">
          {'Tanam dengan bijak,'}
          <br />
          <span className="text-[#7dc27e]">{'panen dengan baik'}</span>
        </h2>
        <p className="text-white/50 text-lg mb-10 leading-relaxed">
          Bergabunglah dengan lebih dari 12.000 petani yang sudah membuat keputusan berdasarkan
          data, bukan sekadar pengalaman turun-temurun.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="inline-flex items-center justify-center gap-2 bg-[#f5a623] text-[#0a1a0e] font-semibold px-8 py-4 rounded-xl hover:bg-[#f7bd58] transition-colors duration-200"
        >
          Daftar Gratis
        </button>
        <p className="text-white/25 text-sm mt-6">Uji coba gratis 14 hari untuk paket Pro</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#060e08] border-t border-white/5 py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/panentara/logo.png"
                alt="PanenTara logo"
                className="h-10 w-10 object-contain"
              />
              <span
                style={{ fontFamily: 'Play, sans-serif' }}
                className="text-xl text-white tracking-tight"
              >
                PanenTara
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Platform AI untuk ekosistem pertanian yang lebih cerdas, transparan, dan efisien.
            </p>
          </div>
          {[
            {
              title: 'Produk',
              links: ['Fitur', 'Harga', 'Market Intelligence', 'Buyer Matching', 'Prediksi Cuaca'],
            },
            { title: 'Perusahaan', links: ['Tentang Kami', 'Blog', 'Karir', 'Press Kit'] },
            {
              title: 'Dukungan',
              links: ['Pusat Bantuan', 'Komunitas', 'Status Layanan', 'Hubungi Kami'],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-white/60 font-semibold text-xs uppercase tracking-widest mb-4">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/40 hover:text-white/70 text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © 2025 PanenTara. Seluruh hak dilindungi undang-undang.
          </p>
          <div className="flex gap-6">
            {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Cookie'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/25 hover:text-white/50 text-xs transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Landing() {
  return (
    <div className="font-sans antialiased" translate="no">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}
