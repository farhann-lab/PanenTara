'use client'

import { useState, useRef } from 'react'

interface ProfilePanelProps {
  open: boolean
  onClose: () => void
}

export default function ProfilePanel({ open, onClose }: ProfilePanelProps) {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: 'Rasya Wijaya',
    email: 'rasya.wijaya@email.com',
    phone: '+62 812-3456-7890',
    location: 'Padang, Sumatera Barat',
    plan: 'Premium',
    joined: 'Agustus 2026',
    bio: 'Petani aktif komoditas cabai dan tomat di Padang. Menggunakan PanenTara untuk keputusan tanam berbasis data.',
    luas: '2.5 ha',
    komoditas: 'Cabai Merah, Tomat, Bawang Merah',
  })

  const [draft, setDraft] = useState({ ...form })

  const handleSave = () => {
    setForm({ ...draft })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleCancel = () => {
    setDraft({ ...form })
    setEditing(false)
  }

  const Field = ({
    label,
    field,
    type = 'text',
  }: {
    label: string
    field: keyof typeof form
    type?: string
  }) => (
    <div>
      <p className="text-white/35 text-xs mb-1.5">{label}</p>
      {editing ? (
        field === 'bio' ? (
          <textarea
            value={draft[field]}
            onChange={(e) => setDraft((d) => ({ ...d, [field]: e.target.value }))}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-[#4fa05c]/50 resize-none transition-colors"
          />
        ) : (
          <input
            type={type}
            value={draft[field]}
            onChange={(e) => setDraft((d) => ({ ...d, [field]: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-[#4fa05c]/50 transition-colors"
          />
        )
      ) : (
        <p className="text-white text-sm font-medium">{form[field]}</p>
      )}
    </div>
  )

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#0a1a0e] border-l border-white/8 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <p className="text-white font-semibold">Profil Saya</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Avatar + name */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b border-white/5">
            <div className="relative">
              <img
                src="/panentara/avatar-profile.jpeg"
                alt="Rasya Wijaya"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#4fa05c]/30"
              />
              {editing && (
                <>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M9 3.5H4.5A1.5 1.5 0 003 5v8.5A1.5 1.5 0 004.5 15h9a1.5 1.5 0 001.5-1.5V9M11 2l2 2-5.5 5.5H5.5V8L11 2z"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">{form.name}</p>
              <div className="flex items-center gap-2 justify-center mt-1">
                <span className="text-xs bg-[#f5a623]/15 text-[#f5a623] border border-[#f5a623]/20 px-2.5 py-0.5 rounded-full font-semibold">
                  {form.plan}
                </span>
                <span className="text-white/35 text-xs">Bergabung {form.joined}</span>
              </div>
            </div>
          </div>

          {/* Saved toast */}
          {saved && (
            <div className="bg-[#1e4226] border border-[#4fa05c]/30 rounded-xl px-4 py-3 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 7L5.5 10.5L12 4"
                  stroke="#7dc27e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#7dc27e] text-xs font-semibold">Profil berhasil disimpan</span>
            </div>
          )}

          {/* Informasi Akun */}
          <div className="space-y-4">
            <p className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">
              Informasi Akun
            </p>
            <Field label="Nama Lengkap" field="name" />
            <Field label="Email" field="email" type="email" />
            <Field label="Nomor Telepon" field="phone" type="tel" />
            <Field label="Lokasi" field="location" />
            <Field label="Bio" field="bio" />
          </div>

          {/* Informasi Lahan */}
          <div className="space-y-4">
            <p className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">
              Informasi Lahan
            </p>
            <Field label="Luas Lahan" field="luas" />
            <Field label="Komoditas Utama" field="komoditas" />
          </div>

          {/* Statistik (read-only) */}
          <div className="space-y-3">
            <p className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">
              Statistik Akun
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Transaksi', value: '12' },
                { label: 'Buyer Match', value: '28' },
                { label: 'Alert Dibaca', value: '47' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/3 border border-white/5 rounded-xl p-3 text-center"
                >
                  <p className="text-white font-bold text-lg">{s.value}</p>
                  <p className="text-white/35 text-[10px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          {!editing && (
            <div className="border border-red-400/15 rounded-xl p-4 space-y-2">
              <p className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">
                Zona Bahaya
              </p>
              <button className="w-full text-left text-xs text-red-400/70 hover:text-red-400 transition-colors py-1">
                Hapus Akun Permanen
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-white/5 shrink-0">
          {editing ? (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 border border-white/15 text-white/60 hover:text-white hover:border-white/25 font-medium py-3 rounded-xl text-sm transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-[#f5a623] text-[#0a1a0e] font-bold py-3 rounded-xl text-sm hover:bg-[#f7bd58] transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-[#1e4226] border border-[#4fa05c]/25 text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#2a5c34] transition-colors flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9.5 2L12 4.5L5 11.5H2.5V9L9.5 2Z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit Profil
            </button>
          )}
        </div>
      </div>
    </>
  )
}
