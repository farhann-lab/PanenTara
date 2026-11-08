'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const forecast = [
  { day: 'Sel 5/8', icon: '🌧️', high: 24, low: 19, rain: 85, hum: 88, wind: 18, risk: 'Tinggi' },
  { day: 'Rab 6/8', icon: '⛈️', high: 22, low: 18, rain: 92, hum: 92, wind: 24, risk: 'Tinggi' },
  { day: 'Kam 7/8', icon: '🌦️', high: 25, low: 20, rain: 60, hum: 80, wind: 15, risk: 'Sedang' },
  { day: 'Jum 8/8', icon: '⛅', high: 27, low: 21, rain: 30, hum: 72, wind: 12, risk: 'Rendah' },
  { day: 'Sab 9/8', icon: '🌤️', high: 29, low: 22, rain: 15, hum: 65, wind: 10, risk: 'Rendah' },
  { day: 'Min 10/8', icon: '☀️', high: 31, low: 23, rain: 10, hum: 60, wind: 8, risk: 'Rendah' },
  { day: 'Sen 11/8', icon: '☀️', high: 30, low: 22, rain: 12, hum: 62, wind: 9, risk: 'Rendah' },
  { day: 'Sel 12/8', icon: '⛅', high: 28, low: 21, rain: 25, hum: 70, wind: 11, risk: 'Rendah' },
  { day: 'Rab 13/8', icon: '🌦️', high: 26, low: 20, rain: 45, hum: 78, wind: 14, risk: 'Sedang' },
  { day: 'Kam 14/8', icon: '🌧️', high: 23, low: 18, rain: 75, hum: 85, wind: 20, risk: 'Tinggi' },
  { day: 'Jum 15/8', icon: '⛈️', high: 21, low: 17, rain: 88, hum: 90, wind: 22, risk: 'Tinggi' },
  { day: 'Sab 16/8', icon: '🌦️', high: 25, low: 20, rain: 55, hum: 76, wind: 13, risk: 'Sedang' },
  { day: 'Min 17/8', icon: '⛅', high: 27, low: 21, rain: 28, hum: 68, wind: 11, risk: 'Rendah' },
  { day: 'Sen 18/8', icon: '🌤️', high: 29, low: 22, rain: 18, hum: 63, wind: 9, risk: 'Rendah' },
]

const tempData = forecast.map((d) => ({
  day: d.day.split(' ')[0],
  high: d.high,
  low: d.low,
  rain: d.rain,
}))

const cropRisks = [
  {
    crop: 'Cabai Merah',
    icon: '🌶️',
    risks: [
      { label: 'Busuk Buah', level: 'Tinggi', color: 'text-red-400 bg-red-400/10' },
      { label: 'Antraknosa', level: 'Sedang', color: 'text-[#f5a623] bg-[#f5a623]/10' },
    ],
    advice: 'Kurangi penyiraman. Pastikan drainase lahan baik. Pertimbangkan fungisida preventif.',
  },
  {
    crop: 'Tomat',
    icon: '🍅',
    risks: [
      { label: 'Hawar Daun', level: 'Tinggi', color: 'text-red-400 bg-red-400/10' },
      { label: 'Busuk Pangkal', level: 'Rendah', color: 'text-[#7dc27e] bg-[#7dc27e]/10' },
    ],
    advice: 'Pasang mulsa untuk cegah percikan tanah. Semprotkan fungisida berbasis tembaga.',
  },
  {
    crop: 'Bawang Merah',
    icon: '🧅',
    risks: [{ label: 'Moler/Fusarium', level: 'Sedang', color: 'text-[#f5a623] bg-[#f5a623]/10' }],
    advice: 'Kondisi optimal. Pantau kelembaban dan lakukan rotasi tanaman jika perlu.',
  },
]

