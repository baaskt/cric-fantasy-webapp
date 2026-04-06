'use client'
import DashboardTeams from '@/components/dashboard/DashboardTeams'
import Insights from '@/components/dashboard/Insights'
import MatchPreviewList from '@/components/matches/MatchPreviewList'
import CricAnimatedDots from '@/components/ui/CricAnimatedDots'
import { useMatch } from '@/providers/MatchProvider'
import { useTournament } from '@/providers/TournamentProvider'

export default function Dashboard() {
  const { activeTournament } = useTournament()
  const { matchList, liveMatches } = useMatch()
  if (!matchList.length) return <CricAnimatedDots></CricAnimatedDots>

  return (
    <div>
      <div className='text-center p-2 bg-violet-300 font-bold'>
        {activeTournament?.tournamentName}
      </div>

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
