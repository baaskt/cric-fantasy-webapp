import { PlayerInsightsEntity } from '@/model/entities/player-insights.interface'
import { PlayerDetailEntity } from '@/model/response/player-detail.response.interface'
import React from 'react'

type PlayerInsightsProps = {
  insights: PlayerInsightsEntity
  playerDetailEntity: PlayerDetailEntity
}

const PlayerInsights: React.FC<PlayerInsightsProps> = (props: PlayerInsightsProps) => {
  const { playerDetailEntity, insights } = props
  const { playerName, totalMatchPointsXI, totalMatchPoints } = playerDetailEntity
  const containerStyle = 'bg-gray-200 p-4 rounded-lg'
  const labelStyle = 'text-sm text-gray-500'
  const valueStyle = 'text-md font-semibold text-cricPrimary text-blue-950'

  return (
    <div className='rounded-lg border shadow-md p-4 w-full max-w-lg bg-white'>
      <div className='text-blue-950 mb-4 text-center'>
        <div className='font-bold text-xl'>{playerName}</div>
        <div className='text-sm'>{totalMatchPointsXI} points</div>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div className={containerStyle}>
          <div className={labelStyle}>Average Points</div>
          <div className={valueStyle}>{insights.averagePoints.toFixed(1)}</div>
        </div>
        <div className={containerStyle}>
          <div className={labelStyle}>Consistency (Std Dev)</div>
          <div className={valueStyle}>{insights.consistency.toFixed(1)}</div>
        </div>
        <div className={containerStyle}>
          <div className={labelStyle}>Best Match</div>
          <div className={valueStyle}>
            {insights.bestMatch.totalMatchPoints} pts <br />
            <span className='text-xs text-gray-800'>{insights.bestMatch.matchDesc}</span>
          </div>
        </div>
        <div className={containerStyle}>
          <div className={labelStyle}>Worst Match</div>
          <div className={valueStyle}>
            {insights.worstMatch.totalMatchPoints} pts <br />
            <span className='text-xs text-gray-800'>{insights.worstMatch.matchDesc}</span>
          </div>
        </div>
      </div>

      <div className='italic my-2 text-sm text-center'>
        {totalMatchPoints - totalMatchPointsXI !== 0 &&
          (() => {
            const diff = totalMatchPoints - totalMatchPointsXI
            const absDiff = Math.abs(diff)
            return diff > 0 ? (
              <>
                If {playerName} had been in your Playing XI for all matches, you would have gained
                an additional <span className='font-semibold'>{absDiff} points</span>.
              </>
            ) : (
              <>
                If {playerName} had been in your Playing XI for all matches, you would have scored{' '}
                <span className='font-semibold'>{absDiff} points less</span>.
              </>
            )
          })()}
      </div>

      {/* <div className='mt-4 space-y-2'>
        <InsightBar label='Matches > 100 pts' count={insights.matchesAbove100} />
        <InsightBar label='Matches > 50 pts' count={insights.matchesAbove50} />
        <InsightBar
          label='Negative Point Matches'
          count={insights.negativeMatches}
          color='text-red-500'
        />
      </div> */}
    </div>
  )
}

// const InsightBar = ({
//   label,
//   count,
//   color = 'text-cricPrimary',
// }: {
//   label: string
//   count: number
//   color?: string
// }) => {
//   return (
//     <div className='flex justify-between'>
//       <div className='text-sm text-gray-600'>{label}</div>
//       <div className={`text-sm font-medium ${color}`}>{count}</div>
//     </div>
//   )
// }

export default PlayerInsights
