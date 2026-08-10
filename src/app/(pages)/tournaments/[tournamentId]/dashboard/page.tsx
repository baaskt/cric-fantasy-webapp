'use client'
import DashboardTeams from '@/components/dashboard/DashboardTeams'
import Insights from '@/components/dashboard/Insights'
import MatchPreviewList from '@/components/matches/MatchPreviewList'
import DailyTender from '@/components/tender/DailyTender'
import { useMatch } from '@/providers/MatchProvider'
import { useTournament } from '@/providers/TournamentProvider'

export default function Dashboard() {
  const { activeTournament } = useTournament()
  const { liveMatches } = useMatch()

  return (
    <div>
      <div className='text-center p-2 bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 text-white font-bold'>
        {activeTournament?.tournamentName}
      </div>
      <DailyTender />

      {liveMatches?.length ? (
        <div className='p-5 pt-5'>
          <MatchPreviewList showLiveMatches></MatchPreviewList>
        </div>
      ) : (
        <Insights />
      )}
      <DashboardTeams />
    </div>
  )
}
