'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { clearAppSession, setAppSession } from '@/lib/app-auth'

export type AuthActionState = {
  ok: boolean
  message: string
  next?: '/dashboard' | '/verify-ktp'
  fieldErrors?: Partial<Record<'name' | 'email' | 'password' | 'role', string>>
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const stringValue = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function authenticate(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const mode = stringValue(formData, 'mode')
  const email = stringValue(formData, 'email').toLowerCase()
  const password = stringValue(formData, 'password')
  const name = stringValue(formData, 'name')
  const role = stringValue(formData, 'role')

  const fieldErrors: AuthActionState['fieldErrors'] = {}
  if (!emailPattern.test(email)) fieldErrors.email = 'Masukkan alamat email yang valid.'
  if (password.length < 8) fieldErrors.password = 'Password minimal 8 karakter.'

  if (mode === 'register') {
    if (name.length < 3 || name.length > 100) {
      fieldErrors.name = 'Nama harus terdiri dari 3–100 karakter.'
    }
    if (role !== 'petani' && role !== 'pembeli') {
      fieldErrors.role = 'Pilih peran akun Anda.'
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: 'Periksa kembali data yang Anda isi.', fieldErrors }
  }

  const payload = await getPayload({ config })

  try {
    if (mode === 'register') {
      await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          name,
          role: role as 'petani' | 'pembeli',
        },
        context: { publicRegistration: true },
        overrideAccess: true,
      })
    }

    const result = await payload.login({
      collection: 'users',
      data: { email, password },
      overrideAccess: true,
    })

    if (!result.token) {
      return { ok: false, message: 'Sesi tidak dapat dibuat. Silakan coba lagi.' }
    }

    await setAppSession(result.token, result.exp)
    return {
      ok: true,
      message: mode === 'register' ? 'Akun berhasil dibuat.' : 'Berhasil masuk.',
      next: mode === 'register' && role === 'petani' ? '/verify-ktp' : '/dashboard',
    }
  } catch {
    return {
      ok: false,
      message:
        mode === 'register'
          ? 'Email sudah digunakan atau data akun belum valid.'
          : 'Email atau password tidak sesuai.',
    }
  }
}

export async function logout() {
  await clearAppSession()
  return { ok: true }
}
