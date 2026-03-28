import { PlayerDetailEntity } from '@/model/response/player-detail.response.interface'
import React from 'react'
import InfoIcon from '@mui/icons-material/Info'
import { COLORS } from '@/util/colors'

type PlayerInsightsProps = {
  playerDetailEntity: PlayerDetailEntity
}

const PlayerInsights: React.FC<PlayerInsightsProps> = (props: PlayerInsightsProps) => {
  const { playerDetailEntity } = props
  const { name, tournamentStats } = playerDetailEntity
  const diff = 100 - tournamentStats.points
  const absDiff = Math.abs(diff)

  if (diff === 0 || isNaN(diff)) return <></>

  return (
    <div className='rounded-lg border shadow-md p-2 w-full max-w-lg bg-white flex flex-row items-center gap-2 mb-4'>
      <InfoIcon sx={{ color: COLORS.cricPrimary }} />

      <div className='italic my-2 text-sm text-left'>
        {diff > 0 ? (
          <>
            If {name} had been in your Playing XI for all matches, you would have gained an
            additional <span className='font-semibold'>{absDiff} points</span>.
          </>
        ) : (
          <>
            If {name} had been in your Playing XI for all matches, you would have scored{' '}
            <span className='font-semibold'>{absDiff} points less</span>.
          </>
        )}
      </div>
    </div>
  )
}

export default PlayerInsights
