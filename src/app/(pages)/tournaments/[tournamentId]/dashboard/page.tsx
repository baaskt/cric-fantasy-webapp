import DashboardTeams from '@/components/dashboard/DashboardTeams'
import Insights from '@/components/dashboard/Insights'
// import Podium from '@/components/dashboard/Podium'

export default function Dashboard() {
  return (
    <div>
      <Insights />
      {/* <Podium /> */}
      <DashboardTeams />
    </div>
  )
}
