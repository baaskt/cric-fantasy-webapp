import { useRequest } from '@/hooks/useRequest'
import { MatchDeepDiveEntity } from '@/model/response/match-deepdive.response.interface'
import { MatchWiseDetailEntity } from '@/model/response/player-detail.response.interface'
import { useTournament } from '@/providers/TournamentProvider'
import { COLORS } from '@/util/colors'
import { PLAYERS } from '@/util/constants/endpoints'
import { convertToSentenceCase } from '@/util/helper'
import React, { useEffect, useState } from 'react'
import Loading from '../Loading'

interface PlayerDeepDiveProps {
  matchData: MatchWiseDetailEntity | undefined
  playerId: number
  playerName: string
}
function PlayerDeepDive(props: PlayerDeepDiveProps) {
  const { matchData, playerId } = props
  const knownFields = ['playerId', 'name', 'inPlayingXI', 'team', 'totalMatchPoints']

  const [playerDetailEntity, setPlayerDetailEntity] = useState<MatchDeepDiveEntity>()
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const PLAYER_DD_URL =
    tournamentId && matchData && playerId
      ? `${PLAYERS.GET_PLAYER_DD_URL.replace('{matchId}', matchData.matchId)
          .replace('{tournamentId}', tournamentId)
          .replace('{playerId}', playerId.toString())}`
      : ''
  const playerDetailRequest = useRequest(PLAYER_DD_URL)

  useEffect(() => {
    if (playerDetailRequest.data) {
      const playerDetailResponse: MatchDeepDiveEntity[] =
        playerDetailRequest.data as MatchDeepDiveEntity[]
      if (playerDetailResponse) {
        setPlayerDetailEntity(playerDetailResponse[0])
      }
    }
  }, [playerDetailRequest.data])

  if (playerDetailRequest.isLoading) return <Loading txt={'Fetching point split...'}></Loading>

  return (
    <div>
      <div className='mt-2'>
        {playerDetailEntity && (
          <>
            {Object.entries(playerDetailEntity)
              .filter(([key]) => !knownFields.includes(key))
              .map(([statKey, statValue]) => (
                <div
                  key={statKey}
                  className={`flex justify-between gap-4 text-sm ${statValue !== '0' && statValue !== '0.0' ? 'font-bold' : ''}`}
                  style={{
                    color: statValue !== '0' && statValue !== '0.0' ? COLORS.cricPrimary : '',
                  }}
                >
                  <div className='capitalize'>{convertToSentenceCase(statKey)}</div>
                  <div>{statValue}</div>
                </div>
              ))}
          </>
        )}

        {!playerDetailEntity?.inPlayingXI && (
          <div className='text-sm text-center mt-2'>
            <span className='text-red-400'>
              This player was not included in the playing XI for this match missing{' '}
            </span>
            <span className='font-bold text-red-700 italic'>
              {playerDetailEntity?.totalMatchPoints} points
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerDeepDive
