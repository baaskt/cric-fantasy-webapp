'use client'

import React, { useEffect, useState } from 'react'
import { useRequest } from '@/hooks/useRequest'
import { useTournament } from '@/providers/TournamentProvider'
import { TOURNAMENTS } from '@/util/constants/endpoints'
import { CricResponse } from '@/model/types/cric-response.type'
import { InsightsResponse } from '@/model/response/insights-response.interface'
import InsightCard from './InsightCard'
import { InsightsType } from '@/model/enum/insight-type.enum'
import InsightsIcon from '@mui/icons-material/Insights'
import { COLORS } from '@/util/colors'

function Insights() {
  const [insightsData, setInsightsData] = useState<InsightsResponse>()
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const TOURNAMENT_STATS_URL = tournamentId
    ? `${TOURNAMENTS.GET_STATS.replace('tournamentId', tournamentId)}`
    : ''

  const insightRequest = useRequest(TOURNAMENT_STATS_URL)

  useEffect(() => {
    if (insightRequest.data) {
      const insightsResponse = insightRequest.data as CricResponse<InsightsResponse[]>
      setInsightsData(insightsResponse?.result && insightsResponse?.result[0])
    }
  }, [insightRequest.data])

  if (!insightsData) return <></>

  return (
    <div className='p-5 pt-0'>
      <div className='flex gap-2 p-3 items-center'>
        <InsightsIcon style={{ color: COLORS.cricPrimary }} />
        <div className='text-xl'>Insights</div>
      </div>
      <div className='flex gap-5 flex-wrap justify-around'>
        <InsightCard type={InsightsType.RUNS} title={'Maximum Runs'} data={insightsData.runs} />
        <InsightCard
          type={InsightsType.WICKETS}
          title={'Maximum Wickets'}
          data={insightsData.wickets}
        />
      </div>
    </div>
  )
}

export default Insights
