'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const steps = ['Data Diri', 'Upload KTP', 'Foto Selfie', 'Review']

export default function VerifyKTP() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [nik, setNik] = useState('')
  const [fullName, setFullName] = useState('')
  const [dob, setDob] = useState('')
  const [ktpFile, setKtpFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [ktpPreview, setKtpPreview] = useState('')
  const [selfiePreview, setSelfiePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const ktpRef = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File, type: 'ktp' | 'selfie') => {
    const url = URL.createObjectURL(file)
    if (type === 'ktp') {
      setKtpFile(file)
      setKtpPreview(url)
    } else {
      setSelfieFile(file)
      setSelfiePreview(url)
    }
  }

  const handleDrop = (e: React.DragEvent, type: 'ktp' | 'selfie') => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file, type)
  }

  const next = () => {
    if (step === steps.length - 1) {
      setLoading(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    } else {
      setStep((s) => s + 1)
    }
  }

  const canNext = () => {
    if (step === 0) return nik.length === 16 && fullName.length > 2 && dob
    if (step === 1) return !!ktpFile
    if (step === 2) return !!selfieFile
    return true
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans antialiased" translate="no">
      {/* Top bar */}
      <header className="bg-white border-b border-[#ede4d3] px-6 py-4 flex items-center justify-between">
        <Link href="/login">
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
        <div className="flex items-center gap-2 text-sm text-[#4a2e1a]/50">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1L8.545 5.09H13L9.477 7.682L10.854 12L7 9.409L3.146 12L4.523 7.682L1 5.09H5.455L7 1Z"
              fill="#f5a623"
            />
          </svg>
          Verifikasi Akun Seller
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Progress steps */}
        <div className="mb-10">
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i < step
                        ? 'bg-[#4fa05c] text-white'
                        : i === step
                          ? 'bg-[#0a1a0e] text-white'
                          : 'bg-[#ede4d3] text-[#4a2e1a]/40'
                    }`}
                  >
                    {i < step ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M2.5 7L5.5 10.5L11.5 4"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1.5 font-medium whitespace-nowrap ${i === step ? 'text-[#0a1a0e]' : 'text-[#4a2e1a]/40'}`}
                  >
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mb-4 mx-2 transition-colors ${i < step ? 'bg-[#4fa05c]' : 'bg-[#ede4d3]'}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl border border-[#ede4d3] p-8 shadow-sm">
          {/* Step 0: Data Diri */}
          {step === 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#f0f9f1] flex items-center justify-center text-lg">
                  🪪
                </div>
                <div>
                  <h2 className="font-display text-xl text-[#0a1a0e]">Data Diri Sesuai KTP</h2>
                  <p className="text-sm text-[#4a2e1a]/50">
                    Pastikan data sesuai dengan KTP asli Anda
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0a1a0e] mb-2">
                    Nomor Induk Kependudukan (NIK)
                  </label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="16 digit NIK"
                    className="w-full bg-[#faf7f2] border border-[#ede4d3] rounded-xl px-4 py-3 text-sm text-[#0a1a0e] font-mono tracking-widest placeholder-[#4a2e1a]/30 focus:outline-none focus:border-[#4fa05c] focus:ring-2 focus:ring-[#4fa05c]/15 transition-all"
                  />
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-[#4a2e1a]/40">NIK terdiri dari 16 digit angka</p>
                    <p
                      className={`text-xs font-mono ${nik.length === 16 ? 'text-[#4fa05c]' : 'text-[#4a2e1a]/40'}`}
                    >
                      {nik.length}/16
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0a1a0e] mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value.toUpperCase())}
                    placeholder="SESUAI KTP"
                    className="w-full bg-[#faf7f2] border border-[#ede4d3] rounded-xl px-4 py-3 text-sm text-[#0a1a0e] uppercase tracking-wide placeholder-[#4a2e1a]/30 focus:outline-none focus:border-[#4fa05c] focus:ring-2 focus:ring-[#4fa05c]/15 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0a1a0e] mb-2">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-[#faf7f2] border border-[#ede4d3] rounded-xl px-4 py-3 text-sm text-[#0a1a0e] focus:outline-none focus:border-[#4fa05c] focus:ring-2 focus:ring-[#4fa05c]/15 transition-all"
                  />
                </div>

                <div className="bg-[#f5a623]/8 border border-[#f5a623]/20 rounded-xl p-4 flex gap-3">
                  <span className="text-base shrink-0">🔒</span>
                  <p className="text-xs text-[#4a2e1a]/60 leading-relaxed">
                    Data Anda dienkripsi dan digunakan hanya untuk keperluan verifikasi identitas.
                    PanenTara tidak menyimpan salinan KTP Anda secara permanen.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Upload KTP */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#f0f9f1] flex items-center justify-center text-lg">
                  📷
                </div>
                <div>
                  <h2 className="font-display text-xl text-[#0a1a0e]">Foto KTP</h2>
                  <p className="text-sm text-[#4a2e1a]/50">Upload foto bagian depan KTP Anda</p>
                </div>
              </div>

              <input
                ref={ktpRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0], 'ktp')
                }}
              />

              {ktpPreview ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-[#4fa05c] mb-4">
                  <img src={ktpPreview} alt="KTP preview" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-[#0a1a0e]/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setKtpFile(null)
                        setKtpPreview('')
                      }}
                      className="bg-white text-[#0a1a0e] text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      Ganti Foto
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDrop={(e) => handleDrop(e, 'ktp')}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => ktpRef.current?.click()}
                  className="border-2 border-dashed border-[#b2dcb3] rounded-xl p-10 text-center cursor-pointer hover:border-[#4fa05c] hover:bg-[#f0f9f1] transition-all group mb-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#f0f9f1] group-hover:bg-[#ddf0de] flex items-center justify-center mx-auto mb-4 transition-colors text-2xl">
                    📋
                  </div>
                  <p className="text-sm font-semibold text-[#0a1a0e] mb-1">
                    Klik atau seret foto KTP ke sini
                  </p>
                  <p className="text-xs text-[#4a2e1a]/50">Format JPG, PNG, HEIC · Maks. 10 MB</p>
                </div>
              )}

              <div className="bg-[#f0f9f1] rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-[#377a44] mb-2">Tips foto yang baik:</p>
                {[
                  'Pastikan seluruh kartu terlihat jelas',
                  'Foto tidak buram atau terpotong',
                  'Cahaya cukup, hindari pantulan',
                  'Semua teks dapat terbaca',
                ].map((tip) => (
                  <div key={tip} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#ddf0de] flex items-center justify-center shrink-0">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path
                          d="M1.5 4L3.2 6L6.5 2"
                          stroke="#377a44"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-xs text-[#4a2e1a]/60">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Selfie */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#f0f9f1] flex items-center justify-center text-lg">
                  🤳
                </div>
                <div>
                  <h2 className="font-display text-xl text-[#0a1a0e]">Foto Selfie dengan KTP</h2>
                  <p className="text-sm text-[#4a2e1a]/50">Pegang KTP di samping wajah Anda</p>
                </div>
              </div>

              <input
                ref={selfieRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0], 'selfie')
                }}
              />

              {/* Guide frame */}
              <div className="relative bg-[#0a1a0e] rounded-2xl overflow-hidden mb-4 aspect-[4/3]">
                {selfiePreview ? (
                  <img
                    src={selfiePreview}
                    alt="Selfie preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    {/* Face guide */}
                    <div className="relative">
                      <div className="w-24 h-28 border-2 border-dashed border-[#4fa05c]/60 rounded-full" />
                      <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-10 border-2 border-dashed border-[#f5a623]/60 rounded-md" />
                    </div>
                    <p className="text-white/50 text-xs text-center px-8">
                      Posisikan wajah dan KTP dalam bingkai
                    </p>
                  </div>
                )}
                {/* Corner guides */}
                {!selfiePreview && (
                  <>
                    {[
                      ['top-3 left-3', 'border-t-2 border-l-2'],
                      ['top-3 right-3', 'border-t-2 border-r-2'],
                      ['bottom-3 left-3', 'border-b-2 border-l-2'],
                      ['bottom-3 right-3', 'border-b-2 border-r-2'],
                    ].map(([pos, border]) => (
                      <div
                        key={pos}
                        className={`absolute ${pos} w-5 h-5 ${border} border-[#4fa05c]/70`}
                      />
                    ))}
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => selfieRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#0a1a0e] text-white font-semibold py-3 rounded-xl hover:bg-[#1e4226] transition-colors text-sm"
                >
                  <span>📁</span> Upload Foto
                </button>
                {selfiePreview && (
                  <button
                    onClick={() => {
                      setSelfieFile(null)
                      setSelfiePreview('')
                    }}
                    className="px-4 py-3 border border-[#ede4d3] rounded-xl text-sm text-[#4a2e1a]/60 hover:border-[#b2dcb3] transition-colors"
                  >
                    Ulang
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#f0f9f1] flex items-center justify-center text-lg">
                  ✅
                </div>
                <div>
                  <h2 className="font-display text-xl text-[#0a1a0e]">Review & Kirim</h2>
                  <p className="text-sm text-[#4a2e1a]/50">Periksa kembali sebelum mengirim</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#faf7f2] rounded-xl border border-[#ede4d3] divide-y divide-[#ede4d3]">
                  {[
                    { label: 'NIK', value: nik || '3201234567890001', icon: '🪪' },
                    { label: 'Nama Lengkap', value: fullName || 'BUDI SANTOSO', icon: '👤' },
                    {
                      label: 'Tanggal Lahir',
                      value: dob
                        ? new Date(dob).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : '12 Januari 1985',
                      icon: '📅',
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 px-4 py-3">
                      <span className="text-base">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs text-[#4a2e1a]/50">{item.label}</p>
                        <p className="text-sm font-semibold text-[#0a1a0e]">{item.value}</p>
                      </div>
                      <button
                        onClick={() => setStep(0)}
                        className="text-xs text-[#377a44] font-medium hover:text-[#4fa05c]"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Foto KTP', preview: ktpPreview, step: 1 },
                    { label: 'Foto Selfie', preview: selfiePreview, step: 2 },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-[#ede4d3] overflow-hidden"
                    >
                      {item.preview ? (
                        <img
                          src={item.preview}
                          alt={item.label}
                          className="w-full h-24 object-cover"
                        />
                      ) : (
                        <div className="w-full h-24 bg-[#faf7f2] flex items-center justify-center text-2xl">
                          {item.label === 'Foto KTP' ? '📋' : '🤳'}
                        </div>
                      )}
                      <div className="flex items-center justify-between px-3 py-2">
                        <p className="text-xs text-[#4a2e1a]/60">{item.label}</p>
                        <button
                          onClick={() => setStep(item.step)}
                          className="text-xs text-[#377a44] font-medium"
                        >
                          Ganti
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#f0f9f1] border border-[#b2dcb3] rounded-xl p-4 flex gap-3">
                  <span className="text-base shrink-0 mt-0.5">⏱️</span>
                  <div>
                    <p className="text-xs font-semibold text-[#377a44] mb-0.5">
                      Proses verifikasi 1–2 hari kerja
                    </p>
                    <p className="text-xs text-[#4a2e1a]/55 leading-relaxed">
                      Tim kami akan meninjau dokumen Anda. Notifikasi akan dikirim via email dan SMS
                      setelah selesai.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 px-5 py-3 border border-[#ede4d3] rounded-xl text-sm text-[#4a2e1a]/70 hover:border-[#b2dcb3] font-medium transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M9 11L5 7L9 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Kembali
              </button>
            )}
            <button
              onClick={next}
              disabled={!canNext() || loading}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${canNext() && !loading ? 'bg-[#0a1a0e] text-white hover:bg-[#1e4226]' : 'bg-[#ede4d3] text-[#4a2e1a]/40 cursor-not-allowed'}`}
            >
              {loading ? (
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
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="20 10"
                  />
                </svg>
              ) : step === steps.length - 1 ? (
                'Kirim Verifikasi'
              ) : (
                'Lanjut'
              )}
              {!loading && step < steps.length - 1 && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M5 3L9 7L5 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
