import { PlayerInsightsEntity } from '@/model/entities/player-insights.interface'
import React from 'react'

type PlayerInsightsProps = {
  insights: PlayerInsightsEntity
}

const PlayerInsights: React.FC<PlayerInsightsProps> = (props: PlayerInsightsProps) => {
  const { insights } = props
  const labelStyle = 'text-sm text-gray-500'
  const valueStyle = 'text-md font-semibold text-cricPrimary'

  return (
    <div className='rounded-lg border shadow-md p-4 w-full max-w-lg bg-white'>
      <h2 className='text-lg font-bold text-gray-800 mb-4'>Performance Insights</h2>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div>
          <div className={labelStyle}>Average Points</div>
          <div className={valueStyle}>{insights.averagePoints.toFixed(1)}</div>
        </div>
        <div>
          <div className={labelStyle}>Consistency (Std Dev)</div>
          <div className={valueStyle}>{insights.consistency.toFixed(1)}</div>
        </div>
        <div>
          <div className={labelStyle}>Best Match</div>
          <div className={valueStyle}>
            {insights.bestMatch.totalMatchPoints} pts <br />
            <span className='text-xs text-gray-500'>{insights.bestMatch.matchDesc}</span>
          </div>
        </div>
        <div>
          <div className={labelStyle}>Worst Match</div>
          <div className={valueStyle}>
            {insights.worstMatch.totalMatchPoints} pts <br />
            <span className='text-xs text-gray-500'>{insights.worstMatch.matchDesc}</span>
          </div>
        </div>
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