export default function Weather() {
  const [location, setLocation] = useState('Brebes, Jawa Tengah')
  const [selectedDay, setSelectedDay] = useState(0)
  const day = forecast[selectedDay]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Prediksi Cuaca Pertanian</h1>
          <p className="text-white/40 text-sm">
            Prakiraan hiperlokal 14 hari dengan analisis risiko per komoditas
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#0a1a0e] border border-white/10 rounded-xl px-4 py-2">
          <span className="text-base">📍</span>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent text-white/70 text-sm focus:outline-none"
          >
            {[
              'Brebes, Jawa Tengah',
              'Magelang, Jawa Tengah',
              'Nganjuk, Jawa Timur',
              'Garut, Jawa Barat',
            ].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current conditions */}
      <div className="bg-gradient-to-br from-[#0e1a2d] to-[#0a1a0e] border border-[#5b9bd5]/15 rounded-2xl p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-white/40 text-xs mb-2">Sekarang · Senin 4 Agustus</p>
            <div className="flex items-center gap-3">
              <span className="text-5xl">⛅</span>
              <div>
                <p className="font-display text-4xl text-white">28°C</p>
                <p className="text-white/50 text-sm">Berawan Sebagian</p>
              </div>
            </div>
          </div>
          {[
            { label: 'Kelembaban', value: '74%', icon: '💧', color: 'text-[#5b9bd5]' },
            { label: 'Kecepatan Angin', value: '12 km/j', icon: '🌬️', color: 'text-white/70' },
            { label: 'Probabilitas Hujan', value: '35%', icon: '🌧️', color: 'text-[#5b9bd5]' },
          ].map((c) => (
            <div key={c.label}>
              <p className="text-white/40 text-xs mb-3">{c.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{c.icon}</span>
                <p className={`font-display text-3xl ${c.color}`}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 14-day forecast strip */}
      <div className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-5">
        <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-4">
          Prakiraan 14 Hari
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {forecast.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`shrink-0 flex flex-col items-center gap-2 px-3 py-3 rounded-xl transition-all ${selectedDay === i ? 'bg-[#1e4226] border border-[#4fa05c]/30' : 'hover:bg-white/5'}`}
            >
              <span className="text-[10px] text-white/40 font-medium whitespace-nowrap">
                {d.day}
              </span>
              <span className="text-xl">{d.icon}</span>
              <span className="text-xs text-white font-medium">{d.high}°</span>
              <span className="text-[10px] text-white/30">{d.low}°</span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  d.risk === 'Tinggi'
                    ? 'bg-red-400/15 text-red-400'
                    : d.risk === 'Sedang'
                      ? 'bg-[#f5a623]/15 text-[#f5a623]'
                      : 'bg-[#4fa05c]/15 text-[#7dc27e]'
                }`}
              >
                {d.risk}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected day detail + chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-6">
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-4">
            Detail {day.day}
          </p>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-4xl">{day.icon}</span>
            <div>
              <p className="font-display text-3xl text-white">
                {day.high}° / {day.low}°
              </p>
              <p
                className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${
                  day.risk === 'Tinggi'
                    ? 'bg-red-400/15 text-red-400'
                    : day.risk === 'Sedang'
                      ? 'bg-[#f5a623]/15 text-[#f5a623]'
                      : 'bg-[#4fa05c]/15 text-[#7dc27e]'
                }`}
              >
                Risiko {day.risk}
              </p>
            </div>
          </div>
          {[
            { label: 'Curah Hujan', value: `${day.rain}%` },
            { label: 'Kelembaban', value: `${day.hum}%` },
            { label: 'Angin', value: `${day.wind} km/j` },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between py-2.5 border-b border-white/5 last:border-0"
            >
              <span className="text-sm text-white/50">{item.label}</span>
              <span className="text-sm text-white font-semibold">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-[#0a1a0e] border border-white/5 rounded-2xl p-6">
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-4">
            Suhu & Curah Hujan 14 Hari
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={tempData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5a623" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#f5a623" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5b9bd5" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#5b9bd5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="day"
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
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
              <Area
                type="monotone"
                dataKey="high"
                stroke="#f5a623"
                strokeWidth={2}
                fill="url(#highGrad)"
                name="Suhu Maks (°C)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="rain"
                stroke="#5b9bd5"
                strokeWidth={2}
                fill="url(#rainGrad)"
                name="Peluang Hujan (%)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crop risk analysis */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-4">
          Analisis Risiko Per Komoditas
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {cropRisks.map((c) => (
            <div
              key={c.crop}
              className="bg-[#0a1a0e] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{c.icon}</span>
                <p className="text-white font-semibold text-sm">{c.crop}</p>
              </div>
              <div className="space-y-2 mb-4">
                {c.risks.map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-xs text-white/50">{r.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.color}`}>
                      {r.level}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-white/3 border border-white/5 rounded-xl p-3">
                <p className="text-[10px] text-white/40 font-semibold mb-1">💡 Saran</p>
                <p className="text-xs text-white/50 leading-relaxed">{c.advice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
