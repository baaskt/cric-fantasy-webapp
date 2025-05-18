import { COLORS } from '@/util/colors'
import React from 'react'

interface MatchPlayerDetailProps {
  matchData: MatchHistoryDetails | undefined
}
function MatchPlayerDetail(props: MatchPlayerDetailProps) {
  const { matchData } = props
  return (
    <div>
      <div className='font-bold' style={{ color: COLORS.cricPrimary }}>
        {matchData?.matchDesc}
      </div>
      <div className='mt-2'>
        {matchData &&
          Object.keys(matchData.players).map(playerName => (
            <div className='flex justify-between gap-4 text-sm' key={playerName}>
              <div className='italic'>{playerName}</div>
              <div style={{ color: COLORS.cricPrimary }}>{matchData.players[playerName]}</div>
            </div>
          ))}
        <div className='flex justify-between gap-4 text-md font-bold mt-2'>
          <div className='italic'>Total Points</div>
          <div style={{ color: COLORS.cricPrimary }}>{matchData?.totalMatchPoints}</div>
        </div>
      </div>
    </div>
  )
}

export default MatchPlayerDetail
