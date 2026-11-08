import { redirect } from 'next/navigation'
import Login from '@/components/panentara/Login'
import { getCurrentUser } from '@/lib/app-auth'

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect('/dashboard')
  return <Login />
}
