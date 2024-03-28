import { ScoreEntity } from '@/model/response/match-detail.interface'
import React from 'react'

type MatchScoreProps = {
  score: ScoreEntity
}

function MatchScore(props: MatchScoreProps) {
  const { score } = props
  return (
    <div>
      <span className='font-bold text-lg'>{`${score.runs}/${score.wickets}`}</span>
      <span>{` (${(Math.round(score.overs * 10) / 10).toFixed(1)} Overs)`}</span>
    </div>
  )
}

export default MatchScore
