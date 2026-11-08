'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

const priceHistory: Record<string, { date: string; price: number }[]> = {
  'Cabai Merah': [
    { date: '10/7', price: 38000 },
    { date: '13/7', price: 39500 },
    { date: '16/7', price: 37000 },
    { date: '19/7', price: 40000 },
    { date: '22/7', price: 41500 },
    { date: '25/7', price: 43000 },
    { date: '28/7', price: 41000 },
    { date: '31/7', price: 42500 },
    { date: '3/8', price: 44000 },
  ],
  'Bawang Merah': [
    { date: '10/7', price: 30000 },
    { date: '13/7', price: 29500 },
    { date: '16/7', price: 31000 },
    { date: '19/7', price: 30500 },
    { date: '22/7', price: 29000 },
    { date: '25/7', price: 28500 },
    { date: '28/7', price: 28000 },
    { date: '31/7', price: 27500 },
    { date: '3/8', price: 28000 },
  ],
  Tomat: [
    { date: '10/7', price: 9500 },
    { date: '13/7', price: 10000 },
    { date: '16/7', price: 9800 },
    { date: '19/7', price: 10500 },
    { date: '22/7', price: 11000 },
    { date: '25/7', price: 11200 },
    { date: '28/7', price: 10800 },
    { date: '31/7', price: 11200 },
    { date: '3/8', price: 11500 },
  ],
  Jagung: [
    { date: '10/7', price: 6500 },
    { date: '13/7', price: 6600 },
    { date: '16/7', price: 6700 },
    { date: '19/7', price: 6650 },
    { date: '22/7', price: 6800 },
    { date: '25/7', price: 6750 },
    { date: '28/7', price: 6800 },
    { date: '31/7', price: 6900 },
    { date: '3/8', price: 6800 },
  ],
}

const commodities = [
  {
    name: 'Cabai Merah',
    emoji: '🌶️',
    price: 44000,
    prev: 42500,
    unit: '/kg',
    region: 'Jawa Tengah',
    change: +3.5,
    supply: 'Rendah',
    demand: 'Tinggi',
  },
  {
    name: 'Bawang Merah',
    emoji: '🧅',
    price: 28000,
    prev: 28500,
    unit: '/kg',
    region: 'Jawa Timur',
    change: -1.8,
    supply: 'Tinggi',
    demand: 'Normal',
  },
  {
    name: 'Tomat',
    emoji: '🍅',
    price: 11500,
    prev: 11200,
    unit: '/kg',
    region: 'Jawa Barat',
    change: +2.7,
    supply: 'Normal',
    demand: 'Tinggi',
  },
  {
    name: 'Jagung',
    emoji: '🌽',
    price: 6800,
    prev: 6900,
    unit: '/kg',
    region: 'Jawa Tengah',
    change: -1.4,
    supply: 'Normal',
    demand: 'Normal',
  },
  {
    name: 'Singkong',
    emoji: '🥔',
    price: 3200,
    prev: 3100,
    unit: '/kg',
    region: 'Lampung',
    change: +3.2,
    supply: 'Normal',
    demand: 'Normal',
  },
  {
    name: 'Kedelai',
    emoji: '🫘',
    price: 14500,
    prev: 14200,
    unit: '/kg',
    region: 'Jawa Tengah',
    change: +2.1,
    supply: 'Rendah',
    demand: 'Tinggi',
  },
]

const markets = [
  'Semua Pasar',
  'Kramat Jati',
  'Induk Tanah Tinggi',
  'Caringin Bandung',
  'Grosir Surabaya',
]

