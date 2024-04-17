import React, { useEffect } from 'react'
import { useRequest } from '@/hooks/useRequest'
import { useTournament } from '@/providers/TournamentProvider'
import { TOURNAMENTS } from '@/util/constants/endpoints'
function Insights() {
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const TOURNAMENT_STATS_URL = tournamentId
    ? `${TOURNAMENTS.GET_STATS.replace('tournamentId', tournamentId)}`
    : ''
  const matchDetailRequest = useRequest(TOURNAMENT_STATS_URL)

  useEffect(() => {}, [matchDetailRequest.data])
  return <div>Insights</div>
}

export default Insights
