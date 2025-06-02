'use client'

import Loading from '@/components/Loading'
import { useRequest } from '@/hooks/useRequest'
import {
  MatchWiseDetailEntity,
  PlayerDetailEntity,
} from '@/model/response/player-detail.response.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { useTournament } from '@/providers/TournamentProvider'
import { PLAYER } from '@/util/constants/constants'
import { PLAYERS } from '@/util/constants/endpoints'
import { IconButton } from '@mui/material'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import CricModal from '@/components/ui/CricModal'
import PlayerDeepDive from '@/components/players/PlayerDeepDive'
import { COLORS } from '@/util/colors'
import { generatePlayerInsights } from '@/util/player'
import PlayerInsights from '@/components/players/PlayerInsights'
import { PlayerInsightsEntity } from '@/model/entities/player-insights.interface'
import PlayerInsightsChart from '@/components/players/PlayerInsightsChart'

function PlayerDetail() {
  const params = useParams()
  const [open, setOpen] = useState<boolean>(false)
  const [matchData, setMatchData] = useState<MatchWiseDetailEntity>()
  const [playerDetailEntity, setPlayerDetailEntity] = useState<PlayerDetailEntity>()
  const [playerInsights, setPlayerInsights] = useState<PlayerInsightsEntity>()

  const playerId = params.playerId
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const PLAYER_DETAIL_URL = tournamentId
    ? `${PLAYERS.GET_PLAYER_DETAIL_URL.replace('{tournamentId}', tournamentId).replace(
        '{playerId}',
        playerId.toString(),
      )}`
    : ''
  const playerDetailRequest = useRequest(PLAYER_DETAIL_URL)

  useEffect(() => {
    if (playerDetailRequest.data) {
      const playerDetailResponse: CricResponse<PlayerDetailEntity[]> =
        playerDetailRequest.data as CricResponse<PlayerDetailEntity[]>
      if (playerDetailResponse.Result) {
        const tempPlayerDetail = playerDetailResponse.Result[0]
        if (tempPlayerDetail) {
          tempPlayerDetail.matchWiseDetails = tempPlayerDetail.matchWiseDetails.sort(
            (a, b) => Number(b.matchId) - Number(a.matchId),
          )
          const insights: PlayerInsightsEntity = generatePlayerInsights(tempPlayerDetail)
          setPlayerInsights(insights)
          setPlayerDetailEntity(tempPlayerDetail)
        }
      }
    }
  }, [playerDetailRequest.data])

  const handlePlayerDetail = (matchData: MatchWiseDetailEntity) => {
    setMatchData(matchData)
    setOpen(true)
  }

  if (playerDetailRequest.isValidating) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  if (!playerDetailEntity) {
    return <div className='text-center p-4'>No records found</div>
  }

  return (
    <div className='flex flex-col w-full'>
      {playerInsights && (
        <>
          <PlayerInsightsChart
            insights={playerInsights}
            matchWiseDetails={playerDetailEntity.matchWiseDetails}
          />
          <PlayerInsights insights={playerInsights} playerDetailEntity={playerDetailEntity} />
        </>
      )}
      <div className='mt-4 flex items-center justify-center transform rotate-[20deg]'>
        {/* Bat Handle */}
        <div className='h-8 w-24 bg-gray-800 rounded-l-lg ml-[-4px] rounded-r-sm shadow-sm'></div>

        {/* Bat Body */}
        <div className='relative bg-[#e0c097] text-blue-950 p-4 rounded-lg w-[200px] text-center shadow-lg'>
          <div className='font-bold'>Match Diary</div>
          <div className='text-sm italic'>{playerDetailEntity.matchWiseDetails.length} matches</div>
        </div>
      </div>

      <div className='p-2'>
        {playerDetailEntity.matchWiseDetails.map(matchData => (
          <div
            key={matchData.matchId}
            className='transition-transform duration-150 ease-in-out shadow-md p-4 rounded-lg flex flex-row justify-between items-center active:scale-95'
          >
            <div className='flex flex-col items-start gap-1'>
              <div className='font-bold'>{matchData.matchDesc}</div>
              <div className='text-md text-slate-600'>
                Match Points: {matchData.totalMatchPoints}
              </div>
            </div>
            <div>
              <IconButton onClick={() => handlePlayerDetail(matchData)}>
                <InfoIcon sx={{ color: COLORS.cricPrimary }} />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      <CricModal open={open} hideClose={false} onClose={() => setOpen(false)}>
        <PlayerDeepDive
          matchData={matchData}
          playerId={playerDetailEntity.playerId}
          playerName={playerDetailEntity.playerName}
        />
      </CricModal>
    </div>
  )
}

export default PlayerDetail
