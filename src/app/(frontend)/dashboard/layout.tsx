import DashboardShell from '@/components/panentara/DashboardShell'
import { getCurrentUser, getDemoUser } from '@/lib/app-auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  const activeUser = user || (await getDemoUser())
  const isDemo = !user

  return (
    <DashboardShell user={activeUser} isDemo={isDemo}>
      {children}
    </DashboardShell>
  )
}
