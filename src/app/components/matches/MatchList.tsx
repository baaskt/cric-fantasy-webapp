'use client'
import { useRequest } from '@/hooks/useRequest'
import { MatchEntity } from '@/model/response/match.response'
import { CricResponse } from '@/model/types/cric-response.type'
import { useTournament } from '@/providers/TournamentProvider'
import { MATCHES } from '@/util/constants/endpoints'
import React, { useEffect } from 'react'
import Loading from '../Loading'
import { MATCH } from '@/util/constants/constants'
import MatchCard from './MatchCard'
import { useRouter } from 'next/navigation'

function MatchList() {
  const { matchList, setMatchesList, markActiveMatch } = useTournament()
  const matchRequest = useRequest(MATCHES.GET_ALL)
  const router = useRouter()

  useEffect(() => {
    if (matchRequest.data) {
      const matchresponse: CricResponse<MatchEntity[]> = matchRequest.data as CricResponse<
        MatchEntity[]
      >
      if (matchresponse.result) {
        setMatchesList(matchresponse.result)
      }
    }
  }, [matchRequest?.data])

  if (matchRequest.isValidating) {
    return <Loading txt={MATCH.LOADING_TXT}></Loading>
  }

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