export default function MarketIntelligence() {
  const [selected, setSelected] = useState('Cabai Merah')
  const [range, setRange] = useState('1B')
  const [market, setMarket] = useState('Semua Pasar')
  const [search, setSearch] = useState('')

  const filtered = commodities.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  const chartData = priceHistory[selected] || priceHistory['Cabai Merah']
  const current = commodities.find((c) => c.name === selected) || commodities[0]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Market Intelligence</h1>
          <p className="text-white/40 text-sm">
            Harga komoditas real-time dari 28 pasar induk Indonesia
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#1e4226]/60 border border-[#4fa05c]/20 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4fa05c] animate-pulse" />
          <span className="text-xs text-[#7dc27e]">Diperbarui 5 menit lalu</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
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
            placeholder="Cari komoditas..."
            className="bg-[#0a1a0e] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/70 placeholder-white/25 focus:outline-none focus:border-white/20 w-44"
          />
        </div>
        <select
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className="bg-[#0a1a0e] border border-white/10 rounded-xl px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-white/20"
        >
          {markets.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Commodity list */}
        <div className="space-y-2">
          {filtered.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelected(c.name)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${selected === c.name ? 'bg-[#1e4226] border-[#4fa05c]/30' : 'bg-[#0a1a0e] border-white/5 hover:border-white/10'}`}
            >
              <span className="text-xl">{c.emoji}</span>
              <div className="flex-1 text-left">
                <p
                  className={`text-sm font-semibold ${selected === c.name ? 'text-white' : 'text-white/80'}`}
                >
                  {c.name}
                </p>
                <p className="text-xs text-white/35">{c.region}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white font-bold">Rp {c.price.toLocaleString('id-ID')}</p>
                <p
                  className={`text-xs font-semibold ${c.change > 0 ? 'text-[#7dc27e]' : 'text-[#f5a623]'}`}
                >
                  {c.change > 0 ? '▲' : '▼'} {Math.abs(c.change)}%
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Chart & detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Price chart */}
          <div className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{current.emoji}</span>
                  <h3 className="text-white font-semibold">{selected}</h3>
                </div>
                <p className="font-display text-3xl text-white">
                  Rp {current.price.toLocaleString('id-ID')}
                  <span className="text-sm text-white/40 font-sans">{current.unit}</span>
                </p>
                <p
                  className={`text-sm font-semibold mt-1 ${current.change > 0 ? 'text-[#7dc27e]' : 'text-[#f5a623]'}`}
                >
                  {current.change > 0 ? '▲' : '▼'} {Math.abs(current.change)}% dari kemarin
                </p>
              </div>
              <div className="flex gap-1">
                {['1M', '1B', '3B', '6B'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${range === r ? 'bg-[#1e4226] text-[#7dc27e]' : 'text-white/35 hover:text-white/60'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={38}
                />
                <Tooltip
                  contentStyle={{
                    background: '#122b17',
                    border: '1px solid rgba(79,160,92,0.2)',
                    borderRadius: 10,
                    fontSize: 12,
                    color: '#fff',
                  }}
                  formatter={(v) => [`Rp ${(v as number).toLocaleString('id-ID')}`, 'Harga']}
                />
                <ReferenceLine
                  y={current.prev}
                  stroke="rgba(245,166,35,0.3)"
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4fa05c"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#4fa05c' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Supply/Demand & regional */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-5">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Kondisi Pasar</p>
              {[
                {
                  label: 'Pasokan',
                  val: current.supply,
                  color:
                    current.supply === 'Rendah'
                      ? 'text-[#f5a623] bg-[#2d1a0e]'
                      : current.supply === 'Tinggi'
                        ? 'text-[#7dc27e] bg-[#1e4226]'
                        : 'text-white/60 bg-white/5',
                },
                {
                  label: 'Permintaan',
                  val: current.demand,
                  color:
                    current.demand === 'Tinggi'
                      ? 'text-[#7dc27e] bg-[#1e4226]'
                      : 'text-white/60 bg-white/5',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-sm text-white/60">{item.label}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.color}`}>
                    {item.val}
                  </span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-[#f5a623]/8 border border-[#f5a623]/15 rounded-xl">
                <p className="text-xs text-[#f5a623] font-semibold mb-1">Sinyal Pasar</p>
                <p className="text-xs text-white/50 leading-relaxed">
                  {current.supply === 'Rendah' && current.demand === 'Tinggi'
                    ? 'Peluang bagus! Pasokan terbatas dengan permintaan tinggi mendorong harga naik.'
                    : current.supply === 'Tinggi'
                      ? 'Hati-hati! Pasokan berlebih dapat menekan harga ke depan.'
                      : 'Kondisi pasar relatif stabil untuk komoditas ini.'}
                </p>
              </div>
            </div>

            <div className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-5">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Harga Per Kota</p>
              {[
                { kota: 'Jakarta', harga: current.price + 2000 },
                { kota: 'Surabaya', harga: current.price - 1500 },
                { kota: 'Bandung', harga: current.price + 500 },
                { kota: 'Semarang', harga: current.price - 2000 },
              ].map((k) => (
                <div
                  key={k.kota}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-sm text-white/60">{k.kota}</span>
                  <span className="text-sm text-white font-medium">
                    Rp {k.harga.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
