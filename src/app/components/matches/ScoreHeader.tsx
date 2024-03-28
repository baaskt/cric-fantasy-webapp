import { ScoreEntity } from '@/model/response/match-detail.interface'
import React from 'react'
import MatchScore from './MatchScore'

type ScoreHeaderProps = {
  teamName: string
  score: ScoreEntity
  status: string
  isVictory: boolean
  isMatchComplete: boolean
  isInnings2: boolean
}
function ScoreHeader(props: ScoreHeaderProps) {
  const { teamName, score, status, isVictory, isMatchComplete, isInnings2 } = props
  return (
    <div className='w-full flex justify-between items-center flex-col md:flex-row'>
      <div>
        <div className='flex gap-2'>
          <div className='text-center'>{teamName}</div>
          {isVictory && isMatchComplete && <div>&#10022;</div>}
        </div>
        <div className='text-sm italic text-center md:text-left'>
          {(isVictory && isMatchComplete) || (isInnings2 && !isMatchComplete)
            ? status.replace(teamName, '')
            : ''}
        </div>
      </div>
      <MatchScore score={score} />
    </div>
  )
}

export default ScoreHeader
