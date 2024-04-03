import { useTournament } from '@/providers/TournamentProvider'
import React from 'react'
import MatchCard from './MatchCard'
import { useRouter } from 'next/navigation'
import { MatchEntity } from '@/model/response/match.response'

type MatchListProps = {
  matchList: MatchEntity[]
}

function MatchList(props: MatchListProps) {
  const { matchList } = props
  const { markActiveMatch } = useTournament()
  const router = useRouter()

  if (!matchList?.length) {
    return <p className='p-5'>No matches found</p>
  }

  const navigateToMatchSelect = (matchId: number) => {
    const selectedMatch = matchList.find(match => match.matchId === matchId)
    if (selectedMatch) markActiveMatch(selectedMatch)
    router.push('matches/detail')
  }

  return (
    <div className='flex flex-row flex-wrap justify-center gap-3'>
      {matchList.map((matchEntity, matchIndex) => (
        <MatchCard
          key={matchIndex}
          matchEntity={matchEntity}
          matchNumber={matchIndex + 1}
          onMatchSelect={navigateToMatchSelect}
        ></MatchCard>
      ))}
    </div>
  )
}

export default MatchList
