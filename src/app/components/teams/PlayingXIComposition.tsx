import { SquadEntity } from '@/model/entities/squad.interface'
import { COLORS } from '@/util/colors'
import { PLAYER_ROLES, WK } from '@/util/player'
import React, { useEffect, useState } from 'react'
import CompositionCard from './CompositionCard'
import { TeamCompositionEntity } from '@/model/entities/team-composition.interface'

type PlayingXICompositionProps = {
  playersCount: number
  playingXISquad: Map<string, SquadEntity[]>
  composition: TeamCompositionEntity
}

function PlayingXIComposition(props: PlayingXICompositionProps) {
  const { playersCount, playingXISquad, composition } = props
  const [issues, setIssues] = useState<string[]>([])
  const { bat, bowl, allRound, wk, count } = composition

  useEffect(() => {
    if (composition) {
      const issues = getCompositionMismatchMsg()
      setIssues(issues)
    }
  }, [composition])

  const getCompositionMismatchMsg = () => {
    const minBat = 3,
      minBowl = 3,
      minAllRound = 1,
      minWK = 1
    const issues = []
    if (count < 11) {
      issues.push('You need 11 players in the playing XI')
    } else if (count > 11) {
      issues.push('More than 11 players in the playing XI')
    }
    if (bat < minBat) {
      issues.push(
        'At least 3 Batters (including batting All Rounders or Wicket Keeper Batsman) required',
      )
    }
    if (bowl < minBowl) {
      issues.push('At least 3 Bowlers (including bowling All Rounders) required')
    }
    if (allRound < minAllRound) {
      issues.push('At least 1 All Rounder required')
    }
    if (wk < minWK) {
      issues.push('At least 1 Wicket Keeper required')
    }

    return issues
  }
  return (
    <div>
      <div
        style={{
          color: COLORS.cricPrimary,
        }}
        className='text-lg p-5 font-semibold text-center italic'
      >
        Playing XI Composition
      </div>
      <div className='flex flex-wrap gap-2 pb-2 justify-center'>
        {PLAYER_ROLES.map(role => (
          <CompositionCard
            key={role}
            role={role}
            roleCount={playingXISquad.has(role) ? playingXISquad.get(role)?.length : 0}
            validComp={playingXISquad.has(WK) && playersCount === 11}
          />
        ))}
        <CompositionCard
          key={'total'}
          role={'Total'}
          roleCount={playersCount}
          validComp={playingXISquad.has(WK) && playersCount === 11}
        />
      </div>
      <ul className='list-disc pl-5 text-red-500 marker:text-red-700'>
        {!composition.isValid && playersCount ? (
          issues.map(issue => (
            <li key={issue} className='text-left italic'>
              {issue}
            </li>
          ))
        ) : (
          <></>
        )}
      </ul>
    </div>
  )
}

export default PlayingXIComposition
