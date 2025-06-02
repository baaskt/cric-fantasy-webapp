import { useRequest } from '@/hooks/useRequest'
import { MatchDeepDiveEntity } from '@/model/response/match-deepdive.response.interface'
import { MatchWiseDetailEntity } from '@/model/response/player-detail.response.interface'
import { useTournament } from '@/providers/TournamentProvider'
import { COLORS } from '@/util/colors'
import { PLAYERS } from '@/util/constants/endpoints'
import { convertToSentenceCase } from '@/util/helper'
import React, { useEffect, useState } from 'react'

interface PlayerDeepDiveProps {
  matchData: MatchWiseDetailEntity | undefined
  playerId: number
  playerName: string
}
function PlayerDeepDive(props: PlayerDeepDiveProps) {
  const { matchData, playerId, playerName } = props
  const knownFields = ['playerId', 'name', 'inPlayingXI', 'team', 'totalMatchPoints']

  const [playerDetailEntity, setPlayerDetailEntity] = useState<MatchDeepDiveEntity>()
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const PLAYER_DD_URL =
    tournamentId && matchData
      ? `${PLAYERS.GET_PLAYER_DD_URL.replace('{matchId}', matchData.matchId).replace(
          '{tournamentId}',
          tournamentId,
        )}`
      : ''
  const playerDetailRequest = useRequest(PLAYER_DD_URL)

  useEffect(() => {
    if (playerDetailRequest.data) {
      const playerDetailResponse: MatchDeepDiveEntity[] =
        playerDetailRequest.data as MatchDeepDiveEntity[]
      if (playerDetailResponse) {
        const matchingPlayer = playerDetailResponse.find(
          matchData => matchData.playerId === playerId.toString(),
        )
        setPlayerDetailEntity(matchingPlayer)
      }
    }
  }, [playerDetailRequest.data])

  if (playerDetailRequest.isLoading) return <>Loading...</>

  return (
    <div>
      <div className='text-center' style={{ color: COLORS.cricPrimary }}>
        <div className='font-bold'>{playerName}</div>
        <div>{matchData?.matchDesc}</div>
      </div>
      <div className='mt-2'>
        {playerDetailEntity && (
          <>
            {Object.entries(playerDetailEntity)
              .filter(([key]) => !knownFields.includes(key))
              .map(([statKey, statValue]) => (
                <div
                  key={statKey}
                  className={`flex justify-between gap-4 text-sm ${statValue !== '0' ? 'font-bold' : ''}`}
                  style={{ color: statValue !== '0' ? COLORS.cricPrimary : '' }}
                >
                  <div className='capitalize'>{convertToSentenceCase(statKey)}</div>
                  <div>{statValue}</div>
                </div>
              ))}
          </>
        )}

        <div className='flex justify-between gap-4 text-md font-bold mt-2'>
          <div className='italic'>Total Points</div>
          <div style={{ color: COLORS.cricPrimary }}>{matchData?.totalMatchPoints}</div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDeepDive
