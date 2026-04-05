import { useRequest } from '@/hooks/useRequest'
import { MatchDeepDiveEntity } from '@/model/response/match-deepdive.response.interface'
import { MatchWiseDetailEntity } from '@/model/response/player-detail.response.interface'
import { useTournament } from '@/providers/TournamentProvider'
import { COLORS } from '@/util/colors'
import { PLAYERS } from '@/util/constants/endpoints'
import { convertToSentenceCase } from '@/util/helper'
import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

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
  const [showOtherStats, setShowOtherStats] = useState(false)

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

  const pointSplitStats = Object.entries(playerDetailEntity || {}).filter(
    ([key]) => !knownFields.includes(key),
  )
  const nonZeroStats = pointSplitStats.filter(([, value]) => value !== '0' && value !== '0.0')
  const zeroStats = pointSplitStats.filter(([, value]) => value === '0' || value === '0.0')

  return (
    <div>
      <div className='mt-2'>
        {playerDetailEntity && (
          <>
            {nonZeroStats.map(([statKey, statValue]) => (
              <div
                key={statKey}
                className={`flex justify-between gap-4 text-sm font-bold`}
                style={{
                  color: COLORS.cricPrimary,
                }}
              >
                <div className='capitalize'>{convertToSentenceCase(statKey)}</div>
                <div>{statValue}</div>
              </div>
            ))}
            <div className='my-2 border-t border-gray-300'></div>
            <div className='flex justify-between' onClick={() => setShowOtherStats(prev => !prev)}>
              <div className={`text-sm ${showOtherStats ? 'text-gray-500' : 'text-gray-500'}`}>
                {showOtherStats ? 'Click to Collapse' : 'Expand to view other potential milestones'}
              </div>
              {showOtherStats ? (
                <ExpandLessIcon className='text-gray-500' />
              ) : (
                <ExpandMoreIcon className='text-gray-500' />
              )}
            </div>

            {showOtherStats &&
              zeroStats.map(([statKey, statValue]) => (
                <div key={statKey} className={`flex justify-between gap-4 text-sm`}>
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
