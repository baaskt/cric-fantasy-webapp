'use client'
import DashboardTeams from '@/components/dashboard/DashboardTeams'
import Insights from '@/components/dashboard/Insights'
import { useTournament } from '@/providers/TournamentProvider'

export default function Dashboard() {
  const { activeTournament } = useTournament()

  return (
    <div>
      <div className='text-center p-2 bg-violet-300 font-bold'>
        {activeTournament?.tournamentName}
      </div>
      <Insights />
      <DashboardTeams />
    </div>
  )
}
