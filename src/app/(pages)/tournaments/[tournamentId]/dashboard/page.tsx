import DashboardTeams from '@/components/dashboard/DashboardTeams'
import ResetSpin from '@/components/dashboard/ResetSpin'
import Insights from '@/components/dashboard/Insights'

export default function Dashboard() {
  return (
    <div>
      <ResetSpin />
      <Insights />
      <DashboardTeams />
    </div>
  )
}
