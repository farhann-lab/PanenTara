import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cookies } from 'next/headers'

export const APP_SESSION_COOKIE = 'app-session'
export const DEMO_ROLE_COOKIE = 'panentara-demo-role'

export type CurrentAppUser = {
  id: string
  name: string
  email: string
  role: 'petani' | 'pembeli'
  companyName?: string | null
  location?: string | null
  commodities?: string | null
  createdAt: string
  updatedAt: string
  collection: 'users'
}

export const DEMO_USER_PETANI: CurrentAppUser = {
  id: 'demo-petani-01',
  name: 'Budi Santoso (Demo Petani)',
  email: 'budi.santoso@panentara.id',
  role: 'petani',
  companyName: 'Kelompok Tani Makmur Subur',
  location: 'Malang, Jawa Timur',
  commodities: 'Cabai Merah Keriting, Jagung Hibrida, Bawang Merah',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  collection: 'users',
}

export const DEMO_USER_PEMBELI: CurrentAppUser = {
  id: 'demo-pembeli-01',
  name: 'Hendra Gunawan (Demo Pembeli)',
  email: 'hendra.gunawan@segarfood.id',
  role: 'pembeli',
  companyName: 'PT Segar Nusantara Retail',
  location: 'Kramat Jati, Jakarta Timur',
  commodities: 'Cabai Merah Keriting, Tomat Beef, Bawang Merah Super',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  collection: 'users',
}

export const DEMO_USER = DEMO_USER_PETANI

export async function getDemoUser(): Promise<CurrentAppUser> {
  const cookieStore = await cookies()
  const roleCookie = cookieStore.get(DEMO_ROLE_COOKIE)?.value
  return roleCookie === 'pembeli' ? DEMO_USER_PEMBELI : DEMO_USER_PETANI
}

export async function setDemoRole(role: 'petani' | 'pembeli') {
  const cookieStore = await cookies()
  cookieStore.set(DEMO_ROLE_COOKIE, role, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })
}

const toCurrentUser = (value: unknown): CurrentAppUser | null => {
  const user = value as Partial<CurrentAppUser> | null
  if (
    !user ||
    user.collection !== 'users' ||
    !user.id ||
    !user.name ||
    !user.email ||
    (user.role !== 'petani' && user.role !== 'pembeli') ||
    !user.createdAt ||
    !user.updatedAt
  ) {
    return null
  }

  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
    location: user.location,
    commodities: user.commodities,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    collection: 'users',
  }
}

export async function getCurrentUser(): Promise<CurrentAppUser | null> {
  const token = (await cookies()).get(APP_SESSION_COOKIE)?.value
  if (!token) return null

  const payload = await getPayload({ config })
  const authHeaders = new Headers({ Authorization: `JWT ${token}` })
  const { user } = await payload.auth({ headers: authHeaders })
  return toCurrentUser(user)
}

export async function setAppSession(token: string, exp?: number) {
  const cookieStore = await cookies()
  cookieStore.set(APP_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: exp ? new Date(exp * 1000) : undefined,
  })
}

export async function clearAppSession() {
  const cookieStore = await cookies()
  cookieStore.delete(APP_SESSION_COOKIE)
}
