import { redirect } from 'next/navigation'
import VerifyKTP from '@/components/panentara/VerifyKTP'
import { getCurrentUser } from '@/lib/app-auth'

export default async function VerifyKtpPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return <VerifyKTP />
}
